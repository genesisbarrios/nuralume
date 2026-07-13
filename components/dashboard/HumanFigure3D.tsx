"use client";

import { PerspectiveCamera, Text, View } from "@react-three/drei";
import { Bouncing } from "./BouncingOrb";
import type { Center } from "@/libs/humanDesign";

// Approximate bodygraph center positions mapped onto a simple humanoid
// figure (front view). Not anatomically exact — close enough at icon scale
// to read as "head down to root" the same order the bodygraph uses.
const CENTER_POSITION: Record<Center, [number, number, number]> = {
  Head: [0, 1.6, 0.15],
  Ajna: [0, 1.44, 0.25],
  Throat: [0, 1.28, 0.2],
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
      {/* Neck — short, vertical (default cylinder axis is already Y, no
          rotation applied), bridging head and torso directly. No separate
          shoulder bar — that horizontal element was reading as a second,
          horizontal "neck", so shoulder width now comes from the torso's
          own rounded top plus the arm attachment points instead. */}
      <mesh position={[0, 1.33, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.08, 12]} />
        <meshStandardMaterial color="#D9C7B8" roughness={0.6} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.66, 0]}>
        <capsuleGeometry args={[0.29, 0.7, 4, 12]} />
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

function CenterDots({
  defined,
  onHover,
}: {
  defined: Set<Center>;
  onHover: (center: Center | null) => void;
}) {
  const enter = (center: Center) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onHover(center);
    document.body.style.cursor = "pointer";
  };
  const leave = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onHover(null);
    document.body.style.cursor = "auto";
  };

  return (
    <>
      {ALL_CENTERS.map((center) => {
        const isDefined = defined.has(center);
        const color = isDefined ? CENTER_COLOR[center] : "#9CA3AF";
        const side = LABEL_SIDE[center];
        const [x, y, z] = CENTER_POSITION[center];

        return (
          <group key={center}>
            <mesh
              position={[x, y, z]}
              onPointerOver={enter(center)}
              onPointerOut={leave}
            >
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
            {/* Real 3D text instead of drei's <Html> — Html projects DOM
                overlays using the full shared canvas' bounding rect, not
                this icon's tracked <View> sub-region, so labels landed in
                the wrong place (top-right of the whole page). Text renders
                as actual scene geometry, so View's viewport/scissor handles
                it correctly like any other mesh — including hover/raycasting. */}
            <Text
              position={[x + side * 0.42, y, z]}
              fontSize={0.11}
              color={isDefined ? color : "#9CA3AF"}
              anchorX={side === 1 ? "left" : "right"}
              anchorY="middle"
              onPointerOver={enter(center)}
              onPointerOut={leave}
            >
              {CENTER_LABEL[center]}
            </Text>
          </group>
        );
      })}
    </>
  );
}

export default function HumanFigure3D({
  definedCenters,
  onHoverCenter,
  className = "",
}: {
  definedCenters: Center[];
  onHoverCenter?: (center: Center | null) => void;
  className?: string;
}) {
  const defined = new Set(definedCenters);

  return (
    // Note: no pointer-events-none here (unlike the small decorative
    // icons) — the labels need real hover, and View's hit-testing only
    // fires for events whose DOM target is this tracked element.
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
        <CenterDots defined={defined} onHover={(c) => onHoverCenter?.(c)} />
      </Bouncing>
    </View>
  );
}
