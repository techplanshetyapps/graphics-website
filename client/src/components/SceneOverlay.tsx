// src/components/SceneOverlay.tsx
import { useState } from "react";
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
  faDownload 
} from "@fortawesome/free-solid-svg-icons";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import EcosystemPDF from "./EcosystemPDF";
import "./SceneOverlay.css";

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenPreview = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(
        <EcosystemPDF ecosystem={ecosystem} imageSnapshot={canvasImage} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    } finally {
      setIsGenerating(false);
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
            onClick={handleOpenPreview}
            disabled={isGenerating}
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
              cursor: "pointer",
              opacity: isGenerating ? 0.7 : 1
            }}
          >
            <FontAwesomeIcon icon={faFilePdf} />
            {isGenerating ? "Generating..." : "Export PDF"}
          </button>
        </div>

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

          {/* Stable iframe PDF Viewer using Blob URL */}
          <div style={{
            width: "100%",
            maxWidth: "800px",
            height: "70vh",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #30363d",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            backgroundColor: "#0d1117"
          }}>
            {pdfUrl ? (
              <iframe 
                src={pdfUrl} 
                width="100%" 
                height="100%" 
                style={{ border: "none" }} 
                title="PDF Preview" 
              />
            ) : (
              <div style={{ color: "#ffffff", textAlign: "center", padding: "40px" }}>
                Loading Preview...
              </div>
            )}
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