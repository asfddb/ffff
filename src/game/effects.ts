// ============================================================================
//  Weapon viewmodel + transient combat VFX (tracers, sparks, muzzle flash).
// ============================================================================
import * as THREE from 'three';
import type { WeaponDef } from './config';

export class Viewmodel {
  group = new THREE.Group();
  private body: THREE.Object3D | null = null;
  private muzzleLight: THREE.PointLight;
  private muzzleFlash: THREE.Mesh;
  private recoilZ = 0;
  private recoilPitch = 0;
  private sway = new THREE.Vector2();
  private basePos = new THREE.Vector3(0.28, -0.28, -0.6);

  constructor() {
    this.muzzleLight = new THREE.PointLight(0xffcc66, 0, 8);
    this.muzzleLight.position.set(0, 0.02, -1.1);
    this.group.add(this.muzzleLight);

    this.muzzleFlash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.35),
      new THREE.MeshBasicMaterial({ color: 0xffdd88, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false }),
    );
    this.muzzleFlash.position.set(0, 0.02, -1.15);
    this.muzzleFlash.renderOrder = 2000;
    this.group.add(this.muzzleFlash);

    this.group.position.copy(this.basePos);
    this.setWeapon(null);
  }

  setWeapon(def: WeaponDef | null) {
    if (this.body) {
      this.group.remove(this.body);
      this.body.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) m.geometry.dispose(); });
    }
    const color = def ? def.color : 0x555555;
    const g = new THREE.Group();

    if (def && def.category === 'melee') {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.02), new THREE.MeshStandardMaterial({ color: 0xdfe6ee, metalness: 0.9, roughness: 0.2 }));
      blade.position.set(0, 0, -0.5);
      blade.rotation.x = Math.PI / 2;
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.04), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      handle.position.set(0, -0.06, -0.28);
      g.add(blade, handle);
    } else {
      const mat = new THREE.MeshStandardMaterial({ color: 0x2a2e35, metalness: 0.6, roughness: 0.4 });
      const accent = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, metalness: 0.5, roughness: 0.4 });
      const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.55), mat); receiver.position.set(0, 0, -0.55);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 12), mat); barrel.rotation.x = Math.PI / 2; barrel.position.set(0, 0.03, -1.0);
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.08), mat); grip.position.set(0, -0.13, -0.4); grip.rotation.x = 0.3;
      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.1), accent); mag.position.set(0, -0.16, -0.6);
      const sight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.05), accent); sight.position.set(0, 0.1, -0.55);
      g.add(receiver, barrel, grip, mag, sight);
      const isBig = def && (def.category === 'rifle' || def.category === 'sniper');
      if (isBig) {
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.2), mat); stock.position.set(0, -0.02, -0.2);
        g.add(stock);
      }
    }
    g.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = false; });
    this.body = g;
    this.group.add(this.body);
  }

  kick(def: WeaponDef) {
    this.recoilZ = Math.min(this.recoilZ + 0.06, 0.18);
    this.recoilPitch = Math.min(this.recoilPitch + def.recoilKick * 0.01, 0.14);
    this.muzzleLight.intensity = 3;
    (this.muzzleFlash.material as THREE.MeshBasicMaterial).opacity = 1;
    this.muzzleFlash.rotation.z = Math.random() * Math.PI;
    this.muzzleFlash.scale.setScalar(0.7 + Math.random() * 0.6);
  }

  update(dt: number, moveAmount: number, aiming: boolean, mouseSway: THREE.Vector2) {
    this.recoilZ *= Math.max(0, 1 - dt * 10);
    this.recoilPitch *= Math.max(0, 1 - dt * 9);
    this.muzzleLight.intensity *= Math.max(0, 1 - dt * 20);
    const mf = this.muzzleFlash.material as THREE.MeshBasicMaterial;
    mf.opacity *= Math.max(0, 1 - dt * 25);

    // sway toward mouse motion
    this.sway.lerp(mouseSway, Math.min(1, dt * 8));

    const bob = Math.sin(performance.now() * 0.008) * 0.012 * moveAmount;
    const target = aiming
      ? new THREE.Vector3(0, -0.16, -0.5)
      : this.basePos.clone();
    target.z += this.recoilZ;
    target.y += bob - this.sway.y * 0.02;
    target.x += -this.sway.x * 0.02;
    this.group.position.lerp(target, Math.min(1, dt * 14));
    this.group.rotation.x = this.recoilPitch;
    this.group.rotation.y = -this.sway.x * 0.03;
  }
}

// ---- Transient world effects ----------------------------------------------
interface Tracer { mesh: THREE.Line; life: number; }
interface Spark { mesh: THREE.Points; life: number; vels: Float32Array; }

export class Effects {
  private scene: THREE.Scene;
  private tracers: Tracer[] = [];
  private sparks: Spark[] = [];

  constructor(scene: THREE.Scene) { this.scene = scene; }

  tracer(from: THREE.Vector3, to: THREE.Vector3, color = 0xfff3c4) {
    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ mesh: line, life: 0.08 });
  }

  impact(point: THREE.Vector3, normal: THREE.Vector3, color = 0xffe0a0) {
    const N = 12;
    const pos = new Float32Array(N * 3);
    const vels = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = point.x; pos[i * 3 + 1] = point.y; pos[i * 3 + 2] = point.z;
      const v = normal.clone().multiplyScalar(1.5).add(new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 3, (Math.random() - 0.5) * 3));
      vels[i * 3] = v.x; vels[i * 3 + 1] = v.y; vels[i * 3 + 2] = v.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color, size: 0.09, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const pts = new THREE.Points(geo, mat);
    this.scene.add(pts);
    this.sparks.push({ mesh: pts, life: 0.4, vels });
  }

  bloodHit(point: THREE.Vector3) { this.impact(point, new THREE.Vector3(0, 1, 0), 0xd63a3a); }

  update(dt: number) {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      (t.mesh.material as THREE.LineBasicMaterial).opacity = Math.max(0, t.life / 0.08) * 0.9;
      if (t.life <= 0) { this.scene.remove(t.mesh); t.mesh.geometry.dispose(); this.tracers.splice(i, 1); }
    }
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.life -= dt;
      const attr = s.mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let j = 0; j < arr.length; j += 3) {
        s.vels[j + 1] -= 9 * dt;
        arr[j] += s.vels[j] * dt;
        arr[j + 1] += s.vels[j + 1] * dt;
        arr[j + 2] += s.vels[j + 2] * dt;
      }
      attr.needsUpdate = true;
      (s.mesh.material as THREE.PointsMaterial).opacity = Math.max(0, s.life / 0.4);
      if (s.life <= 0) { this.scene.remove(s.mesh); s.mesh.geometry.dispose(); this.sparks.splice(i, 1); }
    }
  }
}
