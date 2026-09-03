// src/components/SceneOverlay.tsx
import { useState, useEffect } from "react";
import type { Ecosystem } from "../types";
import { PercentProgressBar } from "react-loader-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronLeft, 
  faChevronRight, 
  faArrowPointer, 
  faLeaf,
  faFilePdf,
  faTimes,
  faDownload,
  faCloudSun,
  faTemperatureHigh,
  faTint,
  faBinoculars
} from "@fortawesome/free-solid-svg-icons";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import EcosystemPDF from "./EcosystemPDF";
import "./SceneOverlay.css";

interface LiveData {
  weather?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
  solar?: {
    results?: {
      sunrise: string;
      sunset: string;
    };
  };
  biodiversity?: Array<{
    scientificName?: string;
    vernacularName?: string;
  }>;
}

export default function SceneOverlay({
  ecosystem,
  index,
  total,
  onPrev,
  onNext,
  loadingProgress,
  isLoading,
  canvasImage,
}: {
  ecosystem: Ecosystem;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  loadingProgress: number;
  isLoading: boolean;
  canvasImage?: string;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isFetchingLive, setIsFetchingLive] = useState(false);

  // Fetch live environmental data whenever the ecosystem changes
  useEffect(() => {
    let isMounted = true;
    async function loadLiveData() {
      setIsFetchingLive(true);
      try {
        const response = await fetch(`/api/ecosystems/${ecosystem.slug}/live-data`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setLiveData(data);
        }
      } catch (err) {
        console.warn("Failed to fetch live API data:", err);
      } finally {
        if (isMounted) setIsFetchingLive(false);
      }
    }

    loadLiveData();
    return () => {
      isMounted = false;
    };
  }, [ecosystem.slug]);

  // Format sunrise/sunset times cleanly if available
  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "";
    }
  };

  return (
    <div className="overlay">
      <div className="overlay-top">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="badge">
            <FontAwesomeIcon icon={faLeaf} style={{ marginRight: "6px" }} />
            {ecosystem.type === "3d" ? "3D scene" : "2D scene"}
          </span>

          {/* Export PDF Button */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            style={{
              backgroundColor: "#21262d",
              color: "#00ffcc",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              border: "1px solid #30363d",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer"
            }}
          >
            <FontAwesomeIcon icon={faFilePdf} />
            Export PDF
          </button>
        </div>

        <h1>{ecosystem.title}</h1>
        <p className="description">{ecosystem.description}</p>
        <p className="fact">{ecosystem.fact}</p>

        {/* Live Weather & Environmental Metrics Widget */}
        <div style={{
          marginTop: "14px",
          padding: "10px 14px",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "8px",
          backdropFilter: "blur(6px)",
          fontSize: "12px",
          color: "#c9d1d9",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "4px" }}>
            <span style={{ fontWeight: "bold", color: "#00ffcc", display: "flex", alignItems: "center", gap: "6px" }}>
              <FontAwesomeIcon icon={faCloudSun} /> Real-Time Biome Metrics
            </span>
            {isFetchingLive && <span style={{ fontSize: "10px", opacity: 0.7 }}>Syncing APIs...</span>}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
            {liveData?.weather && (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <FontAwesomeIcon icon={faTemperatureHigh} color="#ffa657" /> 
                  Temp: {liveData.weather.temperature_2m}°C
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <FontAwesomeIcon icon={faTint} color="#58a6ff" /> 
                  Humidity: {liveData.weather.relative_humidity_2m}%
                </span>
              </>
            )}

            {liveData?.solar?.results && (
              <span>
                🌅 Sunrise: {formatTime(liveData.solar.results.sunrise)} | Sunset: {formatTime(liveData.solar.results.sunset)}
              </span>
            )}
          </div>

          {liveData?.biodiversity && liveData.biodiversity.length > 0 && (
            <div style={{ fontSize: "11px", opacity: 0.9, display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <FontAwesomeIcon icon={faBinoculars} color="#7ee787" />
              <span>Sample Wildlife (GBIF): {liveData.biodiversity.map(b => b.vernacularName || b.scientificName).filter(Boolean).slice(0, 2).join(", ")}</span>
            </div>
          )}
        </div>
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
            <FontAwesomeIcon icon={faChevronLeft} /> Prev
          </button>

          {/* FontAwesome Pointer Icon */}
          <div className="cursor-indicator" style={{ display: "inline-flex", alignItems: "center" }}>
            <FontAwesomeIcon icon={faArrowPointer} color="#00ffcc" size="sm" />
          </div>

          <span className="counter">
            {index + 1} / {total}
          </span>

          <button onClick={onNext} aria-label="Next ecosystem">
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* FULL-SCREEN PDF PREVIEW MODAL */}
      {isPreviewOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(13, 17, 23, 0.9)",
          backdropFilter: "blur(5px)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {/* Modal Header */}
          <div style={{
            width: "100%",
            maxWidth: "800px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            color: "#ffffff"
          }}>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#58a6ff" }}>
              Report Preview: {ecosystem.title}
            </h3>
            <button
              onClick={() => setIsPreviewOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#8b949e",
                fontSize: "18px",
                cursor: "pointer"
              }}
              aria-label="Close preview"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Live PDF Viewer */}
          <div style={{
            width: "100%",
            maxWidth: "800px",
            height: "70vh",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #30363d",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
          }}>
            <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
              <EcosystemPDF ecosystem={ecosystem} imageSnapshot={canvasImage} />
            </PDFViewer>
          </div>

          {/* Modal Footer Controls */}
          <div style={{
            width: "100%",
            maxWidth: "800px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "16px"
          }}>
            <button
              onClick={() => setIsPreviewOpen(false)}
              style={{
                backgroundColor: "#21262d",
                color: "#c9d1d9",
                border: "1px solid #30363d",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Close
            </button>

            {/* Save / Download Button */}
            <PDFDownloadLink
              document={<EcosystemPDF ecosystem={ecosystem} imageSnapshot={canvasImage} />}
              fileName={`${ecosystem.slug}-report.pdf`}
              style={{
                textDecoration: "none",
                backgroundColor: "#238636",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer"
              }}
            >
              {({ loading }) => (
                <>
                  <FontAwesomeIcon icon={faDownload} />
                  {loading ? "Preparing File..." : "Save PDF to Device"}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
}