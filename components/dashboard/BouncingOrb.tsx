"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, MeshBasicMaterial } from "three";

// Shared bounce-and-shadow physics for every small 3D icon in the astrology
// tab (sun/moon/rising, houses, aspects) so the animation feel stays
// consistent without re-deriving it per icon set.
export function Bouncing({
  phase,
  children,
  bounceHeight = 0.5,
  restY = -0.35,
  shadowRadius = 0.65,
  speed = 1.6,
  spin = true,
  bounce: bounceEnabled = true,
}: {
  phase: number;
  children: React.ReactNode;
  bounceHeight?: number;
  restY?: number;
  shadowRadius?: number;
  speed?: number;
  spin?: boolean;
  bounce?: boolean;
}) {
  const bodyRef = useRef<Group>(null);
  const shadowRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    // A moving target is hard to tap precisely (e.g. the Human Design
    // figure's center dots on mobile) — bounce=false holds everything at
    // its grounded resting pose instead of animating.
    const bounce = bounceEnabled
      ? Math.abs(Math.sin(clock.getElapsedTime() * speed + phase))
      : 0;

    if (bodyRef.current) {
      bodyRef.current.position.y = restY + bounce * bounceHeight;
      if (spin) bodyRef.current.rotation.y += 0.008;
    }
    if (shadowRef.current) {
      const squash = 1 - bounce * 0.55;
      shadowRef.current.scale.set(squash, squash, squash);
      const material = shadowRef.current.material as MeshBasicMaterial;
      material.opacity = 0.32 - bounce * 0.22;
    }
  });

  return (
    <>
      <group ref={bodyRef}>{children}</group>
      <mesh
        ref={shadowRef}
        position={[0, restY - 0.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[shadowRadius, 32]} />
        <meshBasicMaterial color="#000000" transparent depthWrite={false} />
      </mesh>
    </>
  );
}
