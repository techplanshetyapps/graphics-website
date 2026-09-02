import type { Ecosystem } from "../types";
import "./SceneOverlay.css";

export default function SceneOverlay({
  ecosystem,
  index,
  total,
  onPrev,
  onNext,
}: {
  ecosystem: Ecosystem;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="overlay">
      <div className="overlay-top">
        <span className="badge">{ecosystem.type === "3d" ? "3D scene" : "2D scene"}</span>
        <h1>{ecosystem.title}</h1>
        <p className="description">{ecosystem.description}</p>
        <p className="fact">{ecosystem.fact}</p>
      </div>

      <div className="overlay-bottom">
        <button onClick={onPrev} aria-label="Previous ecosystem">
          ← Prev
        </button>
        <span className="counter">
          {index + 1} / {total}
        </span>
        <button onClick={onNext} aria-label="Next ecosystem">
          Next →
        </button>
      </div>
    </div>
  );
}
