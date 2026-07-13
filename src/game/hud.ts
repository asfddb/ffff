// ============================================================================
//  HUD — all DOM/CSS overlay UI. Rendered on top of the WebGL canvas.
// ============================================================================
import { WEAPONS, BUYABLE, type WeaponId, type AgentDef } from './config';

export interface HudCallbacks {
  onBuy: (id: WeaponId) => void;
  onBuyShield: (kind: 'light' | 'heavy') => void;
  onReady: () => void;
}

export class Hud {
  root: HTMLElement;
  cb: HudCallbacks;

  private el: Record<string, HTMLElement> = {};
  private killfeed: HTMLElement;
  private minimapCanvas: HTMLCanvasElement;
  private minimapCtx: CanvasRenderingContext2D;
  private buyOpen = false;

  constructor(root: HTMLElement, cb: HudCallbacks) {
    this.root = root;
    this.cb = cb;
    root.innerHTML = TEMPLATE;

    const q = (id: string) => root.querySelector<HTMLElement>('#' + id)!;
    ['health', 'healthBar', 'shield', 'shieldBar', 'ammo', 'ammoReserve', 'credits',
     'weaponName', 'roundTimer', 'scoreA', 'scoreD', 'roundNum', 'phaseLabel',
     'spikeStatus', 'announce', 'hitmarker', 'damageFlash', 'abilities',
     'buyMenu', 'buyCredits', 'scoreboard', 'agentName', 'flashOverlay',
     'crosshair', 'lowerCenter', 'aliveA', 'aliveD',
    ].forEach((k) => (this.el[k] = q(k)));

    this.killfeed = q('killfeed');
    this.minimapCanvas = q('minimap') as HTMLCanvasElement;
    this.minimapCtx = this.minimapCanvas.getContext('2d')!;

    this.buildBuyMenu();

    q('readyBtn').addEventListener('click', () => this.cb.onReady());
  }

  // ---- Buy menu -----------------------------------------------------------
  private buildBuyMenu() {
    const grid = this.root.querySelector('#buyGrid')!;
    for (const id of BUYABLE) {
      const w = WEAPONS[id];
      const card = document.createElement('div');
      card.className = 'buy-card';
      card.dataset.id = id;
      card.innerHTML = `
        <div class="buy-cat">${w.category}</div>
        <div class="buy-name">${w.name}</div>
        <div class="buy-cost">${w.cost}<span>cr</span></div>`;
      card.addEventListener('click', () => this.cb.onBuy(id));
      grid.appendChild(card);
    }
    this.root.querySelector('#buyLight')!.addEventListener('click', () => this.cb.onBuyShield('light'));
    this.root.querySelector('#buyHeavy')!.addEventListener('click', () => this.cb.onBuyShield('heavy'));
  }

  openBuy(credits: number) {
    this.buyOpen = true;
    this.el.buyMenu.classList.add('open');
    this.updateBuyAffordability(credits);
  }
  closeBuy() { this.buyOpen = false; this.el.buyMenu.classList.remove('open'); }
  toggleBuy(credits: number) { this.buyOpen ? this.closeBuy() : this.openBuy(credits); }
  isBuyOpen() { return this.buyOpen; }

  updateBuyAffordability(credits: number) {
    this.el.buyCredits.textContent = String(credits);
    this.root.querySelectorAll<HTMLElement>('.buy-card').forEach((c) => {
      const w = WEAPONS[c.dataset.id as WeaponId];
      if (!w) return; // armor cards have no data-id
      c.classList.toggle('disabled', w.cost > credits);
    });
  }

  // ---- Core stats ---------------------------------------------------------
  setHealth(hp: number, shield: number) {
    this.el.health.textContent = String(Math.ceil(hp));
    this.el.healthBar.style.width = Math.max(0, hp) + '%';
    this.el.shield.textContent = String(Math.ceil(shield));
    this.el.shieldBar.style.width = Math.max(0, (shield / 50) * 100) + '%';
    this.el.healthBar.style.background = hp > 40 ? 'linear-gradient(90deg,#39d98a,#8ef6c3)' : 'linear-gradient(90deg,#ff5b5b,#ff9a9a)';
  }

  setWeapon(name: string, mag: number, reserve: number, isMelee: boolean) {
    this.el.weaponName.textContent = name;
    if (isMelee) { this.el.ammo.textContent = '∞'; this.el.ammoReserve.textContent = ''; }
    else { this.el.ammo.textContent = String(mag); this.el.ammoReserve.textContent = '/ ' + reserve; }
  }

  setCredits(c: number) { this.el.credits.textContent = String(c); }
  setAgent(name: string) { this.el.agentName.textContent = name; }

  setScore(atk: number, def: number, round: number) {
    this.el.scoreA.textContent = String(atk);
    this.el.scoreD.textContent = String(def);
    this.el.roundNum.textContent = 'ROUND ' + round;
  }

