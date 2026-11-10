"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function ReactorCore() {
  const coreRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!coreRef.current) return;

    coreRef.current.rotation.y += delta * 0.35;
    coreRef.current.rotation.x += delta * 0.15;
  });

  return (
    <group>
      {/* Dark central core */}
      <mesh>
        <sphereGeometry args={[0.66, 48, 48]} />
        <meshStandardMaterial
          color="#080808"
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Golden wireframe */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#b87900"
          emissiveIntensity={1.5}
          metalness={0.8}
          roughness={0.2}
          wireframe
        />
      </mesh>
    </group>
  );
}

function EnergyRings() {
  const ring1 = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);
  const ring3 = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.35;
      ring1.current.rotation.y += delta * 0.2;
    }

    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.3;
      ring2.current.rotation.x += delta * 0.15;
    }

    if (ring3.current) {
      ring3.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <group>
      <mesh ref={ring1} rotation={[0.8, 0, 0]}>
        <torusGeometry args={[1.15, 0.012, 12, 120]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      <mesh ref={ring2} rotation={[1.3, 0.6, 0.3]}>
        <torusGeometry args={[1.3, 0.009, 12, 120]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fbbf24"
          emissiveIntensity={1.5}
        />
      </mesh>

      <mesh ref={ring3} rotation={[0.2, 0.8, 1]}>
        <torusGeometry args={[1.05, 0.015, 12, 120]} />
        <meshStandardMaterial
          color="#d97706"
          emissive="#d97706"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

function Reactor() {
  return (
    <Float speed={1.2} floatIntensity={0.18}>
      <ReactorCore />
      <EnergyRings />
    </Float>
  );
}

export default function AIOrb() {
  return (
    <div className="h-72 w-72 shrink-0 sm:h-80 sm:w-80">

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />

        <pointLight
          position={[2, 2, 3]}
          intensity={25}
          color="#fbbf24"
        />

        <pointLight
          position={[-3, -1, -2]}
          intensity={12}
          color="#d97706"
        />

        <Sparkles
          count={100}
          scale={3.5}
          size={2}
          speed={0.35}
          color="#fbbf24"
        />

        <Reactor />
      </Canvas>
    </div>
  );
}

