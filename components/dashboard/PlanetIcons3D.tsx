"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Bouncing } from "./BouncingOrb";

// A small stylized 3D model per planet, loosely styled after each body's
// real appearance (color, rings, banding, cratering) rather than an
// arbitrary color swap — same primitive-geometry approach as the sun/moon
// icons, just applied per outer planet.
export type PlanetName =
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto"
  | "Chiron";

const PLANET_COLOR: Record<PlanetName, string> = {
  Mercury: "#A8A296",
  Venus: "#E8D2A0",
  Mars: "#C1440E",
  Jupiter: "#D9A066",
  Saturn: "#E3C16F",
  Uranus: "#A6E3E0",
  Neptune: "#3B5BA5",
  Pluto: "#B8A88F",
  Chiron: "#8B8378",
};

const PLANET_PHASE: Record<PlanetName, number> = {
  Mercury: 0,
  Venus: 0.7,
  Mars: 1.4,
  Jupiter: 2.1,
  Saturn: 2.8,
  Uranus: 3.5,
  Neptune: 4.2,
  Pluto: 4.9,
  Chiron: 5.6,
};

function mat(color: string, opacity = 1, extra: Record<string, unknown> = {}) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.3}
      roughness={0.5}
      transparent={opacity < 1}
      opacity={opacity}
      {...extra}
    />
  );
}

// Small dark craters, same technique as the Moon in CelestialOrb.tsx.
function useCraters(radius: number, count: number, seed: number) {
  return useMemo(() => {
    const craters = [];
    for (let i = 0; i < count; i++) {
      const theta = (seed + i * 2.4) % (Math.PI * 2);
      const phi = ((seed * 1.7 + i * 1.9) % Math.PI) + 0.3;
      const size = 0.08 + ((seed + i) % 3) * 0.04;
      craters.push({
        position: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        ).multiplyScalar(radius * 0.92),
        size,
      });
    }
    return craters;
  }, [radius, count, seed]);
}

function RockyBody({
  radius,
  color,
  craterCount,
  seed,
}: {
  radius: number;
  color: string;
  craterCount: number;
  seed: number;
}) {
  const craters = useCraters(radius, craterCount, seed);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        {mat(color, 1, { roughness: 0.85 })}
      </mesh>
      {craters.map((c, i) => (
        <mesh key={i} position={c.position}>
          <sphereGeometry args={[c.size, 10, 10]} />
          {mat("#6B6259", 1, { roughness: 1 })}
        </mesh>
      ))}
    </group>
  );
}

function MercuryBody({ color }: { color: string }) {
  return <RockyBody radius={0.7} color={color} craterCount={6} seed={1} />;
}

function VenusBody({ color }: { color: string }) {
  // Thick hazy atmosphere — soft glow shell, no surface detail visible.
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        {mat(color, 1, { roughness: 0.3 })}
      </mesh>
      <mesh scale={1.2}>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function MarsBody({ color }: { color: string }) {
  return <RockyBody radius={0.72} color={color} craterCount={3} seed={7} />;
}

function BandedBody({
  radius,
  color,
  bandColor,
}: {
  radius: number;
  color: string;
  bandColor: string;
}) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        {mat(color)}
      </mesh>
      {[0.28, -0.05, -0.32].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry
            args={[Math.sqrt(Math.max(radius * radius - y * y, 0.01)), 0.045, 8, 32]}
          />
          {mat(bandColor, 0.6)}
        </mesh>
      ))}
      <mesh position={[radius * 0.5, -0.15, radius * 0.55]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        {mat("#B5432A")}
      </mesh>
    </group>
  );
}

function JupiterBody({ color }: { color: string }) {
  return <BandedBody radius={0.85} color={color} bandColor="#B9793F" />;
}

function RingedBody({
  radius,
  color,
  ringColor,
  tilt,
  opacity = 0.8,
}: {
  radius: number;
  color: string;
  ringColor: string;
  tilt: number;
  opacity?: number;
}) {
  return (
    <group rotation={[tilt, 0, 0.1]}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        {mat(color)}
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.5, 0.05, 8, 48]} />
        {mat(ringColor, opacity)}
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.75, 0.035, 8, 48]} />
        {mat(ringColor, opacity * 0.7)}
      </mesh>
    </group>
  );
}

function SaturnBody({ color }: { color: string }) {
  return (
    <RingedBody radius={0.68} color={color} ringColor="#F0DFA8" tilt={0.5} />
  );
}

function UranusBody({ color }: { color: string }) {
  // Uranus's rings are nearly perpendicular to its orbit — steep tilt, faint.
  return (
    <RingedBody
      radius={0.72}
      color={color}
      ringColor="#CFF3F0"
      tilt={1.3}
      opacity={0.4}
    />
  );
}

function NeptuneBody({ color }: { color: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.22, 0.1, 0.6]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        {mat("#1D3766")}
      </mesh>
    </group>
  );
}

function PlutoBody({ color }: { color: string }) {
  return (
    <group>
      <RockyBody radius={0.52} color={color} craterCount={2} seed={13} />
      {/* Simplified Tombaugh Regio: a pale heart-ish patch */}
      <mesh position={[0, -0.1, 0.48]} scale={[0.5, 0.4, 0.2]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        {mat("#EFE6D6", 0.9)}
      </mesh>
    </group>
  );
}

function ChironBody({ color }: { color: string }) {
  // Small icy/rocky centaur body — irregular low-poly shape, faint glow.
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.45, 0]} />
        {mat(color, 1, { roughness: 0.7, metalness: 0.1 })}
      </mesh>
      <mesh scale={1.3}>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshBasicMaterial
          color="#D9F5F0"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

const PLANET_BODY: Record<PlanetName, (props: { color: string }) => JSX.Element> = {
  Mercury: MercuryBody,
  Venus: VenusBody,
  Mars: MarsBody,
  Jupiter: JupiterBody,
  Saturn: SaturnBody,
  Uranus: UranusBody,
  Neptune: NeptuneBody,
  Pluto: PlutoBody,
  Chiron: ChironBody,
};

export function PlanetIcon({
  name,
  className = "",
}: {
  name: PlanetName;
  className?: string;
}) {
  const color = PLANET_COLOR[name];
  const Body = PLANET_BODY[name];

  return (
    <div className={`h-14 w-14 ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[2, 2, 3]} intensity={35} color={color} />
        <Bouncing
          phase={PLANET_PHASE[name]}
          bounceHeight={0.2}
          restY={-0.15}
          shadowRadius={0.4}
          speed={1.4}
        >
          <Body color={color} />
        </Bouncing>
      </Canvas>
    </div>
  );
}
