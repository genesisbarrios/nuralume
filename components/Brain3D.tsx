"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BRAIN_WAVE_TAGS } from "@/libs/trackCategories";
import * as THREE from "three";

// A procedural 3D brain for the homepage hero: two folded hemispheres, a
// cerebellum and a brain stem, with a glowing rim, synapses sparkling on the
// surface and a warm light behind it. Slowly turns and pulses.

const PULSE_MS = 3200; // matches HeroScene's glow pulse

// Folds: a few ridged sine fields in different directions, summed. Cheap,
// deterministic, and reads as gyri and sulci from a distance.
const DIRS = Array.from({ length: 9 }, (_, i) => {
  const a = i * 2.399963; // golden angle spread
  const z = 1 - (2 * (i + 0.5)) / 9;
  const r = Math.sqrt(1 - z * z);
  return new THREE.Vector3(Math.cos(a) * r, z, Math.sin(a) * r);
});
function folds(p: THREE.Vector3, freq: number) {
  let v = 0;
  for (let i = 0; i < DIRS.length; i++) {
    const d = DIRS[i];
    const t = p.dot(d) * freq * (1 + i * 0.13) + Math.sin(p.dot(DIRS[(i + 3) % 9]) * freq * 0.7) * 1.6;
    v += 1 - Math.abs(Math.sin(t)); // ridged
  }
  return v / DIRS.length; // ~0..1
}

// A sphere pushed into a lobe shape and wrinkled along its normals.
function lobeGeometry(opts: {
  scale: [number, number, number];
  freq: number;
  depth: number;
  seg: number;
  flattenMedial?: number; // flatten the side facing the other hemisphere (sign of x)
}) {
  const g = new THREE.SphereGeometry(1, opts.seg, Math.round(opts.seg * 0.75));
  const pos = g.attributes.position as THREE.BufferAttribute;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const colors = new Float32Array(pos.count * 3);
  const deep = new THREE.Color("#241047");
  const ridge = new THREE.Color("#a58cff");
  const warm = new THREE.Color("#f2cda6");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    n.copy(p).normalize();
    // medial wall: squash toward a plane so the hemispheres sit close
    if (opts.flattenMedial && Math.sign(p.x) === Math.sign(opts.flattenMedial)) p.x *= 0.45;
    // slightly flatter underside, fuller frontal lobe
    if (p.y < 0) p.y *= 0.78;
    if (p.z > 0) p.y *= 1 + p.z * 0.06;
    p.multiply(new THREE.Vector3(...opts.scale));
    const f = folds(n, opts.freq);
    p.addScaledVector(n, (f - 0.55) * opts.depth);
    pos.setXYZ(i, p.x, p.y, p.z);
    const k = Math.min(1, Math.max(0, (f - 0.35) / 0.5));
    c.copy(deep).lerp(ridge, Math.pow(k, 1.4)).lerp(warm, Math.max(0, k - 0.75) * 1.2 * Math.max(0, n.y + 0.3));
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

// The cerebrum as one surface: an elongated dome with the longitudinal
// fissure down the middle, temporal lobes bulging low on each side, a fuller
// back (occipital) and a lower, rounded front (frontal), all wrinkled.
function cerebrumGeometry(seg: number) {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75));
  const pos = g.attributes.position as THREE.BufferAttribute;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const colors = new Float32Array(pos.count * 3);
  const deep = new THREE.Color("#22103f");
  const ridge = new THREE.Color("#a58cff");
  const warm = new THREE.Color("#f2cda6");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    n.fromBufferAttribute(pos, i).normalize();
    p.copy(n);
    // base proportions: width, height, length (z = front)
    p.x *= 0.86;
    p.y *= p.y > 0 ? 0.78 : 0.5;
    p.z *= 1.18;
    // front a little lower and rounder, back fuller
    if (p.z > 0) p.y -= p.z * 0.12;
    else p.y += -p.z * 0.04;
    // temporal lobes: bulge outward and down, low on the sides, toward the front
    const tl = Math.exp(-Math.pow((n.y + 0.35) / 0.3, 2)) * Math.exp(-Math.pow((n.z - 0.1) / 0.45, 2)) * Math.pow(Math.abs(n.x), 1.5);
    p.x += Math.sign(n.x) * tl * 0.1;
    p.y -= tl * 0.16;
    // longitudinal fissure along the top middle
    const fis = Math.exp(-Math.pow(n.x / 0.07, 2)) * Math.max(0, n.y + 0.15);
    p.addScaledVector(n, -fis * 0.16);
    // lateral sulcus: a groove separating the temporal lobe
    const lat = Math.exp(-Math.pow((n.y + 0.08 - n.z * 0.25) / 0.05, 2)) * Math.max(0, Math.abs(n.x) - 0.35) * (n.z > -0.4 ? 1 : 0);
    p.addScaledVector(n, -lat * 0.12);
    // gyri & sulci
    const f = folds(n, 12);
    p.addScaledVector(n, (f - 0.55) * 0.1);
    pos.setXYZ(i, p.x, p.y, p.z);
    const k = Math.min(1, Math.max(0, (f - 0.35) / 0.5)) * (1 - fis * 0.8) * (1 - lat * 1.5);
    c.copy(deep).lerp(ridge, Math.pow(Math.max(0, k), 1.4)).lerp(warm, Math.max(0, k - 0.75) * 1.2 * Math.max(0, n.y + 0.3));
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

