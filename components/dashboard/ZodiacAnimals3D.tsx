"use client";

import { PerspectiveCamera, View } from "@react-three/drei";
import { Bouncing } from "./BouncingOrb";
import type { ZodiacSign } from "@/libs/zodiac";

// A small stylized "animal" per sign, built from primitive geometry (no
// external model assets). Color comes from the sign's classical element —
// fire/earth/air/water — so the 12 read as a coherent family rather than 12
// arbitrary hues. A few signs aren't literally animals (Gemini, Virgo,
// Libra, Aquarius) — those get an animal-adjacent stand-in (twins, dove,
// butterfly, dolphin) so all 12 icons stay visually consistent as creatures.
const SIGN_COLOR: Record<ZodiacSign, string> = {
  Aries: "#F87171",
  Leo: "#FB923C",
  Sagittarius: "#FBBF24",
  Taurus: "#84CC16",
  Virgo: "#65A30D",
  Capricorn: "#B45309",
  Gemini: "#FDE047",
  Libra: "#7DD3FC",
  Aquarius: "#38BDF8",
  Cancer: "#22D3EE",
  Scorpio: "#0EA5E9",
  Pisces: "#2DD4BF",
};

function mat(color: string, opacity = 1) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.35}
      roughness={0.45}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
}

function AriesBody({ color }: { color: string }) {
  // Ram: body + two curled horns
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.28, 0.32, 0]} rotation={[0, 0, 0.6]}>
        <torusGeometry args={[0.18, 0.05, 8, 16, Math.PI * 1.4]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.28, 0.32, 0]} rotation={[0, Math.PI, -0.6]}>
        <torusGeometry args={[0.18, 0.05, 8, 16, Math.PI * 1.4]} />
        {mat(color)}
      </mesh>
    </group>
  );
}

function TaurusBody({ color }: { color: string }) {
  // Bull: wide body + two horns + ears
  return (
    <group>
      <mesh scale={[1.25, 1, 1]}>
        <sphereGeometry args={[0.48, 24, 24]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.3, 0.3, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.09, 0.32, 12]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.09, 0.32, 12]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.45, 0, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.45, 0, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        {mat(color)}
      </mesh>
    </group>
  );
}

function GeminiBody({ color }: { color: string }) {
  // Twins: two identical small figures side by side
  const twin = (x: number) => (
    <group position={[x, 0, 0]}>
      <mesh>
        <capsuleGeometry args={[0.16, 0.32, 4, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        {mat(color)}
      </mesh>
    </group>
  );
  return (
    <group>
      {twin(-0.24)}
      {twin(0.24)}
    </group>
  );
}

function CancerBody({ color }: { color: string }) {
  // Crab: flattened body + two claws on stalks
  return (
    <group>
      <mesh scale={[1, 0.55, 0.85]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.5, 0.12, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.28, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.5, 0.12, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.28, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.63, 0.28, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.63, 0.28, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        {mat(color)}
      </mesh>
    </group>
  );
}

function LeoBody({ color }: { color: string }) {
  // Lion: head + mane ring of small spheres + tail
  const mane = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return (
      <mesh
        key={i}
        position={[Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, -0.05]}
      >
        <sphereGeometry args={[0.16, 10, 10]} />
        {mat(color, 0.85)}
      </mesh>
    );
  });
  return (
    <group>
      {mane}
      <mesh>
        <sphereGeometry args={[0.34, 20, 20]} />
        {mat(color)}
      </mesh>
      <mesh position={[0, -0.1, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.4, 8]} />
        {mat(color)}
      </mesh>
    </group>
  );
}

function VirgoBody({ color }: { color: string }) {
  // Dove stand-in: body + beak + two wings
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.4, 20, 20]} />
        {mat(color)}
      </mesh>
      <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.2, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.35, 0.05, -0.1]} rotation={[0, 0, 0.5]} scale={[0.6, 1, 0.3]}>
        <sphereGeometry args={[0.32, 12, 12]} />
        {mat(color, 0.85)}
      </mesh>
      <mesh position={[0.35, 0.05, -0.1]} rotation={[0, 0, -0.5]} scale={[0.6, 1, 0.3]}>
        <sphereGeometry args={[0.32, 12, 12]} />
        {mat(color, 0.85)}
      </mesh>
    </group>
  );
}

