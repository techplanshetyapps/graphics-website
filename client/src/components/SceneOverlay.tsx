// src/components/SceneOverlay.tsx
import type { Ecosystem } from "../types";
import { PercentProgressBar } from "react-loader-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import "./SceneOverlay.css";

export default function SceneOverlay({
  ecosystem,
  index,
  total,
  onPrev,
  onNext,
  loadingProgress,
  isLoading,
}: {
  ecosystem: Ecosystem;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  loadingProgress: number;
  isLoading: boolean;
}) {
  return (
    <div className="overlay">
      <div className="overlay-top">
        <span className="badge">{ecosystem.type === "3d" ? "3D scene" : "2D scene"}</span>
        <h1>{ecosystem.title}</h1>
        <p className="description">{ecosystem.description}</p>
        <p className="fact">{ecosystem.fact}</p>
      </div>

      <div 
        className="overlay-bottom" 
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
      >
      {/* Contrast Progress Bar */}
        {isLoading && (
          <div style={{ width: "160px" }}>
            <PercentProgressBar
              percent={Math.round(loadingProgress)}
              color="#00ffcc"
              textColor="#ffffff"
              fontSize="11px"
            />
          </div>
        )}
        {/* Navigation Controls Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={onPrev} aria-label="Previous ecosystem">
            ← Prev
          </button>

        {/* FontAwesome Pointer Icon */}
          <div className="cursor-indicator" style={{ display: "inline-flex", alignItems: "center" }}>
            <FontAwesomeIcon icon={faArrowPointer} color="#00ffcc" size="sm" />
          </div>

          <span className="counter">
            {index + 1} / {total}
          </span>
          <button onClick={onNext} aria-label="Next ecosystem">
            Next →
          </button>
        </div>

      </div>
    </div>
  );
}
