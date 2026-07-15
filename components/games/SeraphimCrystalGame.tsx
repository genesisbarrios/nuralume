"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { playThunderSound, playWooshSound, unlockAudio } from "./sounds";
import { submitSeraphimScore } from "@/app/dashboard/games/actions";
import FullscreenButton from "./FullscreenButton";
import { useGameFullscreen } from "./useGameFullscreen";

const SERAPHIM_MODEL_URL = "/models/seraphim/model.gltf";
const SERAPHIM_SCALE = 0.45;
const DEMON_MODEL_URL = "/models/demon/model.glb";
const DEMON_SCALE = 0.4;

useGLTF.preload(SERAPHIM_MODEL_URL);
useGLTF.preload(DEMON_MODEL_URL);

// The GLTF's own animated hierarchy (idle/fly/spawn/pose clips baked in by
// Blockbench) — this only drives the model's internal bones. The outer
// group in SeraphimScene owns world position/rotation for gameplay movement,
// so the two never fight over the same transforms.
function SeraphimAvatarModel({
  avatarRef,
}: {
  avatarRef: React.MutableRefObject<THREE.Group | null>;
}) {
  const { scene, animations } = useGLTF(SERAPHIM_MODEL_URL);
  const { actions } = useAnimations(animations, avatarRef);

  useEffect(() => {
    const flyAction = actions.fly ?? actions.idle;
    flyAction?.reset().fadeIn(0.3).play();
    return () => {
      flyAction?.fadeOut(0.3);
    };
  }, [actions]);

  return <primitive object={scene} />;
}

// Same pattern as SeraphimAvatarModel — the demon's own rig drives its
// flying-loop animation; DemonAvatar (below) owns its world position.
function DemonAvatarModel({
  demonRef,
}: {
  demonRef: React.MutableRefObject<THREE.Group | null>;
}) {
  const { scene, animations } = useGLTF(DEMON_MODEL_URL);
  const { actions } = useAnimations(animations, demonRef);

  useEffect(() => {
    const flyAction = actions.Fast_Flying ?? actions.Flying_Idle;
    flyAction?.reset().fadeIn(0.3).play();
    return () => {
      flyAction?.fadeOut(0.3);
    };
  }, [actions]);

  return <primitive object={scene} />;
}

// ============================================================================
// Crystal types
// ============================================================================
type CrystalType = 0 | 1 | 2 | 3;

const CRYSTAL_TYPES: CrystalType[] = [0, 1, 2, 3];

const CRYSTAL_COLOR: Record<CrystalType, string> = {
  0: "#9B59B6",
  1: "#2C3E50",
  2: "#5DADE2",
  3: "#F5F5F5",
};
const CRYSTAL_EMISSIVE: Record<CrystalType, string> = {
  0: "#B266D9",
  1: "#6E7DA8",
  2: "#7FC4F2",
  3: "#F5F5F5",
};
const CRYSTAL_LABEL: Record<CrystalType, string> = {
  0: "Amethyst",
  1: "Onyx",
  2: "Celestite",
  3: "Quartz",
};

interface CrystalData {
  id: number;
  type: CrystalType;
  position: THREE.Vector3;
  floatOffset: number;
  rotSpeed: number;
}

const MAX_CRYSTALS = 25;
const SPAWN_INTERVAL = 1.5;
const COLLECTION_RADIUS = 2;
const BOUNDS_X = 23;
const BOUNDS_Z = 18;
const PLAYER_SPEED = 18; // units/sec
const FRUSTUM_SIZE = 25;
const CAMERA_HEIGHT = 18;
const CAMERA_BACK_OFFSET = 12;
const DEMON_SPEED = 9; // units/sec — half the player's speed, so it's avoidable
const DEMON_COLLISION_RADIUS = 2.5;
const DEMON_RETARGET_DIST = 2;

let nextCrystalId = 0;
function randomCrystal(): CrystalData {
  return {
    id: nextCrystalId++,
    type: CRYSTAL_TYPES[Math.floor(Math.random() * 4)],
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 45,
      0,
      (Math.random() - 0.5) * 35
    ),
    floatOffset: Math.random() * Math.PI * 2,
    rotSpeed: 0.5 + Math.random() * 0.5,
  };
}