// Fresnel rim glow (backside shell, additive) — fakes bloom without postprocessing
const rimMaterial = () =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color("#a98bff") }, uPower: { value: 2.2 }, uIntensity: { value: 1 } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uPower; uniform float uIntensity;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(vN, vV)), uPower);
        gl_FragColor = vec4(uColor * f * uIntensity, f * uIntensity);
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
  });

// Where each brain wave's node sits on the brain (direction from the center;
// the node snaps to the surface vertex that points most that way).
const WAVE_SPOTS: Record<string, [number, number, number]> = {
  gamma: [0.25, 1, 0.45],
  beta: [0.8, 0.35, 0.7],
  alpha: [-0.35, 0.9, -0.45],
  theta: [-0.9, 0.05, 0.3],
  delta: [0.75, 0.1, -0.75],
};

export type BrainWaveTag = (typeof BRAIN_WAVE_TAGS)[number];

function WaveNode({
  tag,
  position,
  active,
  onPick,
}: {
  tag: BrainWaveTag;
  position: THREE.Vector3;
  active: boolean;
  onPick: (tag: BrainWaveTag, world: THREE.Vector3) => void;
}) {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const color = useMemo(() => new THREE.Color(tag.color), [tag.color]);
  // Faster waves pulse faster
  const speed = 0.8 + tag.cycles * 0.35;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    const p = 0.5 + 0.5 * Math.sin(t);
    const big = hover || active ? 1.35 : 1;
    core.current?.scale.setScalar(big * (0.9 + 0.2 * p));
    if (halo.current) {
      halo.current.scale.setScalar(big * (1.5 + 0.7 * p));
      (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + 0.22 * (1 - p);
    }
  });

  const click = (e: ThreeEvent<MouseEvent>) => {
    // ignore the click that ends a drag
    if (e.delta > 6) return;
    e.stopPropagation();
    const world = new THREE.Vector3();
    e.object.getWorldPosition(world);
    onPick(tag, world);
  };

  return (
    <group position={position}>
      <mesh
        ref={core}
        onClick={click}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
      >
        <sphereGeometry args={[0.065, 32, 32]} />
        <meshBasicMaterial color={color.clone().multiplyScalar(1.5)} toneMapped={false} />
      </mesh>
      <mesh ref={halo} raycast={() => null}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={hover || active ? 2 : 0.6} distance={0.6} />
    </group>
  );
}

