// server/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const { ecosystems } = require("./data/ecosystems");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------------
// GET /api/ecosystems — full ordered list (frontend's single data fetch)
// -------------------------------------------------------------------
app.get("/api/ecosystems", (req, res) => {
  res.json(ecosystems);
});

// -------------------------------------------------------------------
// GET /api/ecosystems/:slug — single scene lookup
// -------------------------------------------------------------------
app.get("/api/ecosystems/:slug", (req, res) => {
  const found = ecosystems.find((e) => e.slug === req.params.slug);
  if (!found) return res.status(404).json({ error: "Ecosystem not found" });
  res.json(found);
});

// -------------------------------------------------------------------
// GET /api/ecosystems/:slug/live-data — Open-Meteo, Sunrise, & GBIF
// -------------------------------------------------------------------
app.get("/api/ecosystems/:slug/live-data", async (req, res) => {
  const found = ecosystems.find((e) => e.slug === req.params.slug);
  if (!found) return res.status(404).json({ error: "Ecosystem not found" });

  // Fallback to a default coordinate (e.g., 0,0) if lat/lng are missing on the ecosystem object
  const lat = found.lat ?? 0;
  const lng = found.lng ?? 0;

  try {
    // Concurrent fetch requests to free public APIs
    const [weatherRes, sunRes, gbifRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code`)
        .then((r) => r.json()),
      fetch(`https://api.sunrise-sunset.org/v2?lat=${lat}&lng=${lng}`)
        .then((r) => r.json()),
      fetch(`https://api.gbif.org/v1/occurrence/search?decimalLatitude=${lat}&decimalLongitude=${lng}&limit=3`)
        .then((r) => r.json()),
    ]);

    res.json({
      weather: weatherRes.current || null,
      solar: sunRes || null, // Sunrise-Sunset v2 returns fields directly at root / data object
      biodiversity: gbifRes.results || [],
    });
  } catch (error) {
    console.error("External Live API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch real-time environmental data" });
  }
});

// -------------------------------------------------------------------
// Static GLB models
// -------------------------------------------------------------------
app.use("/models", express.static(path.join(__dirname, "public/models")));

// -------------------------------------------------------------------
// Serve the built React frontend in production (client/dist)
// -------------------------------------------------------------------
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/models")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next(); // dist not built yet (dev mode) -- let it 404 quietly
  });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Ecosystems API listening on :${PORT}`));
}

module.exports = app;