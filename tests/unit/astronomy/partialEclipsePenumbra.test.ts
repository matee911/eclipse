/**
 * Tests for partial solar eclipse penumbra geometry.
 *
 * Partial eclipses (type P) have no central line, so the map must draw a
 * penumbra zone around the greatest-eclipse point instead (MAT-142).
 */

import { describe, it, expect } from 'vitest'
import { penumbraRadiusKm, buildPenumbraCircle } from '../../../src/lib/astronomy/partialEclipsePenumbra.js'

describe('penumbraRadiusKm', () => {
  it('returns positive radius for a typical partial eclipse (gamma = 1.2)', () => {
    expect(penumbraRadiusKm(1.2)).toBeGreaterThan(0)
  })

  it('returns positive radius for a negative-gamma partial eclipse (gamma = -1.2)', () => {
    expect(penumbraRadiusKm(-1.2)).toBeGreaterThan(0)
  })

  it('returns ~3500 km when gamma is at the barely-partial threshold (0.997)', () => {
    expect(penumbraRadiusKm(0.997)).toBeCloseTo(3500, -2)
  })

  it('returns 0 at the penumbra limit (gamma = 1.55)', () => {
    expect(penumbraRadiusKm(1.55)).toBe(0)
  })

  it('returns 0 beyond the penumbra limit (gamma = 1.6)', () => {
    expect(penumbraRadiusKm(1.6)).toBe(0)
  })

  it('radius is smaller for gamma closer to 1.55 than for gamma closer to 1.0', () => {
    const rDeep = penumbraRadiusKm(1.05)
    const rShallow = penumbraRadiusKm(1.45)
    expect(rDeep).toBeGreaterThan(rShallow)
  })

  it('radius is monotonically decreasing as |gamma| increases from 0.997 to 1.55', () => {
    const gammas = [0.997, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.55]
    const radii = gammas.map(penumbraRadiusKm)
    for (let i = 1; i < radii.length; i++) {
      expect(radii[i]).toBeLessThanOrEqual(radii[i - 1])
    }
  })
})

describe('buildPenumbraCircle', () => {
  it('returns the requested number of points', () => {
    const circle = buildPenumbraCircle(45, 10, 1000, 64)
    expect(circle).toHaveLength(64)
  })

  it('each point is a [lat, lon] pair', () => {
    const circle = buildPenumbraCircle(0, 0, 500, 16)
    for (const pt of circle) {
      expect(pt).toHaveLength(2)
      expect(pt[0]).toBeGreaterThanOrEqual(-90)
      expect(pt[0]).toBeLessThanOrEqual(90)
      expect(pt[1]).toBeGreaterThanOrEqual(-180)
      expect(pt[1]).toBeLessThanOrEqual(180)
    }
  })

  it('all points are approximately the requested radius from the centre', () => {
    const radiusKm = 1000
    const circle = buildPenumbraCircle(30, 0, radiusKm, 32)
    const R_KM = 6371
    for (const [lat, lon] of circle) {
      const dlat = (lat - 30) * Math.PI / 180
      const dlon = (lon - 0) * Math.PI / 180
      const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(30 * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dlon / 2) ** 2
      const dist = 2 * Math.asin(Math.sqrt(a)) * R_KM
      expect(dist).toBeCloseTo(radiusKm, -1)
    }
  })

  it('produces different bearings (points are spread around centre)', () => {
    const circle = buildPenumbraCircle(0, 0, 500, 8)
    const lats = circle.map(([lat]) => lat)
    const lons = circle.map(([, lon]) => lon)
    expect(Math.max(...lats)).toBeGreaterThan(Math.min(...lats))
    expect(Math.max(...lons)).toBeGreaterThan(Math.min(...lons))
  })
})
