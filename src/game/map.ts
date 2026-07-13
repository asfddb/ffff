// ============================================================================
//  Map builder — an original two-site tactical map ("Foundry").
//  Returns collidable AABB boxes plus the decorative meshes.
// ============================================================================
import * as THREE from 'three';

export interface Collider {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export interface MapData {
  group: THREE.Group;
  colliders: Collider[];
  siteA: THREE.Vector3;
  siteB: THREE.Vector3;
  attackerSpawn: THREE.Vector3;
  defenderSpawn: THREE.Vector3;
  bounds: { min: THREE.Vector3; max: THREE.Vector3 };
}

const MAT = {
  floor: new THREE.MeshStandardMaterial({ color: 0x5c6470, roughness: 0.95, metalness: 0.05 }),
  floor2: new THREE.MeshStandardMaterial({ color: 0x6b7480, roughness: 0.9 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x8a95a5, roughness: 0.8 }),
  wallDark: new THREE.MeshStandardMaterial({ color: 0x6d7885, roughness: 0.85 }),
  crate: new THREE.MeshStandardMaterial({ color: 0xb0885c, roughness: 0.7 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xb8c2ce, roughness: 0.35, metalness: 0.6 }),
};

function box(
  colliders: Collider[], group: THREE.Group,
  x: number, y: number, z: number, w: number, h: number, d: number,
  mat: THREE.Material, collide = true, castShadow = true,
) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y + h / 2, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  group.add(mesh);
  if (collide) {
    colliders.push({
      min: new THREE.Vector3(x - w / 2, y, z - d / 2),
      max: new THREE.Vector3(x + w / 2, y + h, z + d / 2),
    });
  }
  return mesh;
}

function neon(group: THREE.Group, x: number, y: number, z: number, w: number, h: number, d: number, color: number) {
  const mat = new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 2.4, roughness: 0.4,
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  group.add(mesh);
  return mesh;
}

export function buildMap(): MapData {
  const group = new THREE.Group();
  const colliders: Collider[] = [];
  const HALF = 45;

  // ---- Ground -------------------------------------------------------------
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(HALF * 2, HALF * 2), MAT.floor);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Central mid strip (lighter)
  box(colliders, group, 0, 0.01, 0, 12, 0.02, HALF * 2, MAT.floor2, false, false);

  // ---- Perimeter walls ----------------------------------------------------
  const WH = 8; // wall height
  box(colliders, group, 0, 0, -HALF, HALF * 2, WH, 1.5, MAT.wall);
  box(colliders, group, 0, 0, HALF, HALF * 2, WH, 1.5, MAT.wall);
  box(colliders, group, -HALF, 0, 0, 1.5, WH, HALF * 2, MAT.wall);
  box(colliders, group, HALF, 0, 0, 1.5, WH, HALF * 2, MAT.wall);

  // ---- Interior dividing walls (create lanes) -----------------------------
  // Big central structure separating A and B approaches
  box(colliders, group, 0, 0, -8, 8, WH, 22, MAT.wallDark);
  box(colliders, group, 0, 0, 22, 8, WH, 26, MAT.wallDark);

  // ---- A site (right side, +x) --------------------------------------------
  const siteA = new THREE.Vector3(28, 0, -20);
  box(colliders, group, 28, 0.02, -20, 18, 0.04, 18, MAT.floor2, false, false);
  neon(group, 22, 0.1, -20, 0.3, 0.05, 18, 0x00e5ff);
  neon(group, 34, 0.1, -20, 0.3, 0.05, 18, 0x00e5ff);
  neon(group, 28, 0.1, -29, 18, 0.05, 0.3, 0x00e5ff);
  neon(group, 28, 0.1, -11, 18, 0.05, 0.3, 0x00e5ff);
  // Cover crates on A
  box(colliders, group, 24, 0, -24, 3, 2.2, 3, MAT.crate);
  box(colliders, group, 32, 0, -16, 3, 2.2, 3, MAT.crate);
  box(colliders, group, 30, 0, -25, 2.5, 1.2, 2.5, MAT.crate);
  box(colliders, group, 20, 0, -14, 2, 3.2, 4, MAT.wall);
  // A main choke
  box(colliders, group, 12, 0, -35, 2, WH, 12, MAT.wallDark);

  // ---- B site (left side, -x) ---------------------------------------------
  const siteB = new THREE.Vector3(-28, 0, -20);
  box(colliders, group, -28, 0.02, -20, 18, 0.04, 18, MAT.floor2, false, false);
  neon(group, -22, 0.1, -20, 0.3, 0.05, 18, 0x00e5ff);
  neon(group, -34, 0.1, -20, 0.3, 0.05, 18, 0x00e5ff);
  neon(group, -28, 0.1, -29, 18, 0.05, 0.3, 0x00e5ff);
  neon(group, -28, 0.1, -11, 18, 0.05, 0.3, 0x00e5ff);
  box(colliders, group, -24, 0, -24, 3, 2.2, 3, MAT.crate);
  box(colliders, group, -32, 0, -16, 3, 2.2, 3, MAT.crate);
  box(colliders, group, -30, 0, -25, 2.5, 1.2, 2.5, MAT.crate);
  box(colliders, group, -20, 0, -14, 2, 3.2, 4, MAT.wall);
  box(colliders, group, -12, 0, -35, 2, WH, 12, MAT.wallDark);

  // ---- Mid boxes ----------------------------------------------------------
  box(colliders, group, 0, 0, 30, 3, 2, 3, MAT.crate);
  box(colliders, group, 6, 0, 12, 2.5, 1.5, 2.5, MAT.crate);
  box(colliders, group, -6, 0, 12, 2.5, 1.5, 2.5, MAT.crate);
  box(colliders, group, 0, 0, -2, 4, 1.2, 2, MAT.metal);

  // Ramps / raised platforms near sites for verticality (decorative + collide)
  box(colliders, group, 40, 0, -32, 6, 2.5, 6, MAT.wall);
  box(colliders, group, -40, 0, -32, 6, 2.5, 6, MAT.wall);

  // ---- Spawns -------------------------------------------------------------
  const attackerSpawn = new THREE.Vector3(0, 0, 38);   // south
  const defenderSpawn = new THREE.Vector3(0, 0, -40);  // north, behind sites

  // Spawn markers
  neon(group, 0, 0.1, 38, 10, 0.05, 0.3, 0xff4655);
  neon(group, 0, 0.1, -40, 10, 0.05, 0.3, 0x00e5ff);

  return {
    group, colliders, siteA, siteB, attackerSpawn, defenderSpawn,
    bounds: {
      min: new THREE.Vector3(-HALF + 1, 0, -HALF + 1),
      max: new THREE.Vector3(HALF - 1, WH, HALF - 1),
    },
  };
}