// Keeps the demon's wander target within the same area the player can
// actually reach, so it's always a plausible threat rather than drifting
// off into unreachable space.
function randomDemonPoint(): THREE.Vector3 {
  return new THREE.Vector3(
    (Math.random() - 0.5) * 2 * BOUNDS_X,
    0,
    (Math.random() - 0.5) * 2 * BOUNDS_Z
  );
}

// ============================================================================
// A single crystal — floats, spins, and fades+shrinks itself out once it
// appears in collectingRef (set by the scene's single per-frame collision
// pass), then reports back so the parent can drop it and tally the score.
// ============================================================================
function Crystal({
  data,
  collectingRef,
  onCollected,
}: {
  data: CrystalData;
  collectingRef: React.MutableRefObject<Set<number>>;
  onCollected: (id: number, type: CrystalType) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const collecting = useRef(false);
  const fade = useRef(1);
  const reported = useRef(false);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!collecting.current && collectingRef.current.has(data.id)) {
      collecting.current = true;
    }

    if (collecting.current) {
      fade.current = Math.max(0, fade.current - delta * 3);
      group.scale.setScalar(fade.current);
      if (materialRef.current) materialRef.current.opacity = fade.current;
      if (fade.current <= 0 && !reported.current) {
        reported.current = true;
        collectingRef.current.delete(data.id);
        onCollected(data.id, data.type);
      }
      return;
    }

    const t = clock.getElapsedTime();
    group.position.set(
      data.position.x,
      Math.sin(data.floatOffset + t * 0.8) * 1.5,
      data.position.z
    );
    group.rotation.x += 0.6 * data.rotSpeed * delta;
    group.rotation.y += 1.2 * data.rotSpeed * delta;
    group.rotation.z += 0.3 * data.rotSpeed * delta;
  });

  return (
    <group ref={groupRef} position={data.position}>
      <mesh>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          ref={materialRef}
          color={CRYSTAL_COLOR[data.type]}
          emissive={CRYSTAL_EMISSIVE[data.type]}
          emissiveIntensity={0.7}
          metalness={0.25}
          roughness={0.3}
          transparent
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// Scene: player movement, spawning, collision, camera follow
// ============================================================================
function SeraphimScene({
  onCollect,
  resetSignal,
  isGameOver,
  onGameOver,
}: {
  onCollect: (type: CrystalType) => void;
  resetSignal: number;
  isGameOver: boolean;
  onGameOver: () => void;
}) {
  const [crystals, setCrystals] = useState<CrystalData[]>(() =>
    Array.from({ length: MAX_CRYSTALS }, randomCrystal)
  );
  const crystalsRef = useRef(crystals);
  crystalsRef.current = crystals;

  const playerPos = useRef(new THREE.Vector3(0, 0, 0));
  const keysDown = useRef(new Set<string>());
  const spawnTimer = useRef(0);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const collectingRef = useRef(new Set<number>());
  const { size } = useThree();

  const demonPos = useRef(randomDemonPoint());
  const demonTarget = useRef(randomDemonPoint());
  const demonRef = useRef<THREE.Group | null>(null);
  // Guards against onGameOver firing more than once — the collision stays
  // true for a few frames while the isGameOver prop propagates back down.
  const gameOverFiredRef = useRef(false);

  // Touch/mouse virtual-joystick state — dragging anywhere on the play field
  // steers the seraphim in the direction of the drag, proportional to how
  // far from the drag's origin the pointer has moved (clamped to MAX_DRAG).
  const dragActive = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const dragCurrent = useRef({ x: 0, y: 0 });

  const avatarRef = useRef<THREE.Group | null>(null);

  // Stable (useCallback) ref setters that seed an initial position exactly
  // once on mount. A plain `position={...}` JSX prop gets re-applied by R3F
  // on every re-render of this component (every crystal spawn/collect,
  // since that's a new array literal each time) — which would snap both the
  // camera and the seraphim back to the origin each time, fighting with the
  // per-frame movement below. Setting it imperceptibly once via ref avoids
  // that fight entirely.
  const setCameraRef = useCallback((cam: THREE.OrthographicCamera | null) => {
    cameraRef.current = cam;
    if (cam) {
      cam.position.set(0, CAMERA_HEIGHT, CAMERA_BACK_OFFSET);
      cam.lookAt(0, 0, 0);
    }
  }, []);
  const setAvatarRef = useCallback((group: THREE.Group | null) => {
    avatarRef.current = group;
    if (group) group.position.set(0, 1, 0);
  }, []);
  const setDemonRef = useCallback((group: THREE.Group | null) => {
    demonRef.current = group;
    if (group) {
      group.position.set(demonPos.current.x, 1.8, demonPos.current.z);
    }
  }, []);

  // Clamped defensively — a transient 0-height read during the fullscreen
  // CSS transition (before the browser finishes laying out the new
  // fixed/inset-0 box) would otherwise produce a huge/degenerate aspect
  // ratio, stretching the frustum out so far that everything in the scene
  // shrinks to near-invisible, which reads as "flattened".
  const aspect =
    size.width > 0 && size.height > 0 ? size.width / size.height : 1;
  const clampedAspect = THREE.MathUtils.clamp(aspect, 0.3, 4);
  const frustum = useMemo(
    () => ({
      left: (-FRUSTUM_SIZE * clampedAspect) / 2,
      right: (FRUSTUM_SIZE * clampedAspect) / 2,
      top: FRUSTUM_SIZE / 2,
      bottom: -FRUSTUM_SIZE / 2,
    }),
    [clampedAspect]
  );

  const resetBoard = useCallback(() => {
    playerPos.current.set(0, 0, 0);
    collectingRef.current.clear();
    demonPos.current.copy(randomDemonPoint());
    demonTarget.current.copy(randomDemonPoint());
    gameOverFiredRef.current = false;
    setCrystals(Array.from({ length: MAX_CRYSTALS }, randomCrystal));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "r") {
        resetBoard();
        return;
      }
      keysDown.current.add(key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [resetBoard]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragActive.current) return;
      dragCurrent.current = { x: e.clientX, y: e.clientY };
    };
    const handleUp = () => {
      dragActive.current = false;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    dragActive.current = true;
    dragOrigin.current = { x: e.clientX, y: e.clientY };
    dragCurrent.current = { x: e.clientX, y: e.clientY };
  };

  // Parent's Reset button bumps resetSignal to trigger the same reset.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    resetBoard();
  }, [resetSignal, resetBoard]);

  const handleCollected = (id: number, type: CrystalType) => {
    setCrystals((prev) => prev.filter((c) => c.id !== id));
    onCollect(type);
  };

  useFrame((state, delta) => {
    // Freeze the whole scene the instant the demon catches you — player,
    // camera, demon, and crystals all hold exactly where they were.
    if (isGameOver) return;

    let dx = 0;
    let dz = 0;

    if (dragActive.current) {
      const ddx = dragCurrent.current.x - dragOrigin.current.x;
      const ddy = dragCurrent.current.y - dragOrigin.current.y;
      const dist = Math.hypot(ddx, ddy);
      const DEAD_ZONE = 6;
      const MAX_DRAG = 60;
      if (dist > DEAD_ZONE) {
        const magnitude = Math.min(dist, MAX_DRAG) / MAX_DRAG;
        dx = (ddx / dist) * magnitude;
        dz = (ddy / dist) * magnitude;
      }
    } else {
      const keys = keysDown.current;
      if (keys.has("w") || keys.has("arrowup")) dz = -1;
      if (keys.has("s") || keys.has("arrowdown")) dz = 1;
      if (keys.has("a") || keys.has("arrowleft")) dx = -1;
      if (keys.has("d") || keys.has("arrowright")) dx = 1;
      if (dx !== 0 && dz !== 0) {
        dx *= 0.707;
        dz *= 0.707;
      }
    }

    const player = playerPos.current;
    player.x = THREE.MathUtils.clamp(
      player.x + dx * PLAYER_SPEED * delta,
      -BOUNDS_X,
      BOUNDS_X
    );
    player.z = THREE.MathUtils.clamp(
      player.z + dz * PLAYER_SPEED * delta,
      -BOUNDS_Z,
      BOUNDS_Z
    );

    // Soft-follow camera — lerping (instead of snapping every frame) means
    // the seraphim visibly drifts within the frame as you steer, with the
    // camera gently catching up, rather than staying pixel-locked to it.
    // The camera is also tilted back (not a literal straight-down look) —
    // a camera pointed exactly along the Y axis is near-parallel to the
    // default up vector, which both makes lookAt's orientation unstable and
    // views the model's flat wing sheets edge-on (reads as "flattened").
    // Floating crystals also foreshorten to near-zero motion when viewed
    // straight down, so a tilt is needed for their bob to read at all.
    if (cameraRef.current) {
      const cam = cameraRef.current;
      cam.position.x = THREE.MathUtils.lerp(cam.position.x, player.x, 0.09);
      cam.position.z = THREE.MathUtils.lerp(
        cam.position.z,
        player.z + CAMERA_BACK_OFFSET,
        0.09
      );
      cam.position.y = CAMERA_HEIGHT;
      cam.lookAt(cam.position.x, 0, cam.position.z - CAMERA_BACK_OFFSET);
    }

    const t = state.clock.getElapsedTime();
    if (avatarRef.current) {
      avatarRef.current.position.set(
        player.x,
        1 + Math.sin(t * 2) * 0.15,
        player.z
      );
      if (dx !== 0 || dz !== 0) {
        const targetAngle = Math.atan2(dx, dz);
        let angleDelta = targetAngle - avatarRef.current.rotation.y;
        angleDelta = Math.atan2(Math.sin(angleDelta), Math.cos(angleDelta));
        avatarRef.current.rotation.y += angleDelta * 0.15;
      }
    }

    spawnTimer.current += delta;
    if (spawnTimer.current > SPAWN_INTERVAL) {
      spawnTimer.current = 0;
      setCrystals((prev) =>
        prev.length < MAX_CRYSTALS ? [...prev, randomCrystal()] : prev
      );
    }

    for (const c of crystalsRef.current) {
      if (collectingRef.current.has(c.id)) continue;
      const dxp = c.position.x - player.x;
      const dzp = c.position.z - player.z;
      if (Math.sqrt(dxp * dxp + dzp * dzp) < COLLECTION_RADIUS) {
        collectingRef.current.add(c.id);
      }
    }

    // Demon wander AI — steers toward a random point until it arrives, then
    // picks a new one, so it roams the play field rather than following any
    // fixed path.
    const demon = demonPos.current;
    const toTarget = new THREE.Vector3().subVectors(demonTarget.current, demon);
    const distToTarget = toTarget.length();
    if (distToTarget < DEMON_RETARGET_DIST) {
      demonTarget.current.copy(randomDemonPoint());
    } else {
      toTarget.normalize();
      demon.addScaledVector(toTarget, DEMON_SPEED * delta);
    }
    if (demonRef.current) {
      demonRef.current.position.set(
        demon.x,
        1.8 + Math.sin(t * 1.5) * 0.2,
        demon.z
      );
      if (distToTarget >= DEMON_RETARGET_DIST) {
        const angle = Math.atan2(toTarget.x, toTarget.z);
        let angleDelta = angle - demonRef.current.rotation.y;
        angleDelta = Math.atan2(Math.sin(angleDelta), Math.cos(angleDelta));
        demonRef.current.rotation.y += angleDelta * 0.1;
      }
    }

    // Demon vs. player collision — both vanish and the run ends.
    const ddx = demon.x - player.x;
    const ddz = demon.z - player.z;
    if (
      !gameOverFiredRef.current &&
      Math.sqrt(ddx * ddx + ddz * ddz) < DEMON_COLLISION_RADIUS
    ) {
      gameOverFiredRef.current = true;
      onGameOver();
    }
  });

  return (
    <>
      <OrthographicCamera
        ref={setCameraRef}
        makeDefault
        near={0.1}
        far={100}
        left={frustum.left}
        right={frustum.right}
        top={frustum.top}
        bottom={frustum.bottom}
      />
      <ambientLight intensity={1.1} />
      <directionalLight position={[0, 20, 10]} intensity={1.4} color="#ffeedd" />
      <directionalLight position={[0, 10, -15]} intensity={0.5} color="#aac8ff" />

      {/* Flat, raycastable-only backdrop so a drag/tap anywhere on the play
          field steers the seraphim — transparent rather than visible=false
          since Three.js's raycaster skips invisible objects entirely. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        onPointerDown={handlePointerDown}
      >
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Both vanish instantly on contact — conditional rendering rather
          than a fade, matching "vanish" literally. */}
      {!isGameOver && (
        <group ref={setAvatarRef} scale={SERAPHIM_SCALE}>
          <pointLight color="#FFDFA0" intensity={1.2} distance={8} />
          <Suspense fallback={null}>
            <SeraphimAvatarModel avatarRef={avatarRef} />
          </Suspense>
        </group>
      )}

      {!isGameOver && (
        <group ref={setDemonRef} scale={DEMON_SCALE}>
          <pointLight color="#ff3344" intensity={1.2} distance={8} />
          <Suspense fallback={null}>
            <DemonAvatarModel demonRef={demonRef} />
          </Suspense>
        </group>
      )}

      {crystals.map((c) => (
        <Crystal
          key={c.id}
          data={c}
          collectingRef={collectingRef}
          onCollected={handleCollected}
        />
      ))}
    </>
  );
}

