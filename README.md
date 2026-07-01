# Eclipse Viewer

Interactive SPA for visualizing solar and lunar eclipses from 2026 to 2076.

**Live demo:** https://matee911.github.io/eclipse/

## Features

- **Eclipse map** — Leaflet-powered map with path-of-totality overlays
- **Local calculations** — contact times, Sun altitude, magnitude for any location
- **Photography panel** — recommended exposure settings based on eclipse phase and atmospheric conditions
- **Phase timeline** — visual timeline of P1 → U1 → U2 → maximum → U3 → U4 → P4
- **Location picker** — click the map or search by coordinates
- **i18n** — Polish and English UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI framework | Svelte 5 (runes) |
| Build tool | Vite |
| Language | TypeScript |
| Maps | Leaflet 1.9 |
| Localization | i18next |

## Project Structure

```
src/
├── lib/
│   ├── astronomy/
│   │   ├── julian.ts        # Julian Day conversions
│   │   ├── sun.ts           # Solar position (Meeus)
│   │   ├── eclipse.ts       # Contact-time & magnitude calculations
│   │   ├── camera.ts        # Exposure guide (Espenak)
│   │   └── atmosphere.ts    # Empirical sky-darkening model
│   ├── data/
│   │   └── catalog.ts       # Eclipse catalog (NASA Five Millennium Canon)
│   └── i18n/                # Translation strings (pl / en)
├── components/
│   ├── EclipseList          # Scrollable event list
│   ├── EclipseMap           # Leaflet map + path overlays
│   ├── EclipseDetails       # Selected-eclipse info panel
│   ├── CameraPanel          # Photography exposure panel
│   ├── PhaseTimeline        # Contact-point timeline
│   └── LocationPicker       # Coordinate input / map click
└── stores/                  # Svelte 5 rune-based state
```

## Algorithms & Data

- **Astronomical algorithms** — Jean Meeus, *Astronomical Algorithms* (2nd ed.)
- **Photography guide** — Fred Espenak, *Photographer's Guide to Solar Eclipses*
- **Sky darkening** — empirical model based on umbral depth
- **Eclipse catalog** — NASA Five Millennium Canon of Solar Eclipses (Espenak & Meeus)
- **Path waypoints** — Xavier Jubier interactive eclipse maps

## Getting Started

```bash
npm install
npm run dev    # development server at http://localhost:5173
npm run build  # production build → dist/
```

## Tests

```bash
npm run test      # unit tests (vitest)
npm run test:bdd  # end-to-end BDD tests (playwright-bdd)
```
