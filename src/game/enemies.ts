// ============================================================================
//  Bots — stylized humanoid agents with simple combat AI.
//  Each bot can be an enemy or an allied teammate.
// ============================================================================
import * as THREE from 'three';
import type { Collider } from './map';

export type BotState = 'advance' | 'engage' | 'hold' | 'dead';

export interface BotHitResult {
  hit: boolean;
  headshot: boolean;
  distance: number;
}

let BOT_ID = 0;

export class Bot {
  id: number;
  group = new THREE.Group();
  pos = new THREE.Vector3();
  vel = new THREE.Vector3();
  yaw = 0;
  health = 100;
  alive = true;
  team: 'ally' | 'enemy';
  state: BotState = 'advance';
  name: string;

  // combat timers
  private fireCooldown = 0;
  private reactionTimer = 0;
  private target: THREE.Vector3 | null = null;
  private waypoint: THREE.Vector3;
  private skill: number; // 0..1 accuracy

  private head!: THREE.Mesh;
  private body!: THREE.Mesh;
  private barFill!: THREE.Mesh;
  private barBg!: THREE.Mesh;
  private muzzle = new THREE.Object3D();

  constructor(team: 'ally' | 'enemy', color: number, name: string, skill: number) {
    this.id = BOT_ID++;
    this.team = team;
    this.name = name;
    this.skill = skill;
    this.waypoint = new THREE.Vector3();
    this.build(color);
  }

