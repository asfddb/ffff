// ============================================================================
//  Game — orchestrates rendering, round flow, combat, economy and AI.
// ============================================================================
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { CONFIG, WEAPONS, type WeaponId, type WeaponDef, type AgentDef } from './config';
import { buildMap, type MapData, type Collider } from './map';
import { Player } from './player';
import { Bot } from './enemies';
import { Viewmodel, Effects } from './effects';
import { Input } from './input';
import { Hud } from './hud';
import { audio } from './audio';

type Phase = 'buy' | 'action' | 'roundend' | 'matchend';

interface Ability { charges: number; }
interface Smoke { pos: THREE.Vector3; mesh: THREE.Mesh; radius: number; life: number; }
interface Fire { pos: THREE.Vector3; mesh: THREE.Mesh; radius: number; life: number; tick: number; }
interface TempWall { collider: Collider; mesh: THREE.Mesh; life: number; }

const ENEMY_NAMES = ['Rook', 'Vex', 'Nyx', 'Kilo', 'Onyx'];
const ALLY_NAMES = ['Sol', 'Wren', 'Dex', 'Juno'];

export class Game {
  private container: HTMLElement;
  private hud: Hud;
  private input: Input;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private composer!: EffectComposer;
  private clock = new THREE.Clock();

  private map!: MapData;
  private colliders: Collider[] = [];
  private player!: Player;
  private viewmodel!: Viewmodel;
  private effects!: Effects;

  private allies: Bot[] = [];
  private enemies: Bot[] = [];

  private agent!: AgentDef;
  private abilities: Ability[] = [];
  private smokes: Smoke[] = [];
  private fires: Fire[] = [];
  private walls: TempWall[] = [];

  // Loadout / economy
  private credits = CONFIG.startingCredits;
  private currentWeapon: WeaponId = 'classic';
  private mag = 0;
  private reserve = 0;
  private fireTimer = 0;
  private reloadTimer = 0;
  private spread = 0;
  private aiming = false;
  private lossStreak = 0;

  // Round state
  private phase: Phase = 'buy';
  private phaseTimer = CONFIG.buyTime;
  private round = 1;
  private scoreAtk = 0;
  private scoreDef = 0;
  private playerKills = 0;
  private playerDeaths = 0;

  // Spike
  private spikePlanted = false;
  private spikePos = new THREE.Vector3();
  private spikeTimer = 0;
  private plantProgress = 0;
  private defuseProgress = 0;
  private spikeMesh!: THREE.Mesh;
  private lastBeep = 0;

  private running = false;
  private started = false;
  private paused = false;

  constructor(container: HTMLElement, hud: Hud, input: Input) {
    this.container = container;
    this.hud = hud;
    this.input = input;
  }

