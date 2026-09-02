// src/App.tsx
import { useCallback, useEffect, useState, useRef } from "react";
import EcosystemCanvas from "./components/EcosystemCanvas";
import SceneOverlay from "./components/SceneOverlay";
import SceneBackground from "./components/SceneBackground";
import CustomCursor from "./components/CustomCursor";
import { ecosystems } from "./data/ecosystems";

export default function App() {
  const [index, setIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasImage, setCanvasImage] = useState<string | undefined>(undefined);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const goNext = useCallback(() => {
    captureSnapshot();
    setIndex((i) => (i + 1) % ecosystems.length);
  }, []);

  const goPrev = useCallback(() => {
    captureSnapshot();
    setIndex((i) => (i - 1 + ecosystems.length) % ecosystems.length);
  }, []);

  const captureSnapshot = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      try {
        const dataUrl = canvas.toDataURL("image/png");
        setCanvasImage(dataUrl);
      } catch (e) {
        console.warn("Canvas is tainted. Skipping image snapshot for PDF.", e);
        setCanvasImage(undefined);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(captureSnapshot, 800);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const ecosystem = ecosystems[index];

  return (
    <main style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <CustomCursor ecosystem={ecosystem} />
      <SceneBackground ecosystem={ecosystem} />
      
      <EcosystemCanvas 
        ref={canvasRef}
        key={ecosystem.slug} 
        ecosystem={ecosystem} 
        onProgress={(progress, active) => {
          setLoadingProgress(progress);
          setIsLoading(active);
          if (!active) captureSnapshot();
        }}
      />

      <SceneOverlay
        ecosystem={ecosystem}
        index={index}
        total={ecosystems.length}
        onPrev={goPrev}
        onNext={goNext}
        loadingProgress={loadingProgress}
        isLoading={isLoading}
        canvasImage={canvasImage}
      />
    </main>
  );
}