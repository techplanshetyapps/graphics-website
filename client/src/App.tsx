// src/App.tsx
import { useCallback, useEffect, useState } from "react";
import EcosystemCanvas from "./components/EcosystemCanvas";
import SceneOverlay from "./components/SceneOverlay";
import SceneBackground from "./components/SceneBackground";
import type { Ecosystem } from "./types";

export default function App() {
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ecosystems")
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((data: Ecosystem[]) => setEcosystems(data))
      .catch((err) => setError(err.message));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % ecosystems.length);
  }, [ecosystems.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + ecosystems.length) % ecosystems.length);
  }, [ecosystems.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  if (error) {
    return (
      <div style={{ color: "white", padding: 32, fontFamily: "sans-serif" }}>
        Couldn't reach the backend API ({error}). Is the Express server running on :4000?
      </div>
    );
  }

  if (ecosystems.length === 0) {
    return <div style={{ color: "white", padding: 32, fontFamily: "sans-serif" }}>Loading ecosystems…</div>;
  }

  const ecosystem = ecosystems[index];

  return (
    <main style={{ position: "relative", width: "100%", height: "100%" }}>
      <SceneBackground ecosystem={ecosystem} />
      <EcosystemCanvas key={ecosystem.slug} ecosystem={ecosystem} />
      <SceneOverlay
        ecosystem={ecosystem}
        index={index}
        total={ecosystems.length}
        onPrev={goPrev}
        onNext={goNext}
      />
    </main>
  );
}
