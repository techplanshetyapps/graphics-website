// src/types.ts
export type EcosystemType = "3d" | "2d";

export interface Ecosystem {
  slug: string;
  title: string;
  type: EcosystemType;
  modelPath: string; // relative path, e.g. "/models/jungle-forest.glb"
  description: string;
  fact: string;
  background: {
    top: string;
    bottom: string;
  };
  cameraDistance: number;
}
