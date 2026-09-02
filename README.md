# Natural Ecosystems in 3D — Node.js backend + React (Vite) frontend

**Node.js.** This project is a plain Express backend (`server/`) and a
plain React app built with Vite (`client/`) — there is no Next.js anywhere
in this codebase (no `next` dependency, no file-based routing, no
`app/`/`pages/` directory, no SSR).
 **Express** backend, **React (Vite)** frontend, conjuction with REST API.

## Architecture

```
ecosystems-node/
├── server/                     # Express backend
│   ├── index.js                 # API routes + static file serving
│   ├── data/ecosystems.js       # single source of truth, served via API
│   └── public/models/*.glb      # the 8 GLB files
└── client/                     # React (Vite) frontend
    ├── src/
    │   ├── App.tsx               # fetches /api/ecosystems, scene state
    │   ├── types.ts              # Ecosystem type (mirrors backend shape)
    │   └── components/
    │       ├── EcosystemCanvas.tsx   # R3F canvas, 3D vs 2D logic
    │       ├── SceneOverlay.tsx      # title/description/fact/nav UI
    │       └── SceneBackground.tsx   # per-scene gradient
    └── vite.config.ts             # dev-time proxy to the backend
```

## Run it

### Prerequisites
- **Node.js 18+** (`node -v` to check)

### Development mode 

Two terminals: frontend and backend run as separate processes with hot-reload.

**Terminal 1 — backend:**
```bash
cd server
npm install
npm run dev
```
You should see:
```
Ecosystems API listening on :4000
```
Leave this running.

**Terminal 2 — frontend:**
```bash
cd client
npm install
npm run dev
```
You should see Vite print something like:
```
  VITE v5.x.x  ready in ... ms
  ➜  Local:   http://localhost:5173/
```

Open **`http://localhost:5173`**. The frontend automatically proxies its
`/api` and `/models` requests to the backend on `:4000` (see
`vite.config.ts`) — no config changes needed.

### Production mode 

Build the frontend once, then run only the backend, which serves everything.

```bash
# 1. Build the React app
cd client
npm install
npm run build          # creates client/dist

# 2. Run the backend (it now serves the built frontend too)
cd ../server
npm install
npm start
```
Open **`http://localhost:4000`** — one process serves the page, the API,
and the `.glb` models.

### Quick sanity checks

```bash
curl http://localhost:4000/api/ecosystems              # JSON array of 8 items
curl -I http://localhost:4000/models/jungle-forest.glb  # HTTP 200
```

### Controls

- **Prev / Next** buttons or **← / →** arrow keys to switch scenes
- **Drag** to orbit (3D scenes) or pan (2D scenes)
- **Scroll** to zoom

### Troubleshooting

| Symptom | Likely cause |
|---|---|
| Frontend shows "Couldn't reach the backend API" | Backend isn't running, or you opened `:5173` before starting the server on `:4000` |
| Blank/black canvas, no error | Check browser console — usually a WebGL context issue (try a different browser/GPU) |
| `npm install` fails | Confirm Node version is 18+; delete `node_modules` and `package-lock.json` in that folder and retry |
| Port `4000` or `5173` already in use | Set `PORT=4001 npm start` for the server, or change `server.port` in `client/vite.config.ts` |

## Verified working (real checks, not just written)

- `server`: `node --check` on both server files passed; the real Express
  server was started and `curl`-tested:
  - `GET /api/ecosystems` → 200, returns all 8 entries
  - `GET /api/ecosystems/jungle-forest` → 200, correct object
  - `GET /api/ecosystems/not-a-real-slug` → 404 with `{"error": ...}`
  - `GET /models/jungle-forest.glb` → 200
- `client`: `npm run build` ran a real `tsc --noEmit` type-check (passed)
  followed by a real Vite production build (succeeded, `dist/` generated)
- **Full production integration**: after building the client, the real
  Express server was started and confirmed to serve all three surfaces
  correctly in one process — the built `index.html` (200), the live API
  (200), and a `.glb` model file (200) — via `curl`, not just inspection

## On the 3D models and facts (same caveats as before, still apply)

- The `.glb` files are procedurally generated geometry (see
  `generate_models.py`), not sourced/artist-made models — no network
  access to model repositories was available. The generator uses
  per-vertex color gradients, higher-resolution primitives, and multiple
  layered elements per scene (fauna silhouettes, flowers, coral branches,
  fish, irregular iceberg shapes via polygon extrusion) for a richer,
  more vivid look than flat single-color primitives, but these are still
  stylized/illustrative representations, not photorealistic scans.
- The descriptions/facts in `server/data/ecosystems.js` are original
  paraphrased summaries, not text copied from Wikipedia. Verify
  independently before treating them as citable.

## Deploying to Vercel

`vercel.json` is included at the project root. It:
- Builds `server/index.js` as a serverless function (`@vercel/node`), with
  `includeFiles` explicitly bundling `server/public/models/**` — Vercel's
  default bundler only traces `require()` calls, and the `.glb` files are
  served via `express.static`, not required, so without this they'd be
  missing from the deployed function.
- Builds `client/` as a static site (`@vercel/static-build`), using the
  existing `npm run build` script and outputting `client/dist`.
- Routes `/api/*` and `/models/*` to the serverless function, everything
  else to the static client build.

```bash
npm i -g vercel
vercel
```

**This config has not been tested against a real Vercel deployment** — this
environment has no network access to vercel.com, so I could only validate
the JSON syntax and check the config against Vercel's documented
`builds`/`routes` schema, not confirm an actual successful deploy. Try
`vercel dev` locally first, and check the function logs if `/api` or
`/models` don't resolve after deploying — the most likely failure points
are the `includeFiles` glob pattern or the static build's output directory
if Vercel's defaults differ from what's documented here.

## Regenerating the models

```bash
pip install trimesh shapely mapbox-earcut
python3 generate_models.py
```
This overwrites all 8 files in `server/public/models/`. Regenerating uses
fixed random seeds per scene, so output is reproducible run to run.

## 3D vs 2D scenes 

6 "3D" scenes (Jungle Forest, Ocean Floor, Cloud Forest, Seagrass Meadow,
Tropical Savanna, Desert Fauna) use volumetric geometry with free camera
orbit (`enableRotate={true}`). 2 "2D" scenes (Epiphytic Canopy Ecosystem,
Large Icebergs Drift) use flat, single-depth-plane geometry with rotation
disabled (`enableRotate={false}`) — a viewable card, not a walkable volume.
