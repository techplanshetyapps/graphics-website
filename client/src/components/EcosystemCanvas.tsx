// src/components/EcosystemCanvas.tsx
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useProgress, Html } from "@react-three/drei";
import type { Ecosystem } from "../types";

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: "white", fontFamily: "sans-serif", fontSize: 14 }}>
        Loading model…
      </div>
    </Html>
  );
}

export default function EcosystemCanvas({ 
  ecosystem, 
  onProgress 
}: { 
  ecosystem: Ecosystem; 
  onProgress?: (progress: number, active: boolean) => void;
}) {
  const is3D = ecosystem.type === "3d";

  // Tracks model loading progress via Drei
  function LoaderWatcher() {
    const { progress, active } = useProgress();
    if (onProgress) {
      onProgress(progress, active);
    }
    return null;
  }

  return (
    <Canvas
      camera={{
        position: is3D
          ? [ecosystem.cameraDistance * 0.7, ecosystem.cameraDistance * 0.5, ecosystem.cameraDistance * 0.7]
          : [0, 0, ecosystem.cameraDistance],
        fov: 45,
      }}
      shadows
    >
      <LoaderWatcher />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />

      <Suspense fallback={<Loader />}>
        <Model path={ecosystem.modelPath} />
        {is3D && <Environment preset="sunset" />}
      </Suspense>

      <OrbitControls
        enableRotate={is3D}
        enablePan={!is3D}
        enableZoom
        minDistance={is3D ? 4 : 3}
        maxDistance={is3D ? 18 : 12}
        autoRotate={is3D}
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}