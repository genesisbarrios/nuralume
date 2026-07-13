"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { Bouncing } from "./BouncingOrb";

export type CelestialVariant = "sun" | "moon" | "rising";

const VARIANT_COLOR: Record<CelestialVariant, string> = {
  sun: "#FDB813",
  moon: "#C7D2E0",
  rising: "#FB7185",
};

// Stagger each orb's bounce so a row of them doesn't move in lockstep.
const VARIANT_PHASE: Record<CelestialVariant, number> = {
  sun: 0,
  moon: 2.1,
  rising: 4.2,
};

// Sun's corona/sparkles and the rising planet's rings extend well past the
// sphere itself — a narrow (portrait) container narrows the camera's
// horizontal field of view and clips them, so those two get a wider box.
const VARIANT_WIDTH: Record<CelestialVariant, string> = {
  sun: "w-24",
  moon: "w-20",
  rising: "w-24",
};

// Fixed placements (not random per render) so the moon's craters don't
// reshuffle on every re-render.
const CRATERS = [
  { theta: 0.6, phi: 1.1, size: 0.18 },
  { theta: 2.3, phi: 0.8, size: 0.13 },
  { theta: 4.1, phi: 1.6, size: 0.21 },
  { theta: 5.2, phi: 2.0, size: 0.11 },
  { theta: 1.8, phi: 2.3, size: 0.15 },
  { theta: 3.3, phi: 1.15, size: 0.09 },
  { theta: 0.2, phi: 1.9, size: 0.12 },
  { theta: 5.9, phi: 1.35, size: 0.16 },
];

function MoonBody({ radius, color }: { radius: number; color: string }) {
  const craters = useMemo(
    () =>
      CRATERS.map(({ theta, phi, size }) => ({
        position: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        ).multiplyScalar(radius * 0.9),
        size,
      })),
    [radius]
  );

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.08}
          roughness={0.95}
          metalness={0}
          distort={0.08}
          speed={0.6}
        />
      </mesh>
      {craters.map((crater, i) => (
        <mesh key={i} position={crater.position}>
          <sphereGeometry args={[crater.size, 16, 16]} />
          <meshStandardMaterial color="#6B7280" roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

function SunBody({ radius, color }: { radius: number; color: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.85}
          roughness={0.4}
          distort={0.35}
          speed={2.2}
        />
      </mesh>
      <mesh scale={1.35}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <Sparkles
        count={14}
        scale={2.1}
        size={2.5}
        speed={0.4}
        color={color}
        opacity={0.7}
      />
    </group>
  );
}

function RisingBody({
  sphereRadius,
  color,
}: {
  sphereRadius: number;
  color: string;
}) {
  return (
    <group rotation={[0.55, 0, 0.15]}>
      <mesh>
        <sphereGeometry args={[sphereRadius, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[sphereRadius * 1.45, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#FDBA74"
          emissive="#FDBA74"
          emissiveIntensity={0.35}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[sphereRadius * 1.7, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#FB923C"
          emissive="#FB923C"
          emissiveIntensity={0.3}
          roughness={0.4}
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  );
}

export default function CelestialOrb({
  variant,
  className = "",
}: {
  variant: CelestialVariant;
  className?: string;
}) {
  const color = VARIANT_COLOR[variant];

  return (
    <div className={`h-28 ${VARIANT_WIDTH[variant]} ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight
          position={[2, 2, 3]}
          intensity={variant === "sun" ? 90 : 45}
          color={color}
        />
        <pointLight position={[-2, -1, 2]} intensity={12} color="#ffffff" />
        <Bouncing phase={VARIANT_PHASE[variant]}>
          {variant === "sun" && <SunBody radius={0.85} color={color} />}
          {variant === "moon" && <MoonBody radius={0.85} color={color} />}
          {variant === "rising" && (
            <RisingBody sphereRadius={0.65} color={color} />
          )}
        </Bouncing>
      </Canvas>
    </div>
  );
}