// ============================================================================
// CSS-only decorative layer — drifting clouds, twinkling stars, an eye that
// tracks the pointer. All siblings of the Canvas, not WebGL.
// ============================================================================
function DriftCloud({
  top,
  startLeft,
  scale,
  duration,
  delay,
  opacity,
}: {
  top: string;
  startLeft: string;
  scale: number;
  duration: string;
  delay: string;
  opacity: number;
}) {
  return (
    <div
      className="absolute aspect-[2/1] w-40 animate-[seraphim-cloud-drift_linear_infinite]"
      style={{
        top,
        left: startLeft,
        opacity,
        transform: `scale(${scale})`,
        animationDuration: duration,
        animationDelay: delay,
      }}
    >
      <div className="absolute inset-0 rounded-full bg-white/90" />
      <div className="absolute -top-[35%] left-[12%] aspect-square w-[55%] rounded-full bg-white/90" />
      <div className="absolute -top-[48%] left-[42%] aspect-square w-[65%] rounded-full bg-white/90" />
      <div className="absolute -top-[22%] right-[6%] aspect-square w-[45%] rounded-full bg-white/90" />
    </div>
  );
}

const STAR_POSITIONS = [
  { top: "6%", left: "8%" },
  { top: "12%", left: "22%" },
  { top: "4%", left: "38%" },
  { top: "15%", left: "55%" },
  { top: "8%", left: "68%" },
  { top: "18%", left: "80%" },
  { top: "5%", left: "92%" },
  { top: "22%", left: "12%" },
  { top: "25%", left: "45%" },
  { top: "20%", left: "88%" },
  { top: "10%", left: "30%" },
];

function SkyBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #4A4A4A, #738185 40%, #B3DAE6 75%, #ffffff)",
      }}
    >
      {STAR_POSITIONS.map((s, i) => (
        <div
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-white animate-[seraphim-star-twinkle_ease-in-out_infinite]"
          style={{
            top: s.top,
            left: s.left,
            animationDuration: `${2.5 + (i % 4)}s`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      <DriftCloud top="30%" startLeft="100%" scale={1} duration="55s" delay="0s" opacity={0.85} />
      <DriftCloud top="45%" startLeft="60%" scale={1.4} duration="80s" delay="5s" opacity={0.7} />
      <DriftCloud top="60%" startLeft="30%" scale={0.8} duration="40s" delay="10s" opacity={0.9} />
      <DriftCloud top="70%" startLeft="90%" scale={1.2} duration="65s" delay="18s" opacity={0.6} />
      <DriftCloud top="38%" startLeft="10%" scale={0.6} duration="35s" delay="2s" opacity={0.5} />
    </div>
  );
}

// A purely decorative moon that watches the cursor — not a control. Kept
// visually separate from the HUD/legend so it doesn't get mistaken for one.
function TrackingMoon() {
  const irisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      const iris = irisRef.current;
      if (!iris) return;
      const dx = clientX - window.innerWidth / 2;
      const dy = clientY - window.innerHeight / 2;
      const dist = Math.min(Math.hypot(dx, dy), 60) / 6;
      const angle = Math.atan2(dy, dx);
      const rotateY = Math.cos(angle) * dist;
      const rotateX = -Math.sin(angle) * dist;
      iris.classList.remove("animate-[seraphim-iris-idle_10s_ease-in-out_infinite]");
      iris.style.transform = `perspective(200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(40px) scale(0.6)`;
    };
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };
    const handleLeave = () => {
      irisRef.current?.classList.add(
        "animate-[seraphim-iris-idle_10s_ease-in-out_infinite]"
      );
      if (irisRef.current) irisRef.current.style.transform = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleLeave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-4 h-[90px] w-[90px] -translate-x-1/2"
      aria-hidden="true"
    >
      <div
        className="relative h-full w-full rounded-full"
        style={{
          background: "#ffefe2",
          boxShadow: "inset 0 4px 10px rgba(0,0,0,0.35), inset 0 -2px 6px rgba(255,255,255,0.4)",
        }}
      >
        <div
          ref={irisRef}
          className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full animate-[seraphim-iris-idle_10s_ease-in-out_infinite]"
          style={{
            background:
              "radial-gradient(ellipse at center, #3a2a55 0%, #1a1230 55%, #000 100%)",
          }}
        />
      </div>
    </div>
  );
}

function HUD({
  score,
  counts,
  onReset,
}: {
  score: number;
  counts: Record<CrystalType, number>;
  onReset: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 text-white">
      <div>
        <h3 className="text-lg font-bold drop-shadow">
          ✧ Seraphim ✧{" "}
          <span className="text-yellow-300">{score}</span>
        </h3>
        <p className="text-xs text-white/80 drop-shadow">
          Drag, WASD, or arrows to move · R to reset · avoid the demon 👹
        </p>
        <div className="mt-2 flex flex-col gap-1 text-xs">
          {CRYSTAL_TYPES.map((t) => (
            <div key={t} className="flex items-center gap-2 drop-shadow">
              <span
                className="h-3 w-3 rounded-sm border border-white/40"
                style={{ backgroundColor: CRYSTAL_COLOR[t] }}
              />
              <span className="w-16">{CRYSTAL_LABEL[t]}</span>
              <span className="font-semibold text-yellow-300">
                {counts[t]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="btn btn-sm pointer-events-auto border-none bg-white/20 text-white backdrop-blur hover:bg-white/30"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function GameOverOverlay({
  score,
  onReset,
}: {
  score: number;
  onReset: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/70 text-center text-white">
      <span className="animate-[thunder-burst_0.5s_ease-out] text-7xl">
        ⚡
      </span>
      <h2 className="text-2xl font-bold">The demon caught you!</h2>
      <p className="text-lg">
        Final Score: <span className="font-bold text-yellow-300">{score}</span>
      </p>
      <button
        type="button"
        onClick={onReset}
        className="btn btn-primary mt-2"
      >
        Play Again
      </button>
    </div>
  );
}

const INITIAL_COUNTS: Record<CrystalType, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

export default function SeraphimCrystalGame({
  className = "",
  onScoreSubmitted,
}: {
  className?: string;
  onScoreSubmitted?: () => void;
}) {
  const [score, setScore] = useState(0);
  const [counts, setCounts] = useState<Record<CrystalType, number>>(
    INITIAL_COUNTS
  );
  const [resetSignal, setResetSignal] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const scoreRef = useRef(score);
  scoreRef.current = score;
  const scoreSubmittedRef = useRef(false);

  const handleCollect = (type: CrystalType) => {
    playWooshSound();
    setScore((s) => s + 1);
    setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
  };

  const handleGameOver = () => {
    playThunderSound();
    setIsGameOver(true);
  };

  useEffect(() => {
    if (!isGameOver || scoreSubmittedRef.current) return;
    scoreSubmittedRef.current = true;
    submitSeraphimScore(scoreRef.current).then(() => {
      onScoreSubmitted?.();
    });
  }, [isGameOver, onScoreSubmitted]);

  const handleReset = () => {
    setScore(0);
    setCounts(INITIAL_COUNTS);
    setIsGameOver(false);
    scoreSubmittedRef.current = false;
    setResetSignal((n) => n + 1);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { isMaximized, toggleMaximize } = useGameFullscreen();

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${
        isMaximized ? "!fixed !inset-0 !z-[100] !rounded-none" : ""
      } ${className}`}
      onPointerDown={unlockAudio}
    >
      <SkyBackground />
      {/* key forces a full remount (fresh WebGL context + size measurement)
          when the fullscreen state flips, instead of risking a stale/
          transient size from mid-transition getting stuck. */}
      <Canvas
        key={isMaximized ? "fullscreen" : "normal"}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ touchAction: "none" }}
      >
        <SeraphimScene
          onCollect={handleCollect}
          resetSignal={resetSignal}
          isGameOver={isGameOver}
          onGameOver={handleGameOver}
        />
      </Canvas>
      <TrackingMoon />
      <HUD score={score} counts={counts} onReset={handleReset} />
      <FullscreenButton isMaximized={isMaximized} onToggle={toggleMaximize} />
      {isGameOver && (
        <GameOverOverlay score={score} onReset={handleReset} />
      )}
    </div>
  );
}
