/**
 * MAT-111 regression: the hand-rolled perpendicular-offset ring (buildOffsetRing)
 * self-intersects along curved stretches of path where the penumbra half-width
 * exceeds the local radius of curvature — not just at the sharp V-turn corner.
 *
 * This produces a "fan" of thin spike/tooth artifacts along the Greenland coast
 * for the 2026-08-12 eclipse, one tooth per band boundary (screenshot evidence
 * on MAT-111). The fix replaces the hand-rolled offset with turf's battle-tested
 * buffer/union/difference primitives, which are guaranteed to produce simple
 * (non-self-intersecting) polygons.
 */

import { describe, it, expect } from 'vitest'
import kinks from '@turf/kinks'
import { polygon as turfPolygon } from '@turf/helpers'
import { buildOffsetRing } from '../../../src/lib/astronomy/pathGeometry.js'
import { buildPenumbraBands } from '../../../src/lib/astronomy/penumbraBands.js'
import { SOLAR_ECLIPSES } from '../../../src/lib/data/catalog.js'

const eclipse = SOLAR_ECLIPSES.find(e => e.id === 'SE2026Aug12T')!
const waypoints = eclipse.centralLine

const UMBRA_F = 0.5
const PENUMBRA_F = 3.5
const BANDS = 8

function legacyAnnularStrip(side: 'N' | 'S', f0: number, f1: number) {
  const inner = buildOffsetRing(waypoints, i => waypoints[i].pathWidthKm * f0, side)
  const outer = buildOffsetRing(waypoints, i => waypoints[i].pathWidthKm * f1, side)
  const ring = side === 'N'
    ? [...outer, ...[...inner].reverse()]
    : [...inner, ...[...outer].reverse()]
  // close the ring and flip to [lon, lat] for turf
  const closed = [...ring, ring[0]].map(([lat, lon]) => [lon, lat])
  return turfPolygon([closed])
}

describe('legacy buildOffsetRing annular strips (pre-fix)', () => {
  it('self-intersects on the concave (S) side near the Greenland coast — the reported fan artifact', () => {
    // Outermost band, S side: the widest offset, most likely to exceed the local
    // radius of curvature and fold back on itself.
    const strip = legacyAnnularStrip('S', UMBRA_F + (BANDS - 1) / BANDS * (PENUMBRA_F - UMBRA_F), PENUMBRA_F)
    const selfIntersections = kinks(strip)
    expect(selfIntersections.features.length).toBeGreaterThan(0)
  })
})

describe('buildPenumbraBands (turf-based fix)', () => {
  const result = buildPenumbraBands(waypoints, BANDS, UMBRA_F, PENUMBRA_F)

  it('produces BANDS annular strips plus one umbra polygon', () => {
    expect(result.bands).toHaveLength(BANDS)
  })

  it('every band polygon is simple (no self-intersections)', () => {
    for (const band of result.bands) {
      for (const poly of band.polygons) {
        expect(kinks(poly).features.length).toBe(0)
      }
    }
  })

  it('the umbra polygon is simple (no self-intersections)', () => {
    for (const poly of result.umbra.polygons) {
      expect(kinks(poly).features.length).toBe(0)
    }
  })
})
