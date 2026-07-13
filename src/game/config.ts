// ============================================================================
//  Game configuration — weapons, agents, economy, tunables.
//  All values are original balance choices inspired by the tac-shooter genre.
// ============================================================================

export const CONFIG = {
  roundsToWin: 13,
  startingCredits: 800,
  maxCredits: 9000,
  buyTime: 22, // seconds
  roundTime: 100, // seconds
  plantTime: 45, // seconds after plant to defuse
  plantDuration: 3.5, // seconds to plant
  defuseDuration: 6.5, // seconds to defuse
  team: { attackers: 'ATTACK', defenders: 'DEFENSE' } as const,

  // Economy rewards
  reward: {
    win: 3000,
    loss: 1900,
    lossBonusStep: 500, // extra per consecutive loss
    kill: 200,
    plant: 300,
    defuse: 300,
  },
};

export type WeaponId =
  | 'classic' | 'ghost' | 'sheriff'
  | 'spectre' | 'stinger'
  | 'phantom' | 'vandal' | 'guardian'
  | 'operator' | 'knife';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  category: 'sidearm' | 'smg' | 'rifle' | 'sniper' | 'melee';
  cost: number;
  damage: { head: number; body: number; leg: number };
  fireRate: number;      // rounds per second
  magazine: number;
  reserve: number;
  reloadTime: number;    // seconds
  runSpeed: number;      // movement multiplier while equipped
  // Recoil / spray
  firstShotSpread: number;
  spreadPerShot: number;
  maxSpread: number;
  recoilKick: number;    // vertical viewmodel kick
  recoilRecovery: number;
  auto: boolean;
  pellets?: number;
  falloff?: number;      // distance at which damage begins to fall
  color: number;         // accent color
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  knife: {
    id: 'knife', name: 'Tactical Knife', category: 'melee', cost: 0,
    damage: { head: 75, body: 50, leg: 50 }, fireRate: 2, magazine: 0, reserve: 0,
    reloadTime: 0, runSpeed: 1.05, firstShotSpread: 0, spreadPerShot: 0, maxSpread: 0,
    recoilKick: 0, recoilRecovery: 10, auto: false, color: 0xcfd8dc,
  },
  classic: {
    id: 'classic', name: 'Classic', category: 'sidearm', cost: 0,
    damage: { head: 78, body: 26, leg: 22 }, fireRate: 6.75, magazine: 12, reserve: 36,
    reloadTime: 1.75, runSpeed: 1.0, firstShotSpread: 0.4, spreadPerShot: 0.7, maxSpread: 3.2,
    recoilKick: 0.9, recoilRecovery: 9, auto: false, falloff: 30, color: 0x90a4ae,
  },
  ghost: {
    id: 'ghost', name: 'Ghost', category: 'sidearm', cost: 500,
    damage: { head: 105, body: 30, leg: 26 }, fireRate: 6.75, magazine: 15, reserve: 45,
    reloadTime: 1.5, runSpeed: 1.0, firstShotSpread: 0.3, spreadPerShot: 0.55, maxSpread: 2.6,
    recoilKick: 1.0, recoilRecovery: 9, auto: false, falloff: 30, color: 0xb0bec5,
  },
  sheriff: {
    id: 'sheriff', name: 'Sheriff', category: 'sidearm', cost: 800,
    damage: { head: 159, body: 55, leg: 46 }, fireRate: 4, magazine: 6, reserve: 24,
    reloadTime: 2.25, runSpeed: 1.0, firstShotSpread: 0.25, spreadPerShot: 1.4, maxSpread: 4,
    recoilKick: 2.4, recoilRecovery: 7, auto: false, falloff: 30, color: 0xffc107,
  },
  stinger: {
    id: 'stinger', name: 'Stinger', category: 'smg', cost: 950,
    damage: { head: 67, body: 27, leg: 22 }, fireRate: 16, magazine: 20, reserve: 60,
    reloadTime: 2.25, runSpeed: 0.98, firstShotSpread: 0.5, spreadPerShot: 0.35, maxSpread: 5,
    recoilKick: 0.8, recoilRecovery: 12, auto: true, falloff: 20, color: 0x8d6e63,
  },
  spectre: {
    id: 'spectre', name: 'Spectre', category: 'smg', cost: 1600,
    damage: { head: 66, body: 26, leg: 22 }, fireRate: 13.33, magazine: 30, reserve: 90,
    reloadTime: 2.25, runSpeed: 0.98, firstShotSpread: 0.35, spreadPerShot: 0.28, maxSpread: 4,
    recoilKick: 0.7, recoilRecovery: 13, auto: true, falloff: 20, color: 0x78909c,
  },
  guardian: {
    id: 'guardian', name: 'Guardian', category: 'rifle', cost: 2250,
    damage: { head: 195, body: 65, leg: 49 }, fireRate: 5.25, magazine: 12, reserve: 36,
    reloadTime: 2.5, runSpeed: 0.95, firstShotSpread: 0.15, spreadPerShot: 1.1, maxSpread: 3,
    recoilKick: 1.8, recoilRecovery: 8, auto: false, falloff: 50, color: 0xa1887f,
  },
  phantom: {
    id: 'phantom', name: 'Phantom', category: 'rifle', cost: 2900,
    damage: { head: 156, body: 39, leg: 33 }, fireRate: 11, magazine: 30, reserve: 90,
    reloadTime: 2.5, runSpeed: 0.95, firstShotSpread: 0.2, spreadPerShot: 0.42, maxSpread: 5.5,
    recoilKick: 1.1, recoilRecovery: 9, auto: true, falloff: 50, color: 0x546e7a,
  },
  vandal: {
    id: 'vandal', name: 'Vandal', category: 'rifle', cost: 2900,
    damage: { head: 160, body: 40, leg: 34 }, fireRate: 9.75, magazine: 25, reserve: 75,
    reloadTime: 2.5, runSpeed: 0.95, firstShotSpread: 0.2, spreadPerShot: 0.5, maxSpread: 6,
    recoilKick: 1.35, recoilRecovery: 8.5, auto: true, falloff: 100, color: 0x37474f,
  },
  operator: {
    id: 'operator', name: 'Operator', category: 'sniper', cost: 4700,
    damage: { head: 255, body: 150, leg: 120 }, fireRate: 0.75, magazine: 5, reserve: 15,
    reloadTime: 3.7, runSpeed: 0.85, firstShotSpread: 0.02, spreadPerShot: 6, maxSpread: 8,
    recoilKick: 4, recoilRecovery: 5, auto: false, falloff: 100, color: 0x263238,
  },
};

