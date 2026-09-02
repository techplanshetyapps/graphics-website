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
// Static GLB models
// -------------------------------------------------------------------
app.use("/models", express.static(path.join(__dirname, "public/models")));

// -------------------------------------------------------------------
// Serve the built React frontend in production (client/dist), so a
// single `node server/index.js` can run the whole app after `npm run
// build` in client/. In dev, the React app runs on its own Vite server
// and proxies /api and /models here instead (see client/vite.config.ts).
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
