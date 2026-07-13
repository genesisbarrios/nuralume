"use client";

import { Html, PerspectiveCamera, View } from "@react-three/drei";
import { Bouncing } from "./BouncingOrb";
import type { Center } from "@/libs/humanDesign";

// Approximate bodygraph center positions mapped onto a simple humanoid
// figure (front view). Not anatomically exact — close enough at icon scale
// to read as "head down to root" the same order the bodygraph uses.
const CENTER_POSITION: Record<Center, [number, number, number]> = {
  Head: [0, 1.6, 0.15],
  Ajna: [0, 1.42, 0.28],
  Throat: [0, 1.28, 0.22],
  G: [0, 0.7, 0.24],
  Heart: [0.34, 0.62, 0.2],
  Spleen: [-0.38, 0.32, 0.16],
  SolarPlexus: [0.38, 0.32, 0.16],
  Sacral: [0, 0.1, 0.22],
  Root: [0, -0.18, 0.15],
};

const CENTER_COLOR: Record<Center, string> = {
  Head: "#FDE68A",
  Ajna: "#93C5FD",
  Throat: "#7DD3FC",
  G: "#FDBA74",
  Heart: "#F87171",
  Spleen: "#86EFAC",
  SolarPlexus: "#C4B5FD",
  Sacral: "#F9A8D4",
  Root: "#B45309",
};

const CENTER_LABEL: Record<Center, string> = {
  Head: "Head",
  Ajna: "Ajna",
  Throat: "Throat",
  G: "G",
  Heart: "Heart",
  Spleen: "Spleen",
  SolarPlexus: "Solar Plexus",
  Sacral: "Sacral",
  Root: "Root",
};

// Which side of the dot each label sits on, so labels on the centerline
// don't collide with the ones offset to the left/right.
const LABEL_SIDE: Record<Center, 1 | -1> = {
  Head: 1,
  Ajna: 1,
  Throat: 1,
  G: 1,
  Heart: 1,
  Spleen: -1,
  SolarPlexus: 1,
  Sacral: 1,
  Root: 1,
};

const ALL_CENTERS = Object.keys(CENTER_POSITION) as Center[];

function FigureBody() {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color="#E8D5C4" roughness={0.6} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.22, 12]} />
        <meshStandardMaterial color="#D9C7B8" roughness={0.6} />
      </mesh>
      {/* Shoulders */}
      <mesh position={[0, 1.26, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.13, 0.62, 4, 12]} />
        <meshStandardMaterial color="#D9C7B8" roughness={0.6} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.68, 0]}>
        <capsuleGeometry args={[0.26, 0.75, 4, 12]} />
        <meshStandardMaterial color="#D9C7B8" roughness={0.6} />
      </mesh>
      {/* Pelvis / root */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.24, 0.2, 4, 12]} />
        <meshStandardMaterial color="#D9C7B8" roughness={0.6} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.58, 0.6, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.09, 0.85, 4, 8]} />
        <meshStandardMaterial color="#D9C7B8" roughness={0.6} />
      </mesh>
      <mesh position={[0.58, 0.6, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.09, 0.85, 4, 8]} />
        <meshStandardMaterial color="#D9C7B8" roughness={0.6} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.16, -0.55, 0]}>
        <capsuleGeometry args={[0.11, 0.85, 4, 8]} />
        <meshStandardMaterial color="#C9B7A8" roughness={0.6} />
      </mesh>
      <mesh position={[0.16, -0.55, 0]}>
        <capsuleGeometry args={[0.11, 0.85, 4, 8]} />
        <meshStandardMaterial color="#C9B7A8" roughness={0.6} />
      </mesh>
    </group>
  );
}

function CenterDots({ defined }: { defined: Set<Center> }) {
  return (
    <>
      {ALL_CENTERS.map((center) => {
        const isDefined = defined.has(center);
        const color = isDefined ? CENTER_COLOR[center] : "#9CA3AF";
        const side = LABEL_SIDE[center];
        const [x, y, z] = CENTER_POSITION[center];

        return (
          <group key={center}>
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[isDefined ? 0.11 : 0.08, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isDefined ? 0.7 : 0.05}
                roughness={0.4}
                transparent
                opacity={isDefined ? 1 : 0.4}
              />
            </mesh>
            <Html position={[x + side * 0.4, y, z]} center>
              <span
                className={`whitespace-nowrap rounded bg-base-100/80 px-1 text-[9px] font-semibold ${
                  isDefined ? "text-primary" : "text-base-content/40"
                }`}
                style={{ pointerEvents: "none" }}
              >
                {CENTER_LABEL[center]}
              </span>
            </Html>
          </group>
        );
      })}
    </>
  );
}

export default function HumanFigure3D({
  definedCenters,
  className = "",
}: {
  definedCenters: Center[];
  className?: string;
}) {
  const defined = new Set(definedCenters);

  return (
    <View className={`h-72 w-full ${className}`}>
      <PerspectiveCamera makeDefault position={[0, 0.6, 4.6]} fov={35} />
      <ambientLight intensity={0.7} />
      <pointLight position={[2, 3, 3]} intensity={40} color="#ffffff" />
      <pointLight position={[-2, -1, 2]} intensity={15} color="#ffffff" />
      <Bouncing
        phase={0}
        bounceHeight={0.15}
        restY={-0.35}
        shadowRadius={0.55}
        speed={1.2}
        spin={false}
      >
        <FigureBody />
        <CenterDots defined={defined} />
      </Bouncing>
    </View>
  );
}