export const BUYABLE: WeaponId[] = [
  'classic', 'ghost', 'sheriff', 'stinger', 'spectre',
  'guardian', 'phantom', 'vandal', 'operator',
];

// ----------------------------------------------------------------------------
//  Agents & abilities
// ----------------------------------------------------------------------------
export type AbilityKind = 'dash' | 'flash' | 'smoke' | 'molly' | 'heal' | 'wall' | 'recon';

export interface AbilityDef {
  key: string;          // display key binding
  name: string;
  kind: AbilityKind;
  charges: number;
  cooldown: number;     // seconds between uses (0 = charge based)
  desc: string;
}

export interface AgentDef {
  id: string;
  name: string;
  role: 'Duelist' | 'Sentinel' | 'Controller' | 'Initiator';
  color: number;
  bio: string;
  abilities: AbilityDef[]; // [Q, E, C]
}

export const AGENTS: AgentDef[] = [
  {
    id: 'volt', name: 'Volt', role: 'Duelist', color: 0x00e5ff,
    bio: 'A high-speed skirmisher who dashes through gaps and takes duels first.',
    abilities: [
      { key: 'E', name: 'Slipstream', kind: 'dash', charges: 2, cooldown: 0, desc: 'Dash a short distance in your movement direction.' },
      { key: 'Q', name: 'Flashfire', kind: 'flash', charges: 1, cooldown: 0, desc: 'Throw a blinding flash that dazes anyone looking at it.' },
      { key: 'C', name: 'Veil', kind: 'smoke', charges: 1, cooldown: 0, desc: 'Deploy a vision-blocking cloud at your feet.' },
    ],
  },
  {
    id: 'ember', name: 'Ember', role: 'Duelist', color: 0xff5722,
    bio: 'Fire-wielding aggressor. Flash, burn, and heal off the confirmed kill.',
    abilities: [
      { key: 'E', name: 'Blaze', kind: 'molly', charges: 1, cooldown: 0, desc: 'Ignite the ground, damaging enemies who stand in it.' },
      { key: 'Q', name: 'Sear', kind: 'flash', charges: 1, cooldown: 0, desc: 'A curving flash that blinds enemies.' },
      { key: 'C', name: 'Second Wind', kind: 'heal', charges: 1, cooldown: 0, desc: 'Regenerate health over a few seconds.' },
    ],
  },
  {
    id: 'atlas', name: 'Atlas', role: 'Controller', color: 0x7c4dff,
    bio: 'A methodical strategist who carves the map with smokes and walls.',
    abilities: [
      { key: 'E', name: 'Bulwark', kind: 'wall', charges: 1, cooldown: 0, desc: 'Raise a solid barrier of light.' },
      { key: 'Q', name: 'Fog', kind: 'smoke', charges: 2, cooldown: 0, desc: 'Deploy long-lasting vision blockers.' },
      { key: 'C', name: 'Scorch', kind: 'molly', charges: 1, cooldown: 0, desc: 'Area denial fire zone.' },
    ],
  },
  {
    id: 'sable', name: 'Sable', role: 'Sentinel', color: 0x26c281,
    bio: 'A protective anchor who heals allies and locks down flanks.',
    abilities: [
      { key: 'E', name: 'Mend', kind: 'heal', charges: 1, cooldown: 0, desc: 'Heal yourself back to full.' },
      { key: 'Q', name: 'Barrier', kind: 'wall', charges: 1, cooldown: 0, desc: 'Summon a defensive wall.' },
      { key: 'C', name: 'Pulse', kind: 'recon', charges: 1, cooldown: 0, desc: 'Reveal nearby enemies briefly.' },
    ],
  },
];
