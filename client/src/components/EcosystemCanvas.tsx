import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
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

/**
 * 3D vs 2D implementation difference (unchanged from the model-authoring
 * side -- see server-side generate_models.py):
 *
 * - "3d" scenes: free-orbiting camera (OrbitControls with rotation), a
 *   soft studio Environment for reflections. Treated as a walkable volume.
 * - "2d" scenes: camera locked front-on, rotation disabled
 *   (enableRotate={false}) -- only pan/zoom remain. The underlying models
 *   are also authored as flat, single-depth-plane geometry, so there's
 *   nothing to see from the side. Presented like an illustrated card.
 */
export default function EcosystemCanvas({ ecosystem }: { ecosystem: Ecosystem }) {
  const is3D = ecosystem.type === "3d";

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