  setAliveCounts(atk: number, def: number) {
    this.el.aliveA.textContent = String(atk);
    this.el.aliveD.textContent = String(def);
  }

  setPhase(label: string) { this.el.phaseLabel.textContent = label; }
  setTimer(sec: number) {
    const s = Math.max(0, Math.ceil(sec));
    this.el.roundTimer.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  setSpike(text: string, active: boolean, danger = false) {
    this.el.spikeStatus.textContent = text;
    this.el.spikeStatus.style.display = active ? 'block' : 'none';
    this.el.spikeStatus.classList.toggle('danger', danger);
  }

  showLowerCenter(text: string) { this.el.lowerCenter.textContent = text; this.el.lowerCenter.style.opacity = '1'; }
  hideLowerCenter() { this.el.lowerCenter.style.opacity = '0'; }

  announce(text: string, color = '#fff', duration = 2200) {
    const a = this.el.announce;
    a.textContent = text;
    a.style.color = color;
    a.classList.remove('show'); void a.offsetWidth; a.classList.add('show');
    window.clearTimeout((a as any)._t);
    (a as any)._t = window.setTimeout(() => a.classList.remove('show'), duration);
  }

  hitmarker(head: boolean) {
    const h = this.el.hitmarker;
    h.style.color = head ? '#ff4655' : '#fff';
    h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop');
  }

  damageFlash() {
    const f = this.el.damageFlash;
    f.classList.remove('flash'); void f.offsetWidth; f.classList.add('flash');
  }

  flashBlind(amount: number) {
    this.el.flashOverlay.style.opacity = String(Math.min(1, amount));
  }
  updateFlash(dt: number) {
    const cur = parseFloat(this.el.flashOverlay.style.opacity || '0');
    if (cur > 0) this.el.flashOverlay.style.opacity = String(Math.max(0, cur - dt * 0.6));
  }

  addKill(killer: string, victim: string, weapon: string, headshot: boolean, byPlayer: boolean) {
    const row = document.createElement('div');
    row.className = 'kill-row' + (byPlayer ? ' by-player' : '');
    row.innerHTML = `<span class="k-name">${killer}</span>` +
      `<span class="k-weap">${weapon}${headshot ? ' ⌖' : ''}</span>` +
      `<span class="v-name">${victim}</span>`;
    this.killfeed.appendChild(row);
    setTimeout(() => row.classList.add('fade'), 4000);
    setTimeout(() => row.remove(), 4600);
    while (this.killfeed.children.length > 5) this.killfeed.firstChild!.remove();
  }

  // ---- Abilities ----------------------------------------------------------
  setAbilities(agent: AgentDef, charges: number[], signature: number) {
    this.el.abilities.innerHTML = '';
    agent.abilities.forEach((ab, i) => {
      const d = document.createElement('div');
      d.className = 'ability' + (charges[i] > 0 ? ' ready' : '');
      d.innerHTML = `<div class="ab-key">${ab.key}</div><div class="ab-name">${ab.name}</div><div class="ab-charge">${charges[i]}</div>`;
      this.el.abilities.appendChild(d);
    });
    void signature;
  }

  // ---- Scoreboard ---------------------------------------------------------
  showScoreboard(rows: { name: string; team: string; kills: number; deaths: number; alive: boolean; you: boolean }[]) {
    const body = this.el.scoreboard.querySelector('#sbBody')!;
    body.innerHTML = '';
    for (const r of rows) {
      const tr = document.createElement('div');
      tr.className = 'sb-row ' + r.team + (r.you ? ' you' : '') + (r.alive ? '' : ' dead');
      tr.innerHTML = `<span>${r.name}${r.you ? ' (you)' : ''}</span><span>${r.kills}</span><span>${r.deaths}</span><span>${r.alive ? '●' : '✕'}</span>`;
      body.appendChild(tr);
    }
    this.el.scoreboard.classList.add('open');
  }
  hideScoreboard() { this.el.scoreboard.classList.remove('open'); }

  // ---- Minimap ------------------------------------------------------------
  drawMinimap(
    world: number, playerX: number, playerZ: number, playerYaw: number,
    enemies: { x: number; z: number; alive: boolean }[],
    allies: { x: number; z: number; alive: boolean }[],
    spike: { x: number; z: number } | null,
    sites: { x: number; z: number; label: string }[],
  ) {
    const c = this.minimapCtx;
    const S = this.minimapCanvas.width;
    const scale = S / (world * 2);
    const tx = (x: number) => S / 2 + x * scale;
    const tz = (z: number) => S / 2 + z * scale;

    c.clearRect(0, 0, S, S);
    c.fillStyle = 'rgba(15,20,28,0.85)';
    c.fillRect(0, 0, S, S);
    c.strokeStyle = 'rgba(120,140,160,0.25)';
    c.lineWidth = 1;
    c.strokeRect(2, 2, S - 4, S - 4);

    // sites
    c.font = 'bold 11px monospace';
    for (const s of sites) {
      c.strokeStyle = 'rgba(0,229,255,0.6)';
      c.strokeRect(tx(s.x) - 14, tz(s.z) - 14, 28, 28);
      c.fillStyle = 'rgba(0,229,255,0.9)';
      c.fillText(s.label, tx(s.x) - 4, tz(s.z) + 4);
    }

    if (spike) {
      c.fillStyle = '#ff4655';
      c.beginPath(); c.arc(tx(spike.x), tz(spike.z), 4, 0, Math.PI * 2); c.fill();
    }

    for (const a of allies) {
      if (!a.alive) continue;
      c.fillStyle = '#26c281';
      c.beginPath(); c.arc(tx(a.x), tz(a.z), 3, 0, Math.PI * 2); c.fill();
    }
    for (const e of enemies) {
      if (!e.alive) continue;
      c.fillStyle = '#ff4655';
      c.beginPath(); c.arc(tx(e.x), tz(e.z), 3, 0, Math.PI * 2); c.fill();
    }

    // player arrow
    c.save();
    c.translate(tx(playerX), tz(playerZ));
    c.rotate(-playerYaw);
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(0, -6); c.lineTo(4, 5); c.lineTo(0, 2); c.lineTo(-4, 5); c.closePath();
    c.fill();
    c.restore();
  }

  setCrosshairSpread(px: number) {
    this.el.crosshair.style.setProperty('--gap', px + 'px');
  }
}

const TEMPLATE = `
<div id="flashOverlay" class="flash-overlay"></div>
<div id="damageFlash" class="damage-flash"></div>

<div id="crosshair" class="crosshair">
  <span class="ch top"></span><span class="ch bottom"></span>
  <span class="ch left"></span><span class="ch right"></span>
  <span class="ch dot"></span>
</div>
<div id="hitmarker" class="hitmarker">✕</div>

<div class="topbar">
  <div class="score-block atk"><span class="lbl">ATK</span><span id="scoreA">0</span></div>
  <div class="round-center">
    <div id="roundTimer" class="timer">1:40</div>
    <div id="phaseLabel" class="phase">BUY PHASE</div>
    <div id="roundNum" class="round-num">ROUND 1</div>
    <div class="alive-line"><span id="aliveA" class="a-atk">5</span> vs <span id="aliveD" class="a-def">5</span></div>
  </div>
  <div class="score-block def"><span class="lbl">DEF</span><span id="scoreD">0</span></div>
</div>

<div id="announce" class="announce"></div>
<div id="spikeStatus" class="spike-status"></div>
<div id="lowerCenter" class="lower-center"></div>

<canvas id="minimap" class="minimap" width="200" height="200"></canvas>
<div id="killfeed" class="killfeed"></div>

<div class="bottombar">
  <div class="left-cluster">
    <div class="hp-wrap">
      <div class="hp-num"><span id="health">100</span></div>
      <div class="bars">
        <div class="bar-bg"><div id="healthBar" class="bar-fill hp"></div></div>
        <div class="bar-bg shield-bg"><div id="shieldBar" class="bar-fill sh"></div></div>
      </div>
      <div class="shield-num">🛡 <span id="shield">0</span></div>
    </div>
    <div id="agentName" class="agent-name">—</div>
  </div>

  <div id="abilities" class="abilities"></div>

  <div class="right-cluster">
    <div class="credits-box">⛃ <span id="credits">800</span></div>
    <div class="ammo-box">
      <span id="ammo" class="ammo">30</span><span id="ammoReserve" class="ammo-res">/ 90</span>
      <div id="weaponName" class="weapon-name">Vandal</div>
    </div>
  </div>
</div>

<div id="buyMenu" class="buy-menu">
  <div class="buy-header">
    <h2>BUY PHASE</h2>
    <div class="buy-credit-display">⛃ <span id="buyCredits">800</span></div>
    <button id="readyBtn" class="ready-btn">READY (Enter)</button>
  </div>
  <div class="buy-columns">
    <div class="buy-col">
      <h3>ARMOR</h3>
      <div class="armor-row">
        <div id="buyLight" class="buy-card armor"><div class="buy-name">Light Shield</div><div class="buy-cost">400<span>cr</span></div></div>
        <div id="buyHeavy" class="buy-card armor"><div class="buy-name">Heavy Shield</div><div class="buy-cost">1000<span>cr</span></div></div>
      </div>
    </div>
    <div class="buy-col wide">
      <h3>WEAPONS</h3>
      <div id="buyGrid" class="buy-grid"></div>
    </div>
  </div>
  <div class="buy-hint">Press <b>B</b> to toggle buy menu · Click to purchase · <b>Enter</b> when ready</div>
</div>

<div id="scoreboard" class="scoreboard">
  <div class="sb-head"><span>PLAYER</span><span>K</span><span>D</span><span>●</span></div>
  <div id="sbBody"></div>
</div>
`;
