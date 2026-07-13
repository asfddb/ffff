// ============================================================================
//  Entry point — start menu, agent select, then boot the game.
// ============================================================================
import './style.css';
import { AGENTS, type AgentDef, type WeaponId } from './config';
import { Input } from './input';
import { Hud } from './hud';
import { Game } from './game';
import { audio } from './audio';

function el<T extends HTMLElement>(id: string): T { return document.getElementById(id) as T; }

const gameRoot = el('game');
const hudRoot = el('hud');
const menuRoot = el('menu');

let selectedAgent: AgentDef = AGENTS[0];

function buildMenu() {
  const grid = el('agentGrid');
  AGENTS.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = 'agent-card' + (i === 0 ? ' selected' : '');
    card.style.setProperty('--c', '#' + a.color.toString(16).padStart(6, '0'));
    card.innerHTML = `
      <div class="agent-avatar"></div>
      <div class="agent-role">${a.role}</div>
      <div class="agent-title">${a.name}</div>
      <div class="agent-bio">${a.bio}</div>
      <div class="agent-abilities">
        ${a.abilities.map((ab) => `<div class="mini-ab"><b>${ab.key}</b> ${ab.name}</div>`).join('')}
      </div>`;
    card.addEventListener('click', () => {
      audio.init(); audio.uiClick();
      selectedAgent = a;
      grid.querySelectorAll('.agent-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
    });
    grid.appendChild(card);
  });
}

function startGame() {
  audio.init();
  audio.resume();
  menuRoot.style.display = 'none';

  const input = new Input(gameRoot);
  input.onLockChange = (locked) => {
    if (!locked) el('pauseHint').style.display = 'flex';
    else el('pauseHint').style.display = 'none';
  };

  const game = new Game(gameRoot, /*hud placeholder*/ null as any, input);
  const hud = new Hud(hudRoot, {
    onBuy: (id: WeaponId) => game.onBuyWeapon(id),
    onBuyShield: (kind) => game.onBuyShield(kind),
    onReady: () => game.onReadyClicked(),
  });
  // inject hud into game
  (game as any).hud = hud;

  game.setAgent(selectedAgent);
  game.init();
  game.start();
  (window as any).__game = game; // exposed for debugging / spectating

  // click canvas to (re)lock
  gameRoot.addEventListener('click', () => {
    if (!input.locked && !hud.isBuyOpen()) { input.requestLock(); audio.resume(); }
  });
  el('resumeBtn')?.addEventListener('click', () => { input.requestLock(); });
}

buildMenu();
el('playBtn').addEventListener('click', () => { audio.init(); audio.uiClick(); startGame(); });