function Brain({
  activeWave,
  onPickWave,
}: {
  activeWave: string | null;
  onPickWave: (tag: BrainWaveTag, world: THREE.Vector3) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.PointsMaterial>(null);
  const rims = useRef<THREE.ShaderMaterial[]>([]);
  const backLight = useRef<THREE.PointLight>(null);

  const { brain, cerebellum, stem, sparkGeo, nodes } = useMemo(() => {
    const brain = cerebrumGeometry(200);
    const cerebellum = lobeGeometry({ scale: [0.74, 0.34, 0.4], freq: 22, depth: 0.035, seg: 120 });
    const stem = new THREE.CylinderGeometry(0.15, 0.1, 0.7, 24, 1);
    const a = brain.attributes.position as THREE.BufferAttribute;
    const nrm = brain.attributes.normal as THREE.BufferAttribute;

    // synapse sparkles: random points on the surface
    const pts: number[] = [];
    for (let k = 0; k < 480; k++) {
      const i = Math.floor(Math.random() * a.count);
      pts.push(a.getX(i) + nrm.getX(i) * 0.02, a.getY(i) + nrm.getY(i) * 0.02, a.getZ(i) + nrm.getZ(i) * 0.02);
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));

    // brain wave nodes, sitting just above the surface
    const v = new THREE.Vector3();
    const nodes = BRAIN_WAVE_TAGS.map((tag) => {
      const dir = new THREE.Vector3(...(WAVE_SPOTS[tag.subcategory] ?? [0, 1, 0])).normalize();
      let best = 0, bestDot = -Infinity;
      for (let i = 0; i < a.count; i += 3) {
        v.fromBufferAttribute(a, i);
        const d = v.clone().normalize().dot(dir) * v.length();
        if (d > bestDot) { bestDot = d; best = i; }
      }
      const pos = new THREE.Vector3().fromBufferAttribute(a, best);
      const n = new THREE.Vector3().fromBufferAttribute(nrm, best).normalize();
      return { tag, position: pos.addScaledVector(n, 0.07) };
    });
    return { brain, cerebellum, stem, sparkGeo, nodes };
  }, []);

  const tissue = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        vertexColors: true,
        emissive: new THREE.Color("#2a1660"),
        emissiveIntensity: 0.6,
        roughness: 0.38,
        metalness: 0.1,
        clearcoat: 0.6,
        clearcoatRoughness: 0.35,
        sheen: 1,
        sheenColor: new THREE.Color("#f2cda6"),
        sheenRoughness: 0.5,
      }),
    [],
  );
  const rimL = useMemo(rimMaterial, []);
  rims.current = [rimL];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 0.5 + 0.5 * Math.sin(((t * 1000) / PULSE_MS) * Math.PI * 2 - Math.PI / 2);
    if (group.current) {
      // three-quarter side view so it reads as a brain, swaying slowly
      // (dragging orbits the camera around it on top of this)
      group.current.rotation.y = -1.05 + Math.sin(t * 0.22) * 0.3;
      group.current.rotation.x = 0.22 + Math.sin(t * 0.17) * 0.05;
      group.current.scale.setScalar(1 + 0.035 * pulse);
    }
    tissue.emissiveIntensity = 0.45 + 0.55 * pulse;
    for (const r of rims.current) r.uniforms.uIntensity.value = 0.8 + 0.9 * pulse;
    if (sparks.current) sparks.current.opacity = 0.45 + 0.55 * Math.abs(Math.sin(t * 2.3));
    if (backLight.current) backLight.current.intensity = 45 + 60 * pulse;
  });

  return (
    <>
      {/* light behind the brain, plus cool fill and warm key */}
      <pointLight ref={backLight} position={[0, 0.2, -2.2]} color="#ffcf9a" intensity={50} distance={8} />
      <pointLight position={[-3, 2, 3]} color="#8fa8ff" intensity={25} distance={12} />
      <pointLight position={[3, -1, 2.5]} color="#c08bff" intensity={20} distance={12} />
      <ambientLight intensity={0.25} color="#6b5bd6" />

      <group ref={group}>
        <mesh geometry={brain} material={tissue} />
        <mesh geometry={brain} material={rimL} scale={1.05} raycast={() => null} />
        <mesh geometry={cerebellum} material={tissue} position={[0, -0.5, -0.78]} />
        <mesh geometry={stem} material={tissue} position={[0, -0.82, -0.38]} rotation={[0.35, 0, 0]} />
        <points geometry={sparkGeo} raycast={() => null}>
          <pointsMaterial
            ref={sparks}
            color="#ffd9b0"
            size={0.035}
            sizeAttenuation
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        {nodes.map((n) => (
          <WaveNode key={n.tag.subcategory} tag={n.tag} position={n.position} active={activeWave === n.tag.subcategory} onPick={onPickWave} />
        ))}
      </group>
    </>
  );
}

// Flies the camera into the brain (toward the picked node) when `target` is set.
function CameraDive({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree();
  useFrame((_, dt) => {
    if (!target) return;
    const goal = target.clone().multiplyScalar(1.4);
    camera.position.lerp(goal, Math.min(1, dt * 2.2));
    camera.lookAt(target);
  });
  return null;
}

export default function Brain3D({
  activeWave = null,
  diveTo = null,
  onPickWave = () => {},
}: {
  activeWave?: string | null;
  diveTo?: THREE.Vector3 | null;
  onPickWave?: (tag: BrainWaveTag, world: THREE.Vector3) => void;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.05, 3.3], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      // vertical swipes still scroll the page on phones; sideways drags spin the brain.
      // Soft edges so the canvas never shows as a box (e.g. during the dive).
      style={{
        background: "transparent",
        touchAction: "pan-y",
        WebkitMaskImage: "radial-gradient(ellipse closest-side at 50% 50%, #000 82%, transparent 100%)",
        maskImage: "radial-gradient(ellipse closest-side at 50% 50%, #000 82%, transparent 100%)",
      }}
    >
      <Brain activeWave={activeWave} onPickWave={onPickWave} />
      <OrbitControls
        enabled={!diveTo}
        enableZoom={false}
        enablePan={false}
        // spin only (no moving it around): a full 360 sideways, and over the top and under
        rotateSpeed={0.8}
        enableDamping
      />
      <CameraDive target={diveTo} />
    </Canvas>
  );
}
