# OVERWATCH PROTOCOL

A browser-based **tactical FPS** inspired by the round-based "plant the spike" genre,
built from scratch with **Three.js**. Runs entirely in the browser — no install, no plugins.

> ⚠️ This is an **original** game. It is not affiliated with, endorsed by, or a copy of
> any existing title. All art is procedurally generated geometry and all audio is
> synthesized at runtime, so there are no third-party or copyrighted assets.

## Features

- **Round-based objective play** — attackers plant the Spike, defenders defuse it. First to 13.
- **Buy phase & economy** — earn credits from kills, plants and round wins; buy weapons and shields.
- **Weapons** — Classic, Ghost, Sheriff, Stinger, Spectre, Guardian, Phantom, Vandal, Operator, Knife —
  each with its own damage profile, fire rate, recoil and spray behaviour.
- **Gunplay** — hitscan with headshot multipliers, movement-based accuracy, recoil recovery,
  tracers, muzzle flashes, hit-markers and reloads.
- **Agents & abilities** — pick one of four agents (Volt, Ember, Atlas, Sable). Abilities include
  dash, flash, smoke, molly (fire), healing and light-walls.
- **Enemy & ally bots** with line-of-sight combat AI.
- **Full HUD** — health/shield, ammo, credits, minimap, killfeed, scoreboard, round timer and spike status.
- **Graphics** — real-time shadows, bloom post-processing, a stylized two-site map ("Foundry")
  and a gradient sky.
- **Procedural audio** — every gunshot, footstep and UI sound is generated with the Web Audio API.

## Controls

| Action | Key |
| --- | --- |
| Move | `W` `A` `S` `D` |
| Walk (quiet/accurate) | `Shift` |
| Crouch | `Ctrl` / `X` |
| Jump | `Space` |
| Fire | Left Mouse |
| Aim | Right Mouse |
| Reload | `R` |
| Plant / interact | hold `F` (on a site) |
| Abilities | `E` `Q` `C` |
| Buy menu | `B` (during buy phase) · `Enter` to ready up |
| Scoreboard | hold `Tab` |

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev      # http://localhost:3000
```

To create a production build and serve it:

```bash
npm run build
npm start
```

## Tech

- [Three.js](https://threejs.org/) for rendering, post-processing (UnrealBloom) and shadows
- TypeScript + [Vite](https://vitejs.dev/) for bundling and dev server
- Express for the production static server
- Web Audio API for all sound
