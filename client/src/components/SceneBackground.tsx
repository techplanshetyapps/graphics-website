import type { Ecosystem } from "../types";

export default function SceneBackground({ ecosystem }: { ecosystem: Ecosystem }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        transition: "background 0.8s ease",
        background: `linear-gradient(180deg, ${ecosystem.background.top} 0%, ${ecosystem.background.bottom} 100%)`,
      }}
    />
  );
}
