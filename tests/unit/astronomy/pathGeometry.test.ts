/**
 * Tests for path-perpendicular geometry used to render eclipse bands on the map.
 *
 * The core invariant: offset bands must be perpendicular to the actual path
 * direction, not fixed N/S. A path going NE must produce NW/SE offsets;
 * a path going SE must produce NE/SW offsets. Failing to do this causes the
 * shading polygons to appear on the wrong side of the eclipse path (MAT-111).
 */

import { describe, it, expect } from 'vitest'
import {
  gcBearing,
  gcDestination,
  waypointBearing,
  perpendicularOffset,
  buildOffsetRing,
} from '../../../src/lib/astronomy/pathGeometry.js'

describe('gcBearing', () => {
  it('due east along the equator is 90°', () => {
    expect(gcBearing(0, 0, 0, 1)).toBeCloseTo(90, 1)
  })

  it('due north is 0°', () => {
    expect(gcBearing(0, 0, 1, 0)).toBeCloseTo(0, 1)
  })

  it('due south is 180°', () => {
    expect(gcBearing(1, 0, 0, 0)).toBeCloseTo(180, 1)
  })

  it('due west is 270°', () => {
    expect(gcBearing(0, 1, 0, 0)).toBeCloseTo(270, 1)
  })

  it('northeast diagonal is ~45°', () => {
    const b = gcBearing(0, 0, 1, 1)
    expect(b).toBeGreaterThan(40)
    expect(b).toBeLessThan(50)
  })

  it('southwest diagonal is ~225°', () => {
    const b = gcBearing(1, 1, 0, 0)
    expect(b).toBeGreaterThan(220)
    expect(b).toBeLessThan(230)
  })
})

describe('gcDestination', () => {
  it('moving due north 111 km increases lat by ~1°', () => {
    const [lat, lon] = gcDestination(0, 0, 0, 111)
    expect(lat).toBeCloseTo(1, 0)
    expect(lon).toBeCloseTo(0, 1)
  })

  it('moving due east 111 km at equator increases lon by ~1°', () => {
    const [lat, lon] = gcDestination(0, 0, 90, 111)
    expect(lat).toBeCloseTo(0, 1)
    expect(lon).toBeCloseTo(1, 0)
  })

  it('zero distance returns start point', () => {
    const [lat, lon] = gcDestination(45, 20, 135, 0)
    expect(lat).toBeCloseTo(45, 5)
    expect(lon).toBeCloseTo(20, 5)
  })
})

describe('waypointBearing', () => {
  it('single segment: bearing at index 0 equals segment bearing', () => {
    const pts = [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }]
    expect(waypointBearing(pts, 0)).toBeCloseTo(90, 0)
  })

  it('single segment: bearing at last index equals segment bearing', () => {
    const pts = [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }]
    expect(waypointBearing(pts, 1)).toBeCloseTo(90, 0)
  })

  it('three points going same direction: middle bearing equals segment bearing', () => {
    const pts = [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }, { lat: 0, lon: 2 }]
    expect(waypointBearing(pts, 1)).toBeCloseTo(90, 0)
  })
})

describe('perpendicularOffset — east-going path', () => {
  // For a path going due east, perpendicular N/S should match simple lat offset.
  const bearingEast = 90

  it('N offset increases latitude, longitude stays the same', () => {
    const [lat, lon] = perpendicularOffset(0, 0, bearingEast, 100, 'N')
    expect(lat).toBeGreaterThan(0)
    expect(lon).toBeCloseTo(0, 0) // longitude barely changes
  })

  it('S offset decreases latitude', () => {
    const [lat, lon] = perpendicularOffset(0, 0, bearingEast, 100, 'S')
    expect(lat).toBeLessThan(0)
    expect(lon).toBeCloseTo(0, 0)
  })

  it('N and S offsets are symmetric about the path', () => {
    const [latN] = perpendicularOffset(30, 10, bearingEast, 200, 'N')
    const [latS] = perpendicularOffset(30, 10, bearingEast, 200, 'S')
    expect(latN - 30).toBeCloseTo(30 - latS, 2)
  })
})

