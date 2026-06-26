# Eclipse Viewer App — Design Spec

**Date:** 2026-06-26  
**Stack:** Svelte 5 + Vite + TypeScript  
**Hosting:** GitHub Pages (static)

---

## Goal

A web app visualising solar and lunar eclipses visible from Earth over 2026–2076.  
For each eclipse it shows the ground track on a map and computes observer-specific data for a set of key cities.

---

## Must-Have Features (v1)

| Feature | Source |
|---|---|
| Eclipse trajectory on map | NASA/Jubier GeoJSON (precomputed) |
| Sun altitude above horizon | Calculated (Meeus Ch. 25) |
| Phase timeline (C1–C4) | Precomputed + path geometry |
| Camera exposure guide | Espenak lookup table |
| Totality/annularity duration | Precomputed + interpolated |
| Sky darkening % | Calculated from obscuration |
| Obscuration % at observer | Geometric model from path data |

---

## Architecture

### Layers

1. **Astronomy Core** (`src/lib/astronomy/`) — pure TS functions, zero UI deps.  
   Fully unit-tested against NASA/USNO reference values.

2. **Data Layer** (`src/lib/data/`) — static JSON/TS files bundled at build time.  
   Sources: NASA Five Millennium Canon, Xavier Jubier eclipse paths.

3. **UI** (`src/components/`) — Svelte 5 components consuming stores + core functions.

### Directory Structure

```
src/
  lib/
    astronomy/
      julian.ts        # Julian Date utilities
      sun.ts           # Solar altitude / azimuth (Meeus Ch. 25)
      eclipse.ts       # Local circumstances from path geometry
      camera.ts        # Espenak exposure guide
      atmosphere.ts    # Sky darkening model
    data/
      catalog.ts       # Eclipse catalog 2026–2076
      types.ts         # Shared TypeScript interfaces
    i18n/
      en.ts / pl.ts    # Translation strings
      index.ts         # i18next setup
  components/
    EclipseList.svelte
    EclipseMap.svelte       # Leaflet map + path overlay
    LocationPicker.svelte
    EclipseDetails.svelte   # Altitude, duration, timeline
    CameraPanel.svelte
    PhaseTimeline.svelte
  stores/
    eclipse.svelte.ts
    location.svelte.ts
tests/
  unit/astronomy/           # Vitest — verified against NASA data
  bdd/features/             # Gherkin .feature files (English)
  bdd/steps/                # Playwright step definitions
```

---

## Astronomical Algorithms

### Sun Position (Meeus Ch. 25 — low accuracy, ±0.01°)
- Input: observer lat/lon, UTC datetime
- Compute: Julian Date → mean longitude / anomaly → true longitude → RA/Dec → hour angle → altitude, azimuth

### Local Eclipse Circumstances (path geometry)
- From central-line waypoints (lat, lon, time, duration, width): interpolate closest point to observer
- Determine: inside umbra (total), outside penumbra (no eclipse), or partial
- Obscuration: linear function of distance from central line relative to penumbral radius
- Contact time estimates: from path timing + observer offset

### Sky Darkening (empirical)
- I/I₀ ≈ (1 − f^1.5) for partial, where f = obscuration fraction
- Totality: ≈ 0.01% of normal (corona only)

### Camera Exposure (Espenak tables)
- Phase → filter requirement + ISO/aperture/shutter recommendations

---

## Testing Strategy

- **Unit tests (Vitest):** each astronomy function tested against NASA/USNO reference values
- **BDD (Playwright + playwright-bdd):** Gherkin feature files in English
- **Pre-commit (Husky):** runs Vitest before every commit

---

## Tooling

| Tool | Purpose |
|---|---|
| Vite 6 | Build + dev server |
| Svelte 5 | UI framework |
| TypeScript 5 | Type safety |
| Leaflet 1.9 | Map rendering |
| i18next | EN/PL i18n (extensible) |
| Vitest 3 | Unit tests |
| Playwright | E2E / BDD |
| playwright-bdd | Gherkin integration |
| Husky 9 | Git hooks |
| commitlint | Conventional commits enforcement |

---

## i18n

- Default language: English
- Supported: EN, PL (more in v2)
- Switcher in header
- All UI strings externalised; no hardcoded copy

---

## Deployment

- `vite build` → `dist/` → GitHub Pages
- Base path configurable via env var `VITE_BASE_URL`