  private build(color: number) {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.2 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1c2128, roughness: 0.8 });
    const accent = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.8, roughness: 0.4 });

    // torso
    this.body = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.9, 4, 10), mat);
    this.body.position.y = 1.05;
    this.body.castShadow = true;
    this.group.add(this.body);

    // chest accent
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.15), accent);
    chest.position.set(0, 1.25, 0.36);
    this.group.add(chest);

    // head
    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), dark);
    this.head.position.y = 1.85;
    this.head.castShadow = true;
    this.group.add(this.head);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.1), accent);
    visor.position.set(0, 1.87, 0.24);
    this.group.add(visor);

    // legs
    const legGeo = new THREE.CapsuleGeometry(0.16, 0.7, 4, 8);
    const legL = new THREE.Mesh(legGeo, dark); legL.position.set(-0.2, 0.45, 0); legL.castShadow = true;
    const legR = new THREE.Mesh(legGeo, dark); legR.position.set(0.2, 0.45, 0); legR.castShadow = true;
    this.group.add(legL, legR);

    // gun
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.7), new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.5, metalness: 0.5 }));
    gun.position.set(0.32, 1.25, 0.35);
    this.group.add(gun);
    this.muzzle.position.set(0.32, 1.25, 0.75);
    this.group.add(this.muzzle);

    // health bar (billboarded)
    this.barBg = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.12), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6, depthTest: false }));
    this.barBg.position.y = 2.3;
    this.barBg.renderOrder = 999;
    this.group.add(this.barBg);
    this.barFill = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.08), new THREE.MeshBasicMaterial({ color: this.team === 'enemy' ? 0xff4655 : 0x26c281, depthTest: false }));
    this.barFill.position.set(0, 2.3, 0.01);
    this.barFill.renderOrder = 1000;
    this.group.add(this.barFill);
  }

  spawn(pos: THREE.Vector3, yaw: number) {
    this.pos.copy(pos);
    this.yaw = yaw;
    this.health = 100;
    this.alive = true;
    this.state = 'advance';
    this.group.visible = true;
    this.group.rotation.set(0, 0, 0);
    this.fireCooldown = 1 + Math.random();
    this.sync();
  }

  muzzleWorld(): THREE.Vector3 { return this.muzzle.getWorldPosition(new THREE.Vector3()); }
  headWorld(): THREE.Vector3 { return this.head.getWorldPosition(new THREE.Vector3()); }

  private sync() {
    this.group.position.copy(this.pos);
    this.group.rotation.y = this.yaw;
  }

  // Ray test against this bot's capsule/head. Origin+dir in world space.
  rayHit(origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number): BotHitResult {
    if (!this.alive) return { hit: false, headshot: false, distance: Infinity };
    const centerBody = this.pos.clone().add(new THREE.Vector3(0, 1.05, 0));
    const centerHead = this.pos.clone().add(new THREE.Vector3(0, 1.85, 0));

    const headHit = raySphere(origin, dir, centerHead, 0.32, maxDist);
    const bodyHit = rayCapsule(origin, dir, this.pos.clone().add(new THREE.Vector3(0, 0.4, 0)), this.pos.clone().add(new THREE.Vector3(0, 1.7, 0)), 0.45, maxDist);

    if (headHit >= 0 && (bodyHit < 0 || headHit <= bodyHit)) return { hit: true, headshot: true, distance: headHit };
    if (bodyHit >= 0) return { hit: true, headshot: false, distance: bodyHit };
    void centerBody;
    return { hit: false, headshot: false, distance: Infinity };
  }

  takeDamage(dmg: number): boolean {
    if (!this.alive) return false;
    this.health -= dmg;
    if (this.health <= 0) { this.health = 0; this.die(); return true; }
    return false;
  }

  die() {
    this.alive = false;
    this.state = 'dead';
    // fall over
    this.group.rotation.x = -Math.PI / 2.2;
    this.pos.y = 0;
    this.barBg.visible = false;
    this.barFill.visible = false;
  }

  setWaypoint(p: THREE.Vector3) { this.waypoint.copy(p); }

  update(
    dt: number,
    playerEye: THREE.Vector3,
    playerAlive: boolean,
    hasLineOfSight: (from: THREE.Vector3, to: THREE.Vector3) => boolean,
    colliders: Collider[],
    onShoot: (from: THREE.Vector3, to: THREE.Vector3, bot: Bot) => void,
    camera: THREE.Camera,
  ) {
    if (!this.alive) return;
    this.fireCooldown -= dt;

    let canSeePlayer = false;
    const eye = this.pos.clone().add(new THREE.Vector3(0, 1.85, 0));
    if (playerAlive && this.team === 'enemy') {
      canSeePlayer = hasLineOfSight(eye, playerEye);
    }

    if (canSeePlayer) {
      this.state = 'engage';
      this.target = playerEye.clone();
      this.reactionTimer += dt;
      // face player
      const toP = new THREE.Vector3().subVectors(playerEye, this.pos);
      this.yaw = Math.atan2(-toP.x, -toP.z) + Math.PI;
      // slow down when engaging
      this.vel.multiplyScalar(0.85);
      // shoot after a human-like reaction delay
      if (this.reactionTimer > (0.28 - this.skill * 0.15) && this.fireCooldown <= 0) {
        this.shoot(eye, playerEye, onShoot);
        this.fireCooldown = 0.12 + Math.random() * 0.18;
      }
    } else {
      if (this.state === 'engage') this.state = 'advance';
      this.reactionTimer = 0;
      this.moveToward(this.waypoint, dt, colliders);
    }

    this.sync();

    // billboard the health bar
    this.barBg.quaternion.copy(camera.quaternion);
    this.barFill.quaternion.copy(camera.quaternion);
    this.barFill.scale.x = Math.max(0.001, this.health / 100);
    this.barFill.position.x = -(1 - this.health / 100) * 0.48;
  }

  private shoot(from: THREE.Vector3, to: THREE.Vector3, onShoot: (a: THREE.Vector3, b: THREE.Vector3, bot: Bot) => void) {
    // add inaccuracy based on skill
    const spread = (1 - this.skill) * 0.09;
    const dir = new THREE.Vector3().subVectors(to, from).normalize();
    dir.x += (Math.random() - 0.5) * spread;
    dir.y += (Math.random() - 0.5) * spread;
    dir.z += (Math.random() - 0.5) * spread;
    dir.normalize();
    const end = from.clone().addScaledVector(dir, 100);
    onShoot(this.muzzleWorld(), end, this);
  }

  private moveToward(dest: THREE.Vector3, dt: number, colliders: Collider[]) {
    const to = new THREE.Vector3().subVectors(dest, this.pos);
    to.y = 0;
    const dist = to.length();
    if (dist < 1.5) return;
    to.normalize();
    this.yaw = Math.atan2(-to.x, -to.z) + Math.PI;
    const speed = 4.5;
    const step = to.multiplyScalar(speed * dt);

    // simple collision: try x then z
    const tryMove = (ax: 'x' | 'z', d: number) => {
      const np = this.pos.clone();
      np[ax] += d;
      const r = 0.5;
      for (const c of colliders) {
        if (np.x + r <= c.min.x || np.x - r >= c.max.x) continue;
        if (c.max.y < 0.5) continue;
        if (np.z + r <= c.min.z || np.z - r >= c.max.z) continue;
        return; // blocked
      }
      this.pos[ax] += d;
    };
    tryMove('x', step.x);
    tryMove('z', step.z);
  }
}

// ---- ray helpers -----------------------------------------------------------
function raySphere(o: THREE.Vector3, d: THREE.Vector3, c: THREE.Vector3, r: number, maxDist: number): number {
  const oc = new THREE.Vector3().subVectors(o, c);
  const b = oc.dot(d);
  const cc = oc.dot(oc) - r * r;
  const disc = b * b - cc;
  if (disc < 0) return -1;
  const t = -b - Math.sqrt(disc);
  if (t < 0 || t > maxDist) return -1;
  return t;
}

function rayCapsule(o: THREE.Vector3, d: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, r: number, maxDist: number): number {
  // approximate: sample nearest point on segment via a few sphere tests
  let best = -1;
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const p = new THREE.Vector3().lerpVectors(a, b, i / steps);
    const t = raySphere(o, d, p, r, maxDist);
    if (t >= 0 && (best < 0 || t < best)) best = t;
  }
  return best;
}
