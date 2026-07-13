"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

export default function FloatingCrystal({
  color = "#3B82F6",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div className={`h-44 w-44 ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={60} color={color} />
        <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5}>
          <mesh>
            <icosahedronGeometry args={[1.3, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.35}
              roughness={0.2}
              metalness={0.3}
              transparent
              opacity={0.9}
            />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}
