"use client";

import { Canvas } from "@react-three/fiber";
import { Bouncing } from "./BouncingOrb";
import { MAJOR_ASPECTS, type MajorAspectType } from "@/libs/aspectMeta";

// ── Houses ──────────────────────────────────────────────────────────────
// Angular houses (1,4,7,10) are the strongest/foundational — faceted
// icosahedron. Succedent (2,5,8,11) build on them — smooth sphere. Cadent
// (3,6,9,12) are transitional — octahedron. Each house also gets its own
// hue from an even 12-step wheel so all twelve read as visually distinct.
type HouseClass = "angular" | "succedent" | "cadent";

const HOUSE_CLASS: Record<number, HouseClass> = {
  1: "angular",
  4: "angular",
  7: "angular",
  10: "angular",
  2: "succedent",
  5: "succedent",
  8: "succedent",
  11: "succedent",
  3: "cadent",
  6: "cadent",
  9: "cadent",
  12: "cadent",
};

function houseColor(house: number): string {
  const hue = ((house - 1) * 30) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

export function HouseIcon({
  house,
  className = "",
}: {
  house: number;
  className?: string;
}) {
  const houseClass = HOUSE_CLASS[house];
  const color = houseColor(house);

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
          phase={house * 0.6}
          bounceHeight={0.22}
          restY={-0.15}
          shadowRadius={0.35}
          speed={1.4}
        >
          {houseClass === "angular" && (
            <mesh>
              <icosahedronGeometry args={[0.55, 0]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
          )}
          {houseClass === "succedent" && (
            <mesh>
              <sphereGeometry args={[0.55, 24, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.35}
                roughness={0.5}
              />
            </mesh>
          )}
          {houseClass === "cadent" && (
            <mesh>
              <octahedronGeometry args={[0.6, 0]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.35}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
          )}
        </Bouncing>
      </Canvas>
    </div>
  );
}

// ── Major aspects ───────────────────────────────────────────────────────
// Geometry chosen to echo each aspect's traditional meaning: conjunction as
// two merging spheres, sextile as a hexagonal prism (60°), square as a box
// (90°), trine as a triangular cone (120°), opposition as a dumbbell (180°).
const ASPECT_COLOR: Record<MajorAspectType, string> = {
  conjunction: "#A78BFA",
  sextile: "#34D399",
  trine: "#22D3EE",
  square: "#F87171",
  opposition: "#FB923C",
};

function AspectBody({
  type,
  color,
}: {
  type: MajorAspectType;
  color: string;
}) {
  const material = (opacity = 1) => (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.35}
      roughness={0.4}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );

  switch (type) {
    case "conjunction":
      return (
        <group>
          <mesh position={[-0.16, 0, 0]}>
            <sphereGeometry args={[0.42, 24, 24]} />
            {material(0.85)}
          </mesh>
          <mesh position={[0.16, 0, 0]}>
            <sphereGeometry args={[0.42, 24, 24]} />
            {material(0.85)}
          </mesh>
        </group>
      );
    case "sextile":
      return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.35, 6]} />
          {material()}
        </mesh>
      );
    case "square":
      return (
        <mesh rotation={[0.4, 0.4, 0]}>
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          {material()}
        </mesh>
      );
    case "trine":
      return (
        <mesh>
          <coneGeometry args={[0.62, 0.62, 3]} />
          {material()}
        </mesh>
      );
    case "opposition":
      return (
        <group>
          <mesh position={[-0.48, 0, 0]}>
            <sphereGeometry args={[0.3, 20, 20]} />
            {material()}
          </mesh>
          <mesh position={[0.48, 0, 0]}>
            <sphereGeometry args={[0.3, 20, 20]} />
            {material()}
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.96, 8]} />
            {material(0.7)}
          </mesh>
        </group>
      );
  }
}

export function AspectIcon({
  type,
  className = "",
}: {
  type: MajorAspectType;
  className?: string;
}) {
  const color = ASPECT_COLOR[type];

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
          phase={MAJOR_ASPECTS.indexOf(type) * 1.3}
          bounceHeight={0.2}
          restY={-0.15}
          shadowRadius={0.4}
          speed={1.4}
        >
          <AspectBody type={type} color={color} />
        </Bouncing>
      </Canvas>
    </div>
  );
}
