"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { playPopSound, unlockAudio } from "./sounds";
import FullscreenButton from "./FullscreenButton";
import { useGameFullscreen } from "./useGameFullscreen";

// ============================================================================
// Procedural fluid/marble texture — direct port of the original canvas-based
// value-noise (fBm) generator. Deterministic per call, no image assets.
// ============================================================================
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return (h ^ (h >> 16)) & 0x7fffffff;
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = (hash(ix, iy) & 0xffff) / 65536;
  const b = (hash(ix + 1, iy) & 0xffff) / 65536;
  const c = (hash(ix, iy + 1) & 0xffff) / 65536;
  const d = (hash(ix + 1, iy + 1) & 0xffff) / 65536;
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number, octaves: number): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return val;
}

function generateFluidTexture(width: number, height: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      const nx = (x / width) * 2.8;
      const ny = (y / height) * 2.8;

      const n1 = fbm(nx, ny, 5);
      const n2 = fbm(nx + 3.2, ny + 1.8, 4);
      const n3 = fbm(nx + 6.4, ny + 4.2, 4);
      const n4 = fbm(nx * 1.5 + 9.0, ny * 1.5 + 7.5, 4);

      let r = 238;
      let g = 195;
      let b = 145;

      if (n1 > 0.4) {
        r = 80;
        g = 255;
        b = 200;
      }
      if (n2 > 0.55) {
        r = 150;
        g = 85;
        b = 235;
      }
      if (n3 > 0.6 && n2 < 0.45) {
        r = 255;
        g = 225;
        b = 90;
      }
      if (n4 > 0.5 && n1 < 0.55) {
        r = 255;
        g = 140;
        b = 190;
      }

      const edgeNoise = n1 * 0.8 + n2 * 0.2;
      const edgeLine = Math.sin(edgeNoise * 25) * 0.5 + 0.5;
      if (edgeLine > 0.85) {
        r -= 50;
        g -= 50;
        b -= 50;
      }

      data[i] = Math.max(60, Math.min(255, r));
      data[i + 1] = Math.max(60, Math.min(255, g));
      data[i + 2] = Math.max(60, Math.min(255, b));
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ============================================================================
// Bubble layout — vertices of a once-subdivided icosahedron give an even,
// pentagonal/hexagonal grid across the sphere's surface.
// ============================================================================
function useBubblePositions(sphereRadius: number): THREE.Vector3[] {
  return useMemo(() => {
    const icoGeo = new THREE.IcosahedronGeometry(sphereRadius, 1);
    const positions = icoGeo.attributes.position.array;
    const uniqueVerts = new Set<string>();
    const vertsArray: THREE.Vector3[] = [];

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
      if (!uniqueVerts.has(key)) {
        uniqueVerts.add(key);
        vertsArray.push(new THREE.Vector3(x, y, z));
      }
    }

    icoGeo.dispose();
    return vertsArray;
  }, [sphereRadius]);
}

const BUBBLE_RADIUS = 0.5;
const REST_SCALE: [number, number, number] = [1, 1, 0.7];
const POPPED_SCALE: [number, number, number] = [0.6, 0.6, 0.4];
// A pointer has to move more than this (in pixels) between down and up for
// it to count as a drag-to-rotate gesture instead of a pop.
const DRAG_THRESHOLD = 6;

