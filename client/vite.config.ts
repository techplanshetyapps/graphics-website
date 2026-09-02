import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev-time proxy: the Vite dev server (client) forwards /api and /models
// requests to the Express backend on :4000, so the frontend can always
// fetch("/api/ecosystems") regardless of which port it's actually running
// on. In production, the Express server itself serves the built client
// (see server/index.js), so no proxy is needed there.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
      "/models": "http://localhost:4000",
    },
  },
});