function LibraBody({ color }: { color: string }) {
  // Butterfly stand-in: thin body + two wing pairs
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.28, 0.12, 0]} scale={[0.7, 1, 0.2]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        {mat(color, 0.85)}
      </mesh>
      <mesh position={[0.28, 0.12, 0]} scale={[0.7, 1, 0.2]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        {mat(color, 0.85)}
      </mesh>
      <mesh position={[-0.2, -0.18, 0]} scale={[0.5, 0.7, 0.2]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        {mat(color, 0.7)}
      </mesh>
      <mesh position={[0.2, -0.18, 0]} scale={[0.5, 0.7, 0.2]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        {mat(color, 0.7)}
      </mesh>
    </group>
  );
}

function ScorpioBody({ color }: { color: string }) {
  // Scorpion: body + curled tail with stinger + two claws
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.22, 0.3, 4, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.3, 0.25, 0]} rotation={[0, 0, -0.9]}>
        <torusGeometry args={[0.22, 0.05, 8, 16, Math.PI * 1.1]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.28, 0.5, 0]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.42, 0.08, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.42, -0.08, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        {mat(color)}
      </mesh>
    </group>
  );
}

function SagittariusBody({ color }: { color: string }) {
  // Centaur/horse stand-in: horizontal body + legs + head + tail
  const leg = (x: number, z: number) => (
    <mesh position={[x, -0.32, z]}>
      <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
      {mat(color)}
    </mesh>
  );
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.22, 0.4, 4, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.35, 0.18, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        {mat(color)}
      </mesh>
      {leg(-0.28, 0.15)}
      {leg(-0.28, -0.15)}
      {leg(0.15, 0.15)}
      {leg(0.15, -0.15)}
      <mesh position={[-0.42, 0.1, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.03, 0.01, 0.22, 8]} />
        {mat(color)}
      </mesh>
    </group>
  );
}

function CapricornBody({ color }: { color: string }) {
  // Sea-goat: goat head/body + horns + fish-tail fin
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.38, 20, 20]} />
        {mat(color)}
      </mesh>
      <mesh position={[-0.2, 0.32, 0]} rotation={[0, 0, 1.0]}>
        <coneGeometry args={[0.07, 0.28, 10]} />
        {mat(color)}
      </mesh>
      <mesh position={[0.2, 0.32, 0]} rotation={[0, 0, 2.1]}>
        <coneGeometry args={[0.07, 0.28, 10]} />
        {mat(color)}
      </mesh>
      <mesh position={[0, -0.15, -0.4]} rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[0.28, 0.22, 3]} />
        {mat(color, 0.85)}
      </mesh>
    </group>
  );
}

function AquariusBody({ color }: { color: string }) {
  // Dolphin/wave stand-in: arched body + fin + tail
  return (
    <group rotation={[0, 0, 0.25]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.16, 0.55, 4, 8]} />
        {mat(color)}
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <coneGeometry args={[0.08, 0.18, 8]} />
        {mat(color, 0.85)}
      </mesh>
      <mesh position={[0.4, -0.05, 0]} rotation={[0, 0, -0.5]} scale={[0.6, 1, 0.4]}>
        <coneGeometry args={[0.14, 0.22, 3]} />
        {mat(color, 0.85)}
      </mesh>
    </group>
  );
}

function PiscesBody({ color }: { color: string }) {
  // Twin fish, mirrored
  const fish = (x: number, flip: number) => (
    <group position={[x, 0, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.16, 0.42, 10]} />
        {mat(color)}
      </mesh>
      <mesh position={[flip * 0.24, 0, 0]} scale={[0.5, 1, 0.3]}>
        <coneGeometry args={[0.14, 0.2, 3]} />
        {mat(color, 0.8)}
      </mesh>
    </group>
  );
  return (
    <group>
      {fish(-0.2, -1)}
      {fish(0.2, 1)}
    </group>
  );
}

const SIGN_BODY: Record<ZodiacSign, (props: { color: string }) => JSX.Element> = {
  Aries: AriesBody,
  Taurus: TaurusBody,
  Gemini: GeminiBody,
  Cancer: CancerBody,
  Leo: LeoBody,
  Virgo: VirgoBody,
  Libra: LibraBody,
  Scorpio: ScorpioBody,
  Sagittarius: SagittariusBody,
  Capricorn: CapricornBody,
  Aquarius: AquariusBody,
  Pisces: PiscesBody,
};

const SIGN_PHASE: Record<ZodiacSign, number> = {
  Aries: 0,
  Taurus: 0.5,
  Gemini: 1,
  Cancer: 1.5,
  Leo: 2,
  Virgo: 2.5,
  Libra: 3,
  Scorpio: 3.5,
  Sagittarius: 4,
  Capricorn: 4.5,
  Aquarius: 5,
  Pisces: 5.5,
};

export function ZodiacAnimalIcon({
  sign,
  className = "",
}: {
  sign: ZodiacSign;
  className?: string;
}) {
  const color = SIGN_COLOR[sign];
  const Body = SIGN_BODY[sign];

  return (
    <View className={`h-14 w-14 ${className}`}>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={40} />
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 3]} intensity={35} color={color} />
      <Bouncing
        phase={SIGN_PHASE[sign]}
        bounceHeight={0.2}
        restY={-0.15}
        shadowRadius={0.4}
        speed={1.4}
      >
        <Body color={color} />
      </Bouncing>
    </View>
  );
}