// Evenly spread, vivid tie-dye hues — the golden angle keeps neighboring
// bubbles from landing on similar colors, so the spread reads as varied
// rather than a smooth rainbow gradient.
function bubbleColor(index: number): string {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 85%, 60%)`;
}

// Deterministic pseudo-random per-bubble size so real bubble-wrap-style
// unevenness reads as varied but stays stable across re-renders/pops rather
// than reshuffling on every toggle.
function bubbleSizeScale(index: number): number {
  const seed = Math.sin(index * 12.9898) * 43758.5453;
  const fraction = seed - Math.floor(seed);

  // A separate hash (different seed multiplier, so it's not correlated with
  // `fraction` above) picks out ~15% of bubbles to be noticeably smaller,
  // sprinkled in rather than every bubble shrinking uniformly.
  const tinySeed = Math.sin(index * 78.233) * 12345.6789;
  const tinyFraction = tinySeed - Math.floor(tinySeed);
  if (tinyFraction < 0.15) {
    return 0.35 + fraction * 0.15; // 0.35x – 0.5x of BUBBLE_RADIUS
  }

  return 0.75 + fraction * 0.5; // 0.75x – 1.25x of BUBBLE_RADIUS
}

// ============================================================================
// Little clear bubbles that scatter outward and fade whenever `trigger`
// changes — a fixed pool of pre-allocated (but hidden) meshes mutated via
// refs each frame, matching the same refs-for-per-frame-motion pattern used
// throughout this scene. Only mounted lazily on a bubble's first pop.
// ============================================================================
const PARTICLE_COUNT = 10;
const PARTICLE_LIFETIME = 0.7;

interface ScatterParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  active: boolean;
  baseScale: number;
}

function PopParticles({
  trigger,
  origin,
}: {
  trigger: number;
  origin: THREE.Vector3;
}) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const particles = useRef<ScatterParticle[]>(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      age: 0,
      active: false,
      baseScale: 0.1 + Math.random() * 0.07,
    }))
  );
  const lastTrigger = useRef(0);

  useEffect(() => {
    if (trigger === 0 || trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    for (const p of particles.current) {
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      p.position.copy(origin);
      p.velocity.copy(dir).multiplyScalar(0.9 + Math.random() * 0.7);
      p.age = 0;
      p.active = true;
    }
  }, [trigger, origin]);

  useFrame((_, delta) => {
    particles.current.forEach((p, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      if (!p.active) {
        if (mesh.visible) mesh.visible = false;
        return;
      }
      p.age += delta;
      if (p.age >= PARTICLE_LIFETIME) {
        p.active = false;
        mesh.visible = false;
        return;
      }
      p.velocity.multiplyScalar(0.93);
      p.position.addScaledVector(p.velocity, delta);
      mesh.visible = true;
      mesh.position.copy(p.position);
      const lifeRatio = 1 - p.age / PARTICLE_LIFETIME;
      mesh.scale.setScalar(p.baseScale * (0.5 + 0.5 * lifeRatio));
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.opacity = lifeRatio * 0.85;
    });
  });

  return (
    <>
      {particles.current.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0}
            roughness={0.05}
            metalness={0}
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

function Bubble({
  index,
  position,
  texture,
  popped,
  onToggle,
  dragMoved,
}: {
  index: number;
  position: THREE.Vector3;
  texture: THREE.CanvasTexture;
  popped: boolean;
  onToggle: () => void;
  dragMoved: React.MutableRefObject<boolean>;
}) {
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
    return q;
  }, [position]);

  const restPosition = position;
  const poppedPosition = useMemo(
    () => position.clone().multiplyScalar(0.8),
    [position]
  );
  const color = useMemo(() => bubbleColor(index), [index]);
  const radius = useMemo(
    () => BUBBLE_RADIUS * bubbleSizeScale(index),
    [index]
  );

  // Bumps whenever this bubble transitions from unpopped to popped, telling
  // PopParticles to fire a fresh scatter burst.
  const [burst, setBurst] = useState(0);
  const wasPopped = useRef(popped);
  useEffect(() => {
    if (popped && !wasPopped.current) {
      setBurst((b) => b + 1);
    }
    wasPopped.current = popped;
  }, [popped]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (dragMoved.current) return;
    onToggle();
  };

  return (
    <group>
      <mesh
        position={popped ? poppedPosition : restPosition}
        quaternion={quaternion}
        scale={popped ? POPPED_SCALE : REST_SCALE}
        onClick={handleClick}
      >
        <sphereGeometry args={[radius, 20, 20]} />
        <meshStandardMaterial
          map={texture}
          color={color}
          transparent
          opacity={popped ? 0.78 : 0.88}
          roughness={popped ? 1 : 0.25}
          metalness={0}
          emissive={popped ? "#222233" : color}
          emissiveIntensity={popped ? 0.15 : 0.12}
        />
      </mesh>
      {burst > 0 && <PopParticles trigger={burst} origin={restPosition} />}
    </group>
  );
}

function ToneMapping() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);
  return null;
}

// The ball's on-screen size is set by the camera's distance combined with
// its aspect ratio — a PerspectiveCamera's horizontal FOV shrinks as the
// container gets narrower (e.g. a phone-width card), so the same z=9 that
// frames the sphere nicely on a square/landscape container crops in tight
// on a narrow mobile one. Push the camera back as the container narrows so
// the sphere+bubbles keep roughly the same on-screen size everywhere.
const BASE_CAMERA_Z = 9;
const BASE_ASPECT = 1;
const MAX_CAMERA_Z = 20;

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const z =
      aspect < BASE_ASPECT
        ? Math.min((BASE_CAMERA_Z * BASE_ASPECT) / aspect, MAX_CAMERA_Z)
        : BASE_CAMERA_Z;
    camera.position.z = z;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);
  return null;
}

function PopItScene({
  bubblePositions,
  poppedIndices,
  onTogglePop,
}: {
  bubblePositions: THREE.Vector3[];
  poppedIndices: Set<number>;
  onTogglePop: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const dragMoved = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const texture = useMemo(() => generateFluidTexture(1024, 1024), []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragging.current || !groupRef.current) return;
      const deltaX = e.clientX - lastPointer.current.x;
      const deltaY = e.clientY - lastPointer.current.y;
      if (Math.abs(deltaX) + Math.abs(deltaY) > DRAG_THRESHOLD) {
        dragMoved.current = true;
      }
      groupRef.current.rotation.y += deltaX * 0.01;
      groupRef.current.rotation.x += deltaY * 0.01;
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    const handleUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = true;
    dragMoved.current = false;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <>
      <ToneMapping />
      <ResponsiveCamera />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 8]} intensity={1.8} />
      <directionalLight position={[-3, -2, -5]} intensity={0.8} />

      {/* Invisible backdrop so a drag started on empty canvas space (not
          directly on the sphere/bubbles) still rotates the sphere, matching
          the original's window-wide drag behavior. Fully transparent rather
          than visible=false — Three.js's raycaster skips invisible objects
          entirely, which would stop it from ever receiving pointer events. */}
      <mesh position={[0, 0, -6]} onPointerDown={handlePointerDown}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={groupRef} onPointerDown={handlePointerDown}>
        <mesh>
          <sphereGeometry args={[2.7, 64, 64]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.35} metalness={0} />
        </mesh>
        {bubblePositions.map((pos, i) => (
          <Bubble
            key={i}
            index={i}
            position={pos}
            texture={texture}
            popped={poppedIndices.has(i)}
            onToggle={() => onTogglePop(i)}
            dragMoved={dragMoved}
          />
        ))}
      </group>
    </>
  );
}

// A puffy cloud built from a handful of overlapping circles — cheap, no
// image assets, reads fine at the small sizes it's used at here.
function Cloud({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute aspect-[2/1] rounded-full bg-white ${className}`}>
      <div className="absolute -top-[35%] left-[12%] aspect-square w-[55%] rounded-full bg-white" />
      <div className="absolute -top-[48%] left-[42%] aspect-square w-[65%] rounded-full bg-white" />
      <div className="absolute -top-[22%] right-[6%] aspect-square w-[45%] rounded-full bg-white" />
    </div>
  );
}

function SkyBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-sky-50" />
      <Cloud className="left-[6%] top-[10%] w-28 opacity-90" />
      <Cloud className="right-[10%] top-[18%] w-20 opacity-80" />
      <Cloud className="left-[38%] top-[6%] w-24 opacity-70" />
      <Cloud className="right-[22%] top-[58%] w-16 opacity-60" />
      <Cloud className="left-[15%] top-[65%] w-20 opacity-70" />
    </div>
  );
}

export default function PopItGame({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMaximized, toggleMaximize } = useGameFullscreen();
  const bubblePositions = useBubblePositions(2.7);
  const [poppedIndices, setPoppedIndices] = useState<Set<number>>(new Set());

  const allPopped =
    bubblePositions.length > 0 &&
    poppedIndices.size === bubblePositions.length;

  const togglePop = (index: number) => {
    if (!poppedIndices.has(index)) playPopSound();
    setPoppedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${
        isMaximized ? "!fixed !inset-0 !z-[100] !rounded-none" : ""
      } ${className}`}
      onPointerDown={unlockAudio}
    >
      <SkyBackground />
      {/* alpha:true + no scene background so the sky/clouds behind show
          through wherever the 3D scene doesn't cover. */}
      <Canvas
        key={isMaximized ? "fullscreen" : "normal"}
        camera={{ position: [0, 1.5, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PopItScene
          bubblePositions={bubblePositions}
          poppedIndices={poppedIndices}
          onTogglePop={togglePop}
        />
      </Canvas>
      <FullscreenButton isMaximized={isMaximized} onToggle={toggleMaximize} />
      {allPopped && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPoppedIndices(new Set())}
            className="btn btn-primary pointer-events-auto shadow-lg"
          >
            Reset bubbles
          </button>
        </div>
      )}
    </div>
  );
}
