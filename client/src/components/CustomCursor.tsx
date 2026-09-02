// src/components/CustomCursor.tsx
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faWater,       // For Oceans / Aquatic
  faLeaf,        // For Jungles / Flora
  faTree,        // For Forests / Woodlands
  faGlobe,       // For Grasslands / Savannas
  faMountain,    // For Alpine / Rocky regions
  faSun,         // For Deserts / Arid zones
  faSnowflake,   // For Tundra / Arctic / Ice
  faCloud,       // For Cloud forests / Atmosphere
  faArrowPointer // Fallback default
} from "@fortawesome/free-solid-svg-icons";
import type { Ecosystem } from "../types";

export default function CustomCursor({ ecosystem }: { ecosystem?: Ecosystem }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Map each of your 8 ecosystems to a unique thematic icon
  let icon = faArrowPointer;
  
  if (ecosystem) {
    const slug = ecosystem.slug.toLowerCase();
    
    if (slug.includes("ocean") || slug.includes("marine") || slug.includes("reef")) {
      icon = faWater;       // 1. Water
    } else if (slug.includes("jungle") || slug.includes("rainforest")) {
      icon = faLeaf;        // 2. Leaf
    } else if (slug.includes("forest") || slug.includes("woodland")) {
      icon = faTree;        // 3. Tree
    } else if (slug.includes("savanna") || slug.includes("grassland")) {
      icon = faGlobe;       // 4. Globe
    } else if (slug.includes("mountain") || slug.includes("alpine")) {
      icon = faMountain;    // 5. Mountain
    } else if (slug.includes("desert") || slug.includes("arid")) {
      icon = faSun;         // 6. Sun
    } else if (slug.includes("tundra") || slug.includes("arctic") || slug.includes("ice")) {
      icon = faSnowflake;   // 7. Snowflake
    } else if (slug.includes("cloud") || slug.includes("sky") || slug.includes("atmosphere")) {
      icon = faCloud;       // 8. Cloud
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: "none",
        zIndex: 9999,
        color: "#00ffcc",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
      }}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
    </div>
  );
}