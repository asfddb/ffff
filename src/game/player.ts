// ============================================================================
//  Player controller — FPS movement, capsule-vs-AABB collision, view state.
// ============================================================================
import * as THREE from 'three';
import type { Collider } from './map';

const GRAVITY = 24;
const JUMP_V = 7.2;
const BASE_SPEED = 8.2;
const WALK_SPEED = 4.0;
const ACCEL = 60;
const PLAYER_RADIUS = 0.5;
const EYE_HEIGHT = 1.7;
const CROUCH_HEIGHT = 1.15;

export class Player {
  pos = new THREE.Vector3(0, 0, 38);
  vel = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  onGround = true;
  crouching = false;
  eye = EYE_HEIGHT;
  health = 100;
  shield = 0;
  alive = true;
  moveSpeedMul = 1;

  private colliders: Collider[];
  private bounds: { min: THREE.Vector3; max: THREE.Vector3 };

  constructor(colliders: Collider[], bounds: { min: THREE.Vector3; max: THREE.Vector3 }) {
    this.colliders = colliders;
    this.bounds = bounds;
  }

  spawn(p: THREE.Vector3, yaw: number) {
    this.pos.copy(p);
    this.vel.set(0, 0, 0);
    this.yaw = yaw;
    this.pitch = 0;
    this.health = 100;
    this.alive = true;
    this.crouching = false;
  }

  look(dx: number, dy: number, sens: number) {
    this.yaw -= dx * sens;
    this.pitch -= dy * sens;
    const lim = Math.PI / 2 - 0.05;
    this.pitch = Math.max(-lim, Math.min(lim, this.pitch));
  }

  get direction(): THREE.Vector3 {
    return new THREE.Vector3(
      Math.cos(this.pitch) * Math.sin(this.yaw) * -1,
      Math.sin(this.pitch),
      Math.cos(this.pitch) * Math.cos(this.yaw) * -1,
    ).normalize();
  }

  update(dt: number, input: { fwd: number; strafe: number; jump: boolean; walk: boolean; crouch: boolean; speedMul: number }) {
    if (!this.alive) return;
    this.crouching = input.crouch && this.onGround;
    const targetEye = this.crouching ? CROUCH_HEIGHT : EYE_HEIGHT;
    this.eye += (targetEye - this.eye) * Math.min(1, dt * 12);

    // Desired horizontal velocity in world space
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const wish = new THREE.Vector3();
    wish.addScaledVector(forward, input.fwd);
    wish.addScaledVector(right, input.strafe);
    if (wish.lengthSq() > 0) wish.normalize();

    let speed = (input.walk ? WALK_SPEED : BASE_SPEED) * input.speedMul;
    if (this.crouching) speed *= 0.55;
    const target = wish.multiplyScalar(speed);

    // Horizontal accel
    const hv = new THREE.Vector3(this.vel.x, 0, this.vel.z);
    hv.x += (target.x - hv.x) * Math.min(1, ACCEL * dt / Math.max(speed, 1));
    hv.z += (target.z - hv.z) * Math.min(1, ACCEL * dt / Math.max(speed, 1));
    this.vel.x = hv.x;
    this.vel.z = hv.z;

    // Gravity + jump
    if (input.jump && this.onGround) {
      this.vel.y = JUMP_V;
      this.onGround = false;
    }
    this.vel.y -= GRAVITY * dt;

    // Integrate with per-axis collision resolution
    this.moveAxis('x', this.vel.x * dt);
    this.moveAxis('z', this.vel.z * dt);
    this.onGround = false;
    this.moveAxis('y', this.vel.y * dt);

    // World bounds
    this.pos.x = Math.max(this.bounds.min.x + PLAYER_RADIUS, Math.min(this.bounds.max.x - PLAYER_RADIUS, this.pos.x));
    this.pos.z = Math.max(this.bounds.min.z + PLAYER_RADIUS, Math.min(this.bounds.max.z - PLAYER_RADIUS, this.pos.z));
    if (this.pos.y < 0) { this.pos.y = 0; this.vel.y = 0; this.onGround = true; }
  }

  private moveAxis(axis: 'x' | 'y' | 'z', delta: number) {
    if (delta === 0) return;
    this.pos[axis] += delta;
    const height = this.crouching ? CROUCH_HEIGHT : EYE_HEIGHT;
    const pmin = new THREE.Vector3(this.pos.x - PLAYER_RADIUS, this.pos.y, this.pos.z - PLAYER_RADIUS);
    const pmax = new THREE.Vector3(this.pos.x + PLAYER_RADIUS, this.pos.y + height, this.pos.z + PLAYER_RADIUS);

    for (const c of this.colliders) {
      if (pmax.x <= c.min.x || pmin.x >= c.max.x) continue;
      if (pmax.y <= c.min.y || pmin.y >= c.max.y) continue;
      if (pmax.z <= c.min.z || pmin.z >= c.max.z) continue;

      // Overlap — push out along the movement axis.
      if (axis === 'y') {
        if (delta < 0) { this.pos.y = c.max.y; this.vel.y = 0; this.onGround = true; }
        else { this.pos.y = c.min.y - height; this.vel.y = 0; }
      } else if (axis === 'x') {
        if (delta > 0) this.pos.x = c.min.x - PLAYER_RADIUS;
        else this.pos.x = c.max.x + PLAYER_RADIUS;
        this.vel.x = 0;
      } else {
        if (delta > 0) this.pos.z = c.min.z - PLAYER_RADIUS;
        else this.pos.z = c.max.z + PLAYER_RADIUS;
        this.vel.z = 0;
      }
      return;
    }
  }

  eyePosition(): THREE.Vector3 {
    return new THREE.Vector3(this.pos.x, this.pos.y + this.eye, this.pos.z);
  }

  takeDamage(amount: number): { died: boolean } {
    if (!this.alive) return { died: false };
    let dmg = amount;
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, dmg * 0.66);
      this.shield -= absorbed;
      dmg -= absorbed;
    }
    this.health -= dmg;
    if (this.health <= 0) { this.health = 0; this.alive = false; return { died: true }; }
    return { died: false };
  }
}