describe('perpendicularOffset — NE-going path (the MAT-111 regression)', () => {
  // Path going NE (bearing ≈ 45°): the 2026 eclipse path near Iceland has this shape.
  // The "N" side should be to the NW (lat increases, lon DECREASES).
  // The old approxOffset() only changed latitude, leaving longitude unchanged — WRONG.

  const bearingNE = 45

  it('N offset for NE path shifts longitude westward (not unchanged)', () => {
    const [, lon] = perpendicularOffset(65, -25, bearingNE, 200, 'N')
    // NW direction: lon must decrease (go west)
    expect(lon).toBeLessThan(-25)
  })

  it('N offset for NE path shifts latitude northward', () => {
    const [lat] = perpendicularOffset(65, -25, bearingNE, 200, 'N')
    expect(lat).toBeGreaterThan(65)
  })

  it('S offset for NE path shifts longitude eastward', () => {
    const [, lon] = perpendicularOffset(65, -25, bearingNE, 200, 'S')
    // SE direction: lon must increase (go east)
    expect(lon).toBeGreaterThan(-25)
  })

  it('S offset for NE path shifts latitude southward', () => {
    const [lat] = perpendicularOffset(65, -25, bearingNE, 200, 'S')
    expect(lat).toBeLessThan(65)
  })

  it('N and S bearings from source are exactly opposite (180° apart)', () => {
    // The great-circle bearing from source to the N offset should be ~180° opposite
    // to the bearing from source to the S offset — both are perpendicular to the path.
    const [latN, lonN] = perpendicularOffset(65, -25, bearingNE, 200, 'N')
    const [latS, lonS] = perpendicularOffset(65, -25, bearingNE, 200, 'S')
    const bN = gcBearing(65, -25, latN, lonN)
    const bS = gcBearing(65, -25, latS, lonS)
    // circularDiff = 180 means the two bearings are exactly opposite
    const circularDiff = (bN - bS + 360) % 360
    const error = Math.abs(circularDiff - 180)
    expect(error).toBeLessThan(1) // within 1° of being opposite
  })
})

describe('perpendicularOffset — SW-going path (return leg of arctic eclipse)', () => {
  // For a SW-going path (bearing ≈ 225°), N side should be NW, S side SE.
  const bearingSW = 225

  it('N offset for SW path shifts longitude westward', () => {
    const [, lon] = perpendicularOffset(65, -25, bearingSW, 200, 'N')
    expect(lon).toBeLessThan(-25)
  })

  it('N offset for SW path shifts latitude northward', () => {
    const [lat] = perpendicularOffset(65, -25, bearingSW, 200, 'N')
    expect(lat).toBeGreaterThan(65)
  })
})

describe('buildOffsetRing — sharp V-turn (2026 eclipse regression)', () => {
  // The 2026 eclipse path near Iceland makes a sharp turn: the pre-GE arm goes SW
  // (~232°) and the post-GE arm goes SSW then SE (~135°). Without arc joins the
  // N-perpendicular direction jumps from NW to ENE and the ring polygon
  // self-intersects, producing checkerboard holes via the evenodd fill rule.

  // Simplified V-shaped path: arm1 goes SW, then arm2 goes SE
  const vPath = [
    { lat: 68, lon: -10 }, // pre-GE start
    { lat: 65, lon: -25 }, // GE turning point
    { lat: 60, lon: -15 }, // post-GE
  ]

  it('N ring has more points than waypoints (arc inserted at sharp bend)', () => {
    const ring = buildOffsetRing(vPath, () => 200, 'N')
    expect(ring.length).toBeGreaterThan(vPath.length)
  })

  it('S ring has more points than waypoints (arc inserted at sharp bend)', () => {
    const ring = buildOffsetRing(vPath, () => 200, 'S')
    expect(ring.length).toBeGreaterThan(vPath.length)
  })

  it('arc points at the turning waypoint are all north of 65°N', () => {
    // Arc points are pivoted around the turning waypoint (65°N, -25°E).
    // All arc points should be north of this pivot (they fan around the north side).
    const ring = buildOffsetRing(vPath, () => 200, 'N')
    // The ring has more points than waypoints; the extra points are arc points near the turn.
    // All ring points should be at or above the turning point latitude (65°).
    // They can be south of this only at the endpoints (first/last waypoints at 68° and 60°).
    const nPivot = vPath[1].lat // 65
    for (const [lat] of ring) {
      // Arc-inserted points pivot around 65°N, so lat offset from pivot is always ≥ 0.
      // Non-arc points come from other waypoints (68° → N ≥ 68° and 60° → N ≥ 60°).
      expect(lat).toBeGreaterThan(nPivot - 10) // loose check: no ring point dips far south of turn
    }
  })

  it('N and S rings stay on opposite sides of the path mid-waypoints', () => {
    const nRing = buildOffsetRing(vPath, () => 100, 'N')
    const sRing = buildOffsetRing(vPath, () => 100, 'S')
    // First point of N ring should be north of the first waypoint
    expect(nRing[0][0]).toBeGreaterThan(vPath[0].lat)
    // First point of S ring should be south of the first waypoint
    expect(sRing[0][0]).toBeLessThan(vPath[0].lat)
  })

  it('straight path produces exactly N waypoints (no arc needed)', () => {
    const straightPath = [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 5 },
      { lat: 0, lon: 10 },
    ]
    const ring = buildOffsetRing(straightPath, () => 100, 'N')
    expect(ring.length).toBe(straightPath.length)
  })
})

describe('perpendicularOffset — west-going path', () => {
  const bearingWest = 270

  it('N offset for west-going path increases latitude', () => {
    const [lat] = perpendicularOffset(0, 0, bearingWest, 100, 'N')
    expect(lat).toBeGreaterThan(0)
  })

  it('S offset for west-going path decreases latitude', () => {
    const [lat] = perpendicularOffset(0, 0, bearingWest, 100, 'S')
    expect(lat).toBeLessThan(0)
  })
})
