"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  Environment,
  Lightformer,
  Float,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

/** Textura de "wallpaper" da tela: gradiente do logo + brilho. */
function useScreenTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 1024;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 512, 1024);
    g.addColorStop(0, "#0A84FF");
    g.addColorStop(0.5, "#6E5CF6");
    g.addColorStop(1, "#FF2D55");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 1024);
    const r = ctx.createRadialGradient(160, 200, 0, 160, 200, 460);
    r.addColorStop(0, "rgba(255,255,255,0.5)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = r;
    ctx.fillRect(0, 0, 512, 1024);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Phone() {
  const group = useRef<THREE.Group>(null);
  const screen = useScreenTexture();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Rotação lenta de base + leve acompanhamento do mouse.
    group.current.rotation.y = Math.sin(t * 0.25) * 0.25 + state.pointer.x * 0.4;
    group.current.rotation.x = -state.pointer.y * 0.18;
  });

  const lensMat = (
    <meshStandardMaterial color="#0b0d12" metalness={0.6} roughness={0.2} />
  );

  return (
    <group ref={group} scale={1.05}>
      {/* Corpo */}
      <RoundedBox args={[2, 4.1, 0.24]} radius={0.27} smoothness={10}>
        <meshStandardMaterial color="#3a3a42" metalness={0.95} roughness={0.25} />
      </RoundedBox>

      {/* Tela */}
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[1.8, 3.88]} />
        <meshStandardMaterial
          map={screen}
          emissiveMap={screen}
          emissive={"#ffffff"}
          emissiveIntensity={0.85}
          roughness={0.18}
          metalness={0}
        />
      </mesh>

      {/* Dynamic Island */}
      <mesh position={[0, 1.62, 0.145]}>
        <boxGeometry args={[0.52, 0.13, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Módulo de câmera traseiro (aparece ao girar) */}
      <group position={[-0.5, 1.2, -0.14]}>
        <RoundedBox args={[0.74, 0.74, 0.06]} radius={0.16} smoothness={6}>
          <meshStandardMaterial color="#26262c" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <mesh position={[-0.16, 0.16, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
          {lensMat}
        </mesh>
        <mesh position={[0.16, 0.16, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
          {lensMat}
        </mesh>
        <mesh position={[-0.16, -0.16, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
          {lensMat}
        </mesh>
      </group>
    </group>
  );
}

export function Iphone3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 30 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={1.4} />

      {/* Ambiente em memória (sem CDN): reflexos azul/roxo/rosa no metal */}
      <Environment resolution={256}>
        <Lightformer intensity={2.4} position={[0, 2, 4]} scale={[7, 7, 1]} color="#0A84FF" />
        <Lightformer intensity={1.8} position={[-5, 0, 2]} scale={[5, 5, 1]} color="#6E5CF6" />
        <Lightformer intensity={1.6} position={[5, -1, 2]} scale={[5, 5, 1]} color="#FF2D55" />
        <Lightformer intensity={1} position={[0, 0, -5]} scale={[10, 10, 1]} color="#ffffff" />
      </Environment>

      <Float rotationIntensity={0.3} floatIntensity={0.7} speed={1.4}>
        <Phone />
      </Float>

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.45}
        blur={2.6}
        scale={8}
        far={4}
      />
    </Canvas>
  );
}
