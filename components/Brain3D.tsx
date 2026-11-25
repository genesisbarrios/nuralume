"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

function Brain() {
  const group = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.PointsMaterial>(null);
  const rims = useRef<THREE.ShaderMaterial[]>([]);
  const backLight = useRef<THREE.PointLight>(null);

  const { brain, cerebellum, stem, sparkGeo } = useMemo(() => {
        const seg2 = 200;
    const brain = cerebrumGeometry(seg2);
    const cerebellum = lobeGeometry({ scale: [0.74, 0.34, 0.4], freq: 22, depth: 0.035, seg: 120 });
    const stem = new THREE.CylinderGeometry(0.15, 0.1, 0.7, 24, 1);

    // synapse sparkles: random points on the hemisphere surfaces
    const pts: number[] = [];
    for (const [geo, off] of [[brain, 0]] as const) {
      const a = geo.attributes.position as THREE.BufferAttribute;
      const nrm = geo.attributes.normal as THREE.BufferAttribute;
      for (let k = 0; k < 480; k++) {
        const i = Math.floor(Math.random() * a.count);
        pts.push(
          a.getX(i) + off + nrm.getX(i) * 0.02,
          a.getY(i) + nrm.getY(i) * 0.02,
          a.getZ(i) + nrm.getZ(i) * 0.02,
        );
      }
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return { brain, cerebellum, stem, sparkGeo };
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
      group.current.rotation.y = -1.05 + Math.sin(t * 0.22) * 0.4;
      group.current.rotation.x = 0.22 + Math.sin(t * 0.17) * 0.05;
      const s = 1 + 0.035 * pulse;
      group.current.scale.setScalar(s);
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
        <mesh geometry={brain} material={rimL} scale={1.05} />
        <mesh geometry={cerebellum} material={tissue} position={[0, -0.5, -0.78]} />
        <mesh geometry={stem} material={tissue} position={[0, -0.82, -0.38]} rotation={[0.35, 0, 0]} />
        <points geometry={sparkGeo}>
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
      </group>
    </>
  );
}

export default function Brain3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.05, 3.3], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <Brain />
    </Canvas>
  );
}
