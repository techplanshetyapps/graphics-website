// src/App.tsx
import { useCallback, useEffect, useState } from "react";
import EcosystemCanvas from "./components/EcosystemCanvas";
import SceneOverlay from "./components/SceneOverlay";
import SceneBackground from "./components/SceneBackground";
import { ecosystems } from "./data/ecosystems";

export default function App() {
  const [index, setIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % ecosystems.length);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + ecosystems.length) % ecosystems.length);
  }, []);

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
      <SceneBackground ecosystem={ecosystem} />
      
      <EcosystemCanvas 
        key={ecosystem.slug} 
        ecosystem={ecosystem} 
        onProgress={(progress, active) => {
          setLoadingProgress(progress);
          setIsLoading(active);
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
      />
    </main>
  );
}