  // ---- Setup --------------------------------------------------------------
  setAgent(agent: AgentDef) {
    this.agent = agent;
    this.abilities = agent.abilities.map((a) => ({ charges: a.charges }));
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x223350, 55, 130);
    this.buildSky();

    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.05, 500);

    // Lighting
    const hemi = new THREE.HemisphereLight(0x9dc0ff, 0x2a2418, 1.15);
    this.scene.add(hemi);
    this.scene.add(new THREE.AmbientLight(0x4a5a72, 0.55));
    const sun = new THREE.DirectionalLight(0xfff2d8, 2.2);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 160;
    const s = 60;
    sun.shadow.camera.left = -s; sun.shadow.camera.right = s;
    sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
    sun.shadow.bias = -0.0005;
    this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0x3a5a8a, 0.5);
    fill.position.set(-20, 20, -30);
    this.scene.add(fill);

    // Map
    this.map = buildMap();
    this.colliders = this.map.colliders;
    this.scene.add(this.map.group);

    this.player = new Player(this.colliders, this.map.bounds);
    this.effects = new Effects(this.scene);

    this.viewmodel = new Viewmodel();
    this.camera.add(this.viewmodel.group);
    this.scene.add(this.camera);

    // Spike object
    const spikeGeo = new THREE.BoxGeometry(0.5, 0.7, 0.5);
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xff4655, emissive: 0xff4655, emissiveIntensity: 1.2, roughness: 0.4 });
    this.spikeMesh = new THREE.Mesh(spikeGeo, spikeMat);
    this.spikeMesh.visible = false;
    this.spikeMesh.castShadow = true;
    this.scene.add(this.spikeMesh);

    this.setupPost();
    this.spawnBots();

    window.addEventListener('resize', () => this.onResize());
    this.input.onKeyPress = (code) => this.onKeyPress(code);
  }

  private buildSky() {
    const geo = new THREE.SphereGeometry(250, 32, 16);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { top: { value: new THREE.Color(0x1a3a6b) }, bottom: { value: new THREE.Color(0x0a0d14) } },
      vertexShader: `varying vec3 vp; void main(){ vp = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vp; uniform vec3 top; uniform vec3 bottom;
        void main(){ float h = normalize(vp).y * 0.5 + 0.5; gl_FragColor = vec4(mix(bottom, top, pow(h,0.8)), 1.0); }`,
    });
    this.scene.add(new THREE.Mesh(geo, mat));
  }

  private setupPost() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.55, 0.6, 0.85);
    this.composer.addPass(bloom);
    this.composer.addPass(new OutputPass());
  }

  private spawnBots() {
    for (let i = 0; i < 4; i++) {
      const b = new Bot('ally', this.agent.color, ALLY_NAMES[i], 0.55 + Math.random() * 0.2);
      this.allies.push(b); this.scene.add(b.group);
    }
    for (let i = 0; i < 5; i++) {
      const b = new Bot('enemy', 0xff4655, ENEMY_NAMES[i], 0.45 + Math.random() * 0.35);
      this.enemies.push(b); this.scene.add(b.group);
    }
  }

  // ---- Round flow ---------------------------------------------------------
  start() {
    this.started = true;
    this.running = true;
    this.beginRound();
    this.clock.start();
    this.loop();
  }

  private beginRound() {
    this.phase = 'buy';
    this.phaseTimer = CONFIG.buyTime;
    this.spikePlanted = false;
    this.spikeMesh.visible = false;
    this.plantProgress = 0;
    this.defuseProgress = 0;
    this.smokes.forEach((s) => this.scene.remove(s.mesh)); this.smokes = [];
    this.fires.forEach((f) => this.scene.remove(f.mesh)); this.fires = [];
    this.walls.forEach((w) => { this.scene.remove(w.mesh); this.removeCollider(w.collider); }); this.walls = [];
    this.abilities = this.agent.abilities.map((a) => ({ charges: a.charges }));

    // reset player — face north (toward the sites at -z)
    this.player.spawn(this.map.attackerSpawn.clone(), 0);
    this.player.shield = this.player.shield; // keep bought shield? reset each round -> set 0
    this.player.shield = 0;

    // give default sidearm if unarmed
    if (this.round === 1) { this.credits = CONFIG.startingCredits; this.currentWeapon = 'classic'; }
    this.equip(this.currentWeapon, true);

    // spawn bots
    this.allies.forEach((b, i) => b.spawn(this.map.attackerSpawn.clone().add(new THREE.Vector3((i - 1.5) * 3, 0, 2)), 0));
    this.enemies.forEach((b, i) => b.spawn(this.map.defenderSpawn.clone().add(new THREE.Vector3((i - 2) * 3, 0, -2)), Math.PI));

    this.assignWaypoints();
    this.hud.openBuy(this.credits);
    this.hud.setPhase('BUY PHASE');
    this.hud.announce(`ROUND ${this.round}`, '#ffd166');
    this.hud.setScore(this.scoreAtk, this.scoreDef, this.round);
    this.hud.setSpike('', false);
    this.hud.setAgent(this.agent.name);
    this.updateHud();
  }

  private assignWaypoints() {
    // attackers push toward site A or B (pick A this round-ish)
    const target = this.round % 2 === 0 ? this.map.siteA : this.map.siteB;
    this.allies.forEach((b) => b.setWaypoint(target.clone().add(new THREE.Vector3((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6))));
    // defenders hold both sites
    this.enemies.forEach((b, i) => {
      const site = i < 3 ? this.map.siteA : this.map.siteB;
      b.setWaypoint(site.clone().add(new THREE.Vector3((Math.random() - 0.5) * 8, 0, (Math.random() - 0.5) * 8)));
    });
  }

  private startAction() {
    this.hud.closeBuy();
    this.phase = 'action';
    this.phaseTimer = CONFIG.roundTime;
    this.hud.setPhase('LIVE');
    if (!this.input.locked) this.input.requestLock();
  }

  private endRound(attackersWin: boolean) {
    if (this.phase === 'roundend' || this.phase === 'matchend') return;
    this.phase = 'roundend';
    this.phaseTimer = 5;

    if (attackersWin) { this.scoreAtk++; this.credits += CONFIG.reward.win; this.lossStreak = 0; audio.roundWin(); this.hud.announce('ROUND WON', '#39d98a'); }
    else {
      this.scoreDef++;
      this.credits += CONFIG.reward.loss + this.lossStreak * CONFIG.reward.lossBonusStep;
      this.lossStreak = Math.min(this.lossStreak + 1, 3);
      audio.roundLoss();
      this.hud.announce('ROUND LOST', '#ff5b5b');
    }
    this.credits = Math.min(this.credits, CONFIG.maxCredits);
    this.hud.setScore(this.scoreAtk, this.scoreDef, this.round);

    if (this.scoreAtk >= CONFIG.roundsToWin || this.scoreDef >= CONFIG.roundsToWin) {
      this.phase = 'matchend';
      const win = this.scoreAtk >= CONFIG.roundsToWin;
      this.hud.announce(win ? 'VICTORY' : 'DEFEAT', win ? '#ffd166' : '#ff5b5b', 8000);
      this.input.exitLock();
    }
    this.updateHud();
  }

  private nextRound() {
    this.round++;
    this.beginRound();
  }

  // ---- Loadout ------------------------------------------------------------
  private equip(id: WeaponId, resetAmmo: boolean) {
    this.currentWeapon = id;
    const w = WEAPONS[id];
    if (resetAmmo) { this.mag = w.magazine; this.reserve = w.reserve; }
    this.reloadTimer = 0;
    this.spread = 0;
    this.viewmodel.setWeapon(w);
    this.updateHud();
  }

  private buy(id: WeaponId) {
    if (this.phase !== 'buy') return;
    const w = WEAPONS[id];
    if (this.credits < w.cost) return;
    this.credits -= w.cost;
    this.equip(id, true);
    audio.buy();
    this.hud.updateBuyAffordability(this.credits);
    this.updateHud();
  }

  private buyShield(kind: 'light' | 'heavy') {
    if (this.phase !== 'buy') return;
    const cost = kind === 'light' ? 400 : 1000;
    const amount = kind === 'light' ? 25 : 50;
    if (this.credits < cost || this.player.shield >= amount) return;
    this.credits -= cost;
    this.player.shield = amount;
    audio.buy();
    this.hud.updateBuyAffordability(this.credits);
    this.updateHud();
  }

  // ---- Input events -------------------------------------------------------
  private onKeyPress(code: string) {
    if (!this.started) return;
    if (code === 'KeyB' && this.phase === 'buy') { this.hud.toggleBuy(this.credits); if (this.hud.isBuyOpen()) this.input.exitLock(); else this.input.requestLock(); }
    if ((code === 'Enter' || code === 'NumpadEnter') && this.phase === 'buy') this.startAction();
    if (code === 'KeyR') this.tryReload();
    if (code === 'Digit1') this.equipCategory('rifle', 'sniper');
    if (code === 'Digit2') this.equipCategory('sidearm');
    if (code === 'Digit3') this.equip('knife', true);
    if (code === 'KeyE') this.useAbility(0);
    if (code === 'KeyQ') this.useAbility(1);
    if (code === 'KeyC') this.useAbility(2);
    if (code === 'Escape' && this.hud.isBuyOpen()) { this.hud.closeBuy(); }
  }

  private equipCategory(...cats: string[]) {
    // switch back to the "primary" bought weapon vs sidearm
    const w = WEAPONS[this.currentWeapon];
    if (cats.includes('sidearm')) { /* no separate storage; keep it simple */ }
    void w; void cats;
  }

  private tryReload() {
    const w = WEAPONS[this.currentWeapon];
    if (w.category === 'melee') return;
    if (this.reloadTimer > 0 || this.mag >= w.magazine || this.reserve <= 0) return;
    this.reloadTimer = w.reloadTime;
    audio.reload();
  }

  // ---- Abilities ----------------------------------------------------------
  private useAbility(idx: number) {
    if (this.phase !== 'action' || !this.player.alive) return;
    const ab = this.agent.abilities[idx];
    const state = this.abilities[idx];
    if (!ab || state.charges <= 0) return;
    state.charges--;
    audio.ability();

    const eye = this.player.eyePosition();
    const dir = this.player.direction;
    const ground = this.rayGround(eye, dir, 20);

    switch (ab.kind) {
      case 'dash': {
        const d = new THREE.Vector3(-Math.sin(this.player.yaw), 0, -Math.cos(this.player.yaw));
        const move = new THREE.Vector3();
        if (this.input.keys['KeyA']) move.add(new THREE.Vector3(Math.cos(this.player.yaw), 0, -Math.sin(this.player.yaw)).multiplyScalar(-1));
        if (this.input.keys['KeyD']) move.add(new THREE.Vector3(Math.cos(this.player.yaw), 0, -Math.sin(this.player.yaw)));
        if (this.input.keys['KeyS']) move.add(d.clone().multiplyScalar(-1));
        if (move.lengthSq() < 0.01) move.copy(d);
        move.normalize().multiplyScalar(14);
        this.player.vel.x = move.x; this.player.vel.z = move.z; this.player.vel.y = 3;
        break;
      }
      case 'flash': {
        const target = ground.clone();
        this.spawnFlash(target);
        break;
      }
      case 'smoke': this.spawnSmoke(ground.clone()); break;
      case 'molly': this.spawnFire(ground.clone()); break;
      case 'wall': this.spawnWall(ground.clone()); break;
      case 'heal': this.startHeal(); break;
      case 'recon': this.reconPulse(); break;
    }
    this.updateHud();
  }

  private healTimer = 0;
  private startHeal() { this.healTimer = 3; }

  private reconPulse() {
    this.enemies.forEach((e) => { if (e.alive) this.hud.announce('ENEMY SPOTTED', '#ff4655', 1200); });
  }

  private spawnFlash(pos: THREE.Vector3) {
    audio.flash();
    const light = new THREE.PointLight(0xffffff, 0, 30);
    light.position.copy(pos).add(new THREE.Vector3(0, 1.5, 0));
    this.scene.add(light);
    let t = 0;
    const fuse = 0.6;
    const anim = () => {
      t += 0.016;
      if (t < fuse) { requestAnimationFrame(anim); return; }
      light.intensity = 8;
      // blind bots facing it
      this.enemies.forEach((e) => {
        if (!e.alive) return;
        const to = new THREE.Vector3().subVectors(pos, e.pos).normalize();
        const facing = new THREE.Vector3(-Math.sin(e.yaw), 0, -Math.cos(e.yaw));
        if (to.dot(facing) > 0.2 && this.hasLoS(e.headWorld(), pos)) e.die === undefined ? null : ((e as any)._blind = 2.5);
      });
      // blind player if looking toward it
      const pdir = this.player.direction;
      const toP = new THREE.Vector3().subVectors(pos, this.player.eyePosition()).normalize();
      if (pdir.dot(toP) > 0.1 && this.hasLoS(this.player.eyePosition(), pos)) this.hud.flashBlind(1);
      setTimeout(() => { this.scene.remove(light); }, 200);
    };
    anim();
  }

  private spawnSmoke(pos: THREE.Vector3) {
    const radius = 3.2;
    const mat = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, transparent: true, opacity: 0.0, roughness: 1 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 16), mat);
    mesh.position.copy(pos).add(new THREE.Vector3(0, radius * 0.6, 0));
    this.scene.add(mesh);
    this.smokes.push({ pos: mesh.position.clone(), mesh, radius, life: 12 });
  }

  private spawnFire(pos: THREE.Vector3) {
    const radius = 2.6;
    const mat = new THREE.MeshBasicMaterial({ color: 0xff7a1a, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 24), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.copy(pos).add(new THREE.Vector3(0, 0.05, 0));
    this.scene.add(mesh);
    this.fires.push({ pos: pos.clone(), mesh, radius, life: 6, tick: 0 });
  }

  private spawnWall(pos: THREE.Vector3) {
    const w = 6, h = 3.2, d = 0.4;
    const dir = new THREE.Vector3(-Math.sin(this.player.yaw), 0, -Math.cos(this.player.yaw));
    const right = new THREE.Vector3(dir.z, 0, -dir.x);
    const mat = new THREE.MeshStandardMaterial({ color: 0x9ad7ff, emissive: 0x2288cc, emissiveIntensity: 0.8, transparent: true, opacity: 0.75 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    const center = pos.clone().add(new THREE.Vector3(0, h / 2, 0));
    mesh.position.copy(center);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(right.x, 0, right.z).normalize());
    this.scene.add(mesh);
    const half = new THREE.Vector3(Math.abs(right.x) * w / 2 + d, h, Math.abs(right.z) * w / 2 + d).max(new THREE.Vector3(d, h, d));
    const collider: Collider = { min: center.clone().sub(half).setY(0), max: center.clone().add(half) };
    this.colliders.push(collider);
    this.walls.push({ collider, mesh, life: 12 });
  }

  private removeCollider(c: Collider) {
    const i = this.colliders.indexOf(c);
    if (i >= 0) this.colliders.splice(i, 1);
  }

  // ---- Shooting -----------------------------------------------------------
  private tryShoot(dt: number) {
    const w = WEAPONS[this.currentWeapon];
    this.fireTimer -= dt;
    if (!this.player.alive || this.phase !== 'action') return;
    const wantFire = this.input.mouseDown && (w.auto || this.justPressed);
    this.justPressed = false;
    if (!wantFire || this.fireTimer > 0 || this.reloadTimer > 0) return;

    if (w.category === 'melee') { this.meleeAttack(w); this.fireTimer = 1 / w.fireRate; return; }
    if (this.mag <= 0) { this.tryReload(); return; }

    this.mag--;
    this.fireTimer = 1 / w.fireRate;
    audio.shoot(w.category);
    this.viewmodel.kick(w);

    // spread grows with sustained fire, reduced when aiming/standing still
    const moving = new THREE.Vector2(this.player.vel.x, this.player.vel.z).length();
    let spreadDeg = w.firstShotSpread + this.spread + moving * 0.12;
    if (this.aiming) spreadDeg *= 0.35;
    this.spread = Math.min(this.spread + w.spreadPerShot, w.maxSpread);

    const eye = this.player.eyePosition();
    const dir = this.player.direction.clone();
    const rad = THREE.MathUtils.degToRad(spreadDeg);
    dir.x += (Math.random() - 0.5) * rad;
    dir.y += (Math.random() - 0.5) * rad;
    dir.z += (Math.random() - 0.5) * rad;
    dir.normalize();

    this.fireHitscan(eye, dir, w);
    this.updateHud();
  }

  private justPressed = false;

  private meleeAttack(w: WeaponDef) {
    audio.shoot('melee');
    const eye = this.player.eyePosition();
    const dir = this.player.direction;
    let best: Bot | null = null; let bestT = 2.2;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const r = e.rayHit(eye, dir, 2.2);
      if (r.hit && r.distance < bestT) { bestT = r.distance; best = e; }
    }
    if (best) {
      const killed = best.takeDamage(w.damage.body);
      this.effects.bloodHit(best.headWorld());
      audio.hitMarker(); this.hud.hitmarker(false);
      if (killed) this.onBotKilled(best, 'Knife', false);
    }
  }

  private fireHitscan(origin: THREE.Vector3, dir: THREE.Vector3, w: WeaponDef) {
    // find nearest world hit
    const worldT = this.rayWorld(origin, dir, 200);
    let best: Bot | null = null; let bestT = worldT; let head = false;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const r = e.rayHit(origin, dir, bestT);
      if (r.hit && r.distance < bestT) { bestT = r.distance; best = e; head = r.headshot; }
    }
    // smokes don't stop bullets, only vision. Draw tracer to hit point.
    const end = origin.clone().addScaledVector(dir, isFinite(bestT) ? bestT : 200);
    this.effects.tracer(origin.clone().addScaledVector(dir, 1.2), end, w.color === 0x263238 ? 0x88e0ff : 0xfff3c4);

    if (best) {
      let dmg = head ? w.damage.head : w.damage.body;
      const killed = best.takeDamage(dmg);
      this.effects.bloodHit(best.pos.clone().add(new THREE.Vector3(0, head ? 1.85 : 1.1, 0)));
      if (head) { audio.headshot(); } else { audio.hitMarker(); }
      this.hud.hitmarker(head);
      if (killed) this.onBotKilled(best, w.name, head);
    } else if (isFinite(worldT)) {
      const normal = new THREE.Vector3(0, 1, 0);
      this.effects.impact(end, normal);
    }
  }

  private onBotKilled(bot: Bot, weapon: string, head: boolean) {
    this.playerKills++;
    this.credits = Math.min(this.credits + CONFIG.reward.kill, CONFIG.maxCredits);
    this.hud.addKill(this.agent.name, bot.name, weapon, head, true);
    this.checkRoundEnd();
  }

  // ---- Ray helpers --------------------------------------------------------
  private _ray = new THREE.Ray();
  private _box = new THREE.Box3();
  private rayWorld(origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number): number {
    this._ray.set(origin, dir);
    let best = maxDist;
    const hit = new THREE.Vector3();
    for (const c of this.colliders) {
      this._box.set(c.min, c.max);
      const p = this._ray.intersectBox(this._box, hit);
      if (p) { const t = origin.distanceTo(p); if (t < best) best = t; }
    }
    return best;
  }
  private rayGround(origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number): THREE.Vector3 {
    // intersect with y=0 plane, clamped
    if (dir.y >= -0.001) return origin.clone().addScaledVector(dir, 8).setY(0);
    const t = Math.min(maxDist, -origin.y / dir.y);
    const p = origin.clone().addScaledVector(dir, t);
    p.y = 0;
    return p;
  }

  private hasLoS(from: THREE.Vector3, to: THREE.Vector3): boolean {
    const dir = new THREE.Vector3().subVectors(to, from);
    const dist = dir.length();
    dir.normalize();
    const worldT = this.rayWorld(from, dir, dist);
    if (worldT < dist - 0.3) return false;
    // smokes block vision
    for (const s of this.smokes) {
      if (this.segmentSphere(from, to, s.pos, s.radius)) return false;
    }
    return true;
  }

  private segmentSphere(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, r: number): boolean {
    const ab = new THREE.Vector3().subVectors(b, a);
    const t = THREE.MathUtils.clamp(new THREE.Vector3().subVectors(c, a).dot(ab) / ab.lengthSq(), 0, 1);
    const closest = a.clone().addScaledVector(ab, t);
    return closest.distanceTo(c) < r;
  }

  // ---- Round-end checks ---------------------------------------------------
  private checkRoundEnd() {
    if (this.phase !== 'action') return;
    const enemyAlive = this.enemies.some((e) => e.alive);
    const allyAlive = this.player.alive || this.allies.some((a) => a.alive);
    if (!enemyAlive) { this.endRound(true); return; }
    if (!allyAlive && !this.spikePlanted) { this.endRound(false); return; }
  }

  // ---- Bot damage to player ----------------------------------------------
  private botShootPlayer = (from: THREE.Vector3, to: THREE.Vector3, bot: Bot) => {
    // muzzle flash tracer
    this.effects.tracer(from, to, 0xff8080);
    audio.shoot('rifle');
    // check if the shot line hits player head/body — recompute against player capsule
    const dir = new THREE.Vector3().subVectors(to, from).normalize();
    const pEye = this.player.eyePosition();
    const pFeet = this.player.pos.clone().add(new THREE.Vector3(0, 0.4, 0));
    const hitBody = this.segmentSphere(from, from.clone().addScaledVector(dir, 100), this.player.pos.clone().add(new THREE.Vector3(0, 1.0, 0)), 0.55);
    const hitHead = this.segmentSphere(from, from.clone().addScaledVector(dir, 100), pEye, 0.32);
    if (!this.player.alive) return;
    // ensure LoS not blocked by smoke
    if (!this.hasLoS(bot.headWorld(), pEye)) return;
    void pFeet;
    if (hitHead || hitBody) {
      const base = WEAPONS.phantom;
      const dmg = hitHead ? base.damage.head * 0.6 : base.damage.body;
      const res = this.player.takeDamage(dmg);
      this.hud.damageFlash();
      audio.hurt();
      if (res.died) this.onPlayerDied(bot);
      this.updateHud();
    }
  };

  private onPlayerDied(killer: Bot) {
    this.playerDeaths++;
    this.hud.addKill(killer.name, this.agent.name, 'Phantom', false, false);
    this.hud.announce('YOU DIED', '#ff5b5b', 1800);
    this.input.exitLock();
    this.checkRoundEnd();
  }

  // ---- Spike --------------------------------------------------------------
  private handleSpike(dt: number) {
    if (this.phase !== 'action') return;
    const onSiteA = this.player.pos.distanceTo(this.map.siteA) < 9;
    const onSiteB = this.player.pos.distanceTo(this.map.siteB) < 9;

    if (!this.spikePlanted) {
      if (this.player.alive && (onSiteA || onSiteB) && this.input.keys['KeyF']) {
        this.plantProgress += dt;
        this.hud.showLowerCenter(`PLANTING… ${Math.floor((this.plantProgress / CONFIG.plantDuration) * 100)}%`);
        if (Math.floor(this.plantProgress * 4) !== this.lastBeep) { this.lastBeep = Math.floor(this.plantProgress * 4); audio.plantBeep(); }
        if (this.plantProgress >= CONFIG.plantDuration) this.plant(onSiteA ? this.map.siteA : this.map.siteB);
      } else {
        this.plantProgress = Math.max(0, this.plantProgress - dt * 2);
        if (this.player.alive && (onSiteA || onSiteB)) this.hud.showLowerCenter('Hold [F] to plant the Spike');
        else this.hud.hideLowerCenter();
      }
    } else {
      // spike is armed, counting down; enemies try to defuse
      this.spikeTimer -= dt;
      const fast = this.spikeTimer < 10;
      if (Math.floor(this.spikeTimer * (fast ? 2 : 1)) !== this.lastBeep) { this.lastBeep = Math.floor(this.spikeTimer * (fast ? 2 : 1)); audio.spikeTick(fast); }
      this.hud.setSpike(`SPIKE  ${this.spikeTimer.toFixed(1)}s`, true, fast);

      // enemy defuse: nearest alive enemy near spike & no attacker within 6m
      const defuser = this.enemies.find((e) => e.alive && e.pos.distanceTo(this.spikePos) < 2.2);
      const attackerNear = this.player.alive && this.player.pos.distanceTo(this.spikePos) < 3
        || this.allies.some((a) => a.alive && a.pos.distanceTo(this.spikePos) < 3);
      if (defuser && !attackerNear) {
        this.defuseProgress += dt;
        this.hud.showLowerCenter(`ENEMY DEFUSING… ${Math.floor((this.defuseProgress / CONFIG.defuseDuration) * 100)}%`);
        if (this.defuseProgress >= CONFIG.defuseDuration) { audio.defused(); this.endRound(false); }
      } else {
        this.defuseProgress = Math.max(0, this.defuseProgress - dt);
        this.hud.hideLowerCenter();
      }

      if (this.spikeTimer <= 0) { this.detonate(); }
    }
  }

  private plant(site: THREE.Vector3) {
    this.spikePlanted = true;
    this.spikePos.copy(site).add(new THREE.Vector3((Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4));
    this.spikeMesh.position.copy(this.spikePos).add(new THREE.Vector3(0, 0.35, 0));
    this.spikeMesh.visible = true;
    this.spikeTimer = CONFIG.plantTime;
    this.credits = Math.min(this.credits + CONFIG.reward.plant, CONFIG.maxCredits);
    audio.spikeArmed();
    this.hud.hideLowerCenter();
    this.hud.announce('SPIKE PLANTED', '#ff4655');
    // redirect defenders toward the spike
    this.enemies.forEach((e) => e.setWaypoint(this.spikePos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4))));
  }

  private detonate() {
    audio.explosion();
    this.hud.announce('DETONATION', '#ff7a1a');
    // kill any enemy near spike
    this.enemies.forEach((e) => { if (e.alive && e.pos.distanceTo(this.spikePos) < 8) e.die(); });
    this.spikeMesh.visible = false;
    this.hud.setSpike('', false);
    this.endRound(true);
  }

  // ---- Main loop ----------------------------------------------------------
  private loop = () => {
    if (!this.running) return;
    requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.paused) { this.composer.render(); return; }
    this.step(dt);
    this.composer.render();
  };

  private lastMouseDown = false;
  private footstepAcc = 0;

  private step(dt: number) {
    // detect fresh mouse press for semi-auto
    if (this.input.mouseDown && !this.lastMouseDown) this.justPressed = true;
    this.lastMouseDown = this.input.mouseDown;
    this.aiming = this.input.rightDown && WEAPONS[this.currentWeapon].category !== 'melee';

    // phase timers
    this.phaseTimer -= dt;
    if (this.phase === 'buy') {
      this.hud.setTimer(this.phaseTimer);
      if (this.phaseTimer <= 0) this.startAction();
    } else if (this.phase === 'action') {
      if (!this.spikePlanted) {
        this.hud.setTimer(this.phaseTimer);
        if (this.phaseTimer <= 0) this.endRound(false); // time expired, no plant
      }
    } else if (this.phase === 'roundend') {
      if (this.phaseTimer <= 0) this.nextRound();
    }

    // Look
    const { dx, dy } = this.input.consumeMouse();
    if (this.input.locked && this.player.alive) this.player.look(dx, dy, this.input.sensitivity * (this.aiming ? 0.55 : 1));

    // Movement input
    const canMove = this.player.alive && this.phase === 'action';
    const moveInput = {
      fwd: canMove ? (this.input.keys['KeyW'] ? 1 : 0) - (this.input.keys['KeyS'] ? 1 : 0) : 0,
      strafe: canMove ? (this.input.keys['KeyD'] ? 1 : 0) - (this.input.keys['KeyA'] ? 1 : 0) : 0,
      jump: canMove && this.input.keys['Space'],
      walk: this.input.keys['ShiftLeft'] || this.aiming,
      crouch: this.input.keys['ControlLeft'] || this.input.keys['KeyX'],
      speedMul: WEAPONS[this.currentWeapon].runSpeed,
    };
    this.player.update(dt, moveInput);

    // footsteps
    const speed = new THREE.Vector2(this.player.vel.x, this.player.vel.z).length();
    if (this.player.onGround && speed > 2 && !moveInput.walk) {
      this.footstepAcc += dt * speed;
      if (this.footstepAcc > 6) { audio.footstep(); this.footstepAcc = 0; }
    }

    // Camera follow
    const eye = this.player.eyePosition();
    this.camera.position.copy(eye);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.player.yaw;
    this.camera.rotation.x = this.player.pitch;

    // Weapon
    if (this.reloadTimer > 0) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        const w = WEAPONS[this.currentWeapon];
        const need = w.magazine - this.mag;
        const take = Math.min(need, this.reserve);
        this.mag += take; this.reserve -= take;
        this.updateHud();
      }
    }
    this.tryShoot(dt);
    this.spread = Math.max(0, this.spread - dt * WEAPONS[this.currentWeapon].recoilRecovery);
    const sway = new THREE.Vector2(THREE.MathUtils.clamp(dx * 0.01, -1, 1), THREE.MathUtils.clamp(dy * 0.01, -1, 1));
    this.viewmodel.update(dt, Math.min(1, speed / 6), this.aiming, sway);
    this.hud.setCrosshairSpread(4 + this.spread * 2.2 + speed * 0.4);

    // Heal ability
    if (this.healTimer > 0 && this.player.alive) {
      this.healTimer -= dt;
      this.player.health = Math.min(100, this.player.health + dt * 20);
      this.updateHud();
    }

    // Bots
    const losFn = (a: THREE.Vector3, b: THREE.Vector3) => this.hasLoS(a, b);
    for (const e of this.enemies) {
      const blind = (e as any)._blind || 0;
      if (blind > 0) { (e as any)._blind = blind - dt; continue; }
      e.update(dt, eye, this.player.alive && this.phase === 'action', losFn, this.colliders, this.botShootPlayer, this.camera);
    }
    for (const a of this.allies) {
      // allies engage enemies they can see
      this.updateAlly(a, dt, losFn);
    }

    // Fires damage
    for (let i = this.fires.length - 1; i >= 0; i--) {
      const f = this.fires[i];
      f.life -= dt; f.tick -= dt;
      (f.mesh.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(performance.now() * 0.02) * 0.15;
      if (f.tick <= 0) {
        f.tick = 0.5;
        if (this.player.alive && this.player.pos.distanceTo(f.pos) < f.radius) { this.player.takeDamage(15); this.hud.damageFlash(); audio.hurt(); this.updateHud(); if (!this.player.alive) this.onPlayerDied(this.enemies[0]); }
        this.enemies.forEach((e) => { if (e.alive && e.pos.distanceTo(f.pos) < f.radius) { if (e.takeDamage(15)) this.onBotKilled(e, 'Blaze', false); } });
      }
      if (f.life <= 0) { this.scene.remove(f.mesh); this.fires.splice(i, 1); }
    }

    // Smokes lifecycle
    for (let i = this.smokes.length - 1; i >= 0; i--) {
      const s = this.smokes[i];
      s.life -= dt;
      const m = s.mesh.material as THREE.MeshStandardMaterial;
      m.opacity = Math.min(0.92, m.opacity + dt * 2) * (s.life < 1.5 ? s.life / 1.5 : 1);
      s.mesh.scale.setScalar(Math.min(1, 1.2 - (s.mesh.scale.x < 1 ? (1 - s.mesh.scale.x) : 0)) || 1);
      if (s.life <= 0) { this.scene.remove(s.mesh); this.smokes.splice(i, 1); }
    }
    for (let i = this.walls.length - 1; i >= 0; i--) {
      const wll = this.walls[i];
      wll.life -= dt;
      (wll.mesh.material as THREE.MeshStandardMaterial).opacity = wll.life < 1.5 ? 0.75 * (wll.life / 1.5) : 0.75;
      if (wll.life <= 0) { this.scene.remove(wll.mesh); this.removeCollider(wll.collider); this.walls.splice(i, 1); }
    }

    this.handleSpike(dt);
    this.effects.update(dt);
    this.hud.updateFlash(dt);

    // scoreboard toggle
    if (this.input.keys['Tab']) this.hud.showScoreboard(this.buildScoreboard()); else this.hud.hideScoreboard();

    // alive counts + minimap
    const aliveA = (this.player.alive ? 1 : 0) + this.allies.filter((a) => a.alive).length;
    const aliveD = this.enemies.filter((e) => e.alive).length;
    this.hud.setAliveCounts(aliveA, aliveD);
    this.updateMinimap();
  }

  private updateAlly(a: Bot, dt: number, losFn: (x: THREE.Vector3, y: THREE.Vector3) => boolean) {
    if (!a.alive) return;
    // find visible enemy
    let target: Bot | null = null;
    const eye = a.pos.clone().add(new THREE.Vector3(0, 1.85, 0));
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (losFn(eye, e.headWorld())) { target = e; break; }
    }
    if (target) {
      const to = new THREE.Vector3().subVectors(target.pos, a.pos);
      a.yaw = Math.atan2(-to.x, -to.z) + Math.PI;
      (a as any)._fire = ((a as any)._fire || 0) - dt;
      if ((a as any)._fire <= 0) {
        (a as any)._fire = 0.3 + Math.random() * 0.3;
        this.effects.tracer(a.muzzleWorld(), target.headWorld(), 0x88e0ff);
        if (Math.random() < 0.35) { if (target.takeDamage(35)) { this.hud.addKill(a.name, target.name, 'Vandal', false, false); this.checkRoundEnd(); } }
      }
      // sync visuals
      (a as any).sync?.();
      a.group.position.copy(a.pos); a.group.rotation.y = a.yaw;
    } else {
      a.update(dt, eye, false, losFn, this.colliders, () => {}, this.camera);
    }
  }

  private buildScoreboard() {
    const rows: any[] = [];
    rows.push({ name: this.agent.name, team: 'ally', kills: this.playerKills, deaths: this.playerDeaths, alive: this.player.alive, you: true });
    this.allies.forEach((a) => rows.push({ name: a.name, team: 'ally', kills: 0, deaths: 0, alive: a.alive, you: false }));
    this.enemies.forEach((e) => rows.push({ name: e.name, team: 'enemy', kills: 0, deaths: 0, alive: e.alive, you: false }));
    return rows;
  }

  private updateMinimap() {
    this.hud.drawMinimap(
      45,
      this.player.pos.x, this.player.pos.z, this.player.yaw,
      this.enemies.map((e) => ({ x: e.pos.x, z: e.pos.z, alive: e.alive })),
      this.allies.map((a) => ({ x: a.pos.x, z: a.pos.z, alive: a.alive })),
      this.spikePlanted ? { x: this.spikePos.x, z: this.spikePos.z } : null,
      [{ x: this.map.siteA.x, z: this.map.siteA.z, label: 'A' }, { x: this.map.siteB.x, z: this.map.siteB.z, label: 'B' }],
    );
  }

  private updateHud() {
    const w = WEAPONS[this.currentWeapon];
    this.hud.setHealth(this.player.health, this.player.shield);
    this.hud.setWeapon(w.name, this.mag, this.reserve, w.category === 'melee');
    this.hud.setCredits(this.credits);
    this.hud.setAbilities(this.agent, this.abilities.map((a) => a.charges), 0);
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  // Public hooks used by HUD callbacks
  onBuyWeapon = (id: WeaponId) => this.buy(id);
  onBuyShield = (kind: 'light' | 'heavy') => this.buyShield(kind);
  onReadyClicked = () => this.startAction();
}
