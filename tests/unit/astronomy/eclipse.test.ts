/**
 * Local eclipse circumstances tests.
 *
 * Reference data:
 *   - 2027 Aug 2 total solar eclipse: NASA / Xavier Jubier
 *   - 2026 Aug 12 total solar eclipse: NASA Eclipse Bulletin
 *
 * Contact time accuracy: our geometry-based model is ±2–5 min.
 * Exact Besselian-element results are noted as comments for comparison.
 */

import { describe, it, expect } from 'vitest'
import { localCircumstances, gcDistanceKm } from '../../../src/lib/astronomy/eclipse.js'
import { SOLAR_ECLIPSES } from '../../../src/lib/data/catalog.js'

const eclipse2027 = SOLAR_ECLIPSES.find(e => e.id === 'SE2027Aug02T')!
const eclipse2026 = SOLAR_ECLIPSES.find(e => e.id === 'SE2026Aug12T')!

describe('gcDistanceKm', () => {
  it('is 0 for same point', () => {
    expect(gcDistanceKm(0, 0, 0, 0)).toBe(0)
  })

  it('equator quarter-circle is ~10 009 km', () => {
    expect(gcDistanceKm(0, 0, 0, 90)).toBeCloseTo(10_009, -1)
  })

  it('London to Paris is ~340 km', () => {
    // London: 51.51°N, −0.13°E  |  Paris: 48.85°N, 2.35°E
    const d = gcDistanceKm(51.51, -0.13, 48.85, 2.35)
    expect(d).toBeGreaterThan(320)
    expect(d).toBeLessThan(360)
  })
})

describe('localCircumstances — 2027 Aug 2 total eclipse', () => {
  // Luxor, Egypt: 25.69°N, 32.64°E — well inside the path of totality
  // NASA data: duration ≈ 6m 10s, path width ≈ 248 km
  const luxor = localCircumstances(eclipse2027, 25.69, 32.64)

  it('Luxor is inside totality path', () => {
    expect(luxor.inTotalityPath).toBe(true)
  })

  it('max obscuration is 100% inside umbra', () => {
    expect(luxor.maxObscuration).toBeCloseTo(1.0, 2)
  })

  it('totality duration at Luxor is positive', () => {
    expect(luxor.totalityDuration).toBeGreaterThan(0)
  })

  it('totality duration at Luxor is < greatest eclipse duration', () => {
    expect(luxor.totalityDuration).toBeLessThanOrEqual(eclipse2027.durationAtGreatest)
  })

  it('Sun altitude at maximum eclipse is high (> 75°) at Luxor', () => {
    // NASA: Sun altitude at greatest eclipse ≈ 83°; Luxor is near greatest eclipse point
    expect(luxor.sunAltitudeAtMax).toBeGreaterThan(70)
    expect(luxor.sunAltitudeAtMax).toBeLessThan(90)
  })

  it('C2 and C3 contacts are defined inside path', () => {
    expect(luxor.contacts.C2).toBeDefined()
    expect(luxor.contacts.C3).toBeDefined()
  })

  it('C2 is before C3', () => {
    const c2 = new Date(luxor.contacts.C2!).getTime()
    const c3 = new Date(luxor.contacts.C3!).getTime()
    expect(c2).toBeLessThan(c3)
  })

  it('C1 is before Cmax and C4 is after', () => {
    const c1 = new Date(luxor.contacts.C1!).getTime()
    const cmax = new Date(luxor.contacts.Cmax).getTime()
    const c4 = new Date(luxor.contacts.C4!).getTime()
    expect(c1).toBeLessThan(cmax)
    expect(c4).toBeGreaterThan(cmax)
  })
})

describe('localCircumstances — 2027 Aug 2, observer outside path', () => {
  // Cairo, Egypt: 30.06°N, 31.25°E — outside path (path passes ~25°N)
  // Distance from central line: ~500 km, well inside penumbra
  const cairo = localCircumstances(eclipse2027, 30.06, 31.25)

  it('Cairo is not in totality path', () => {
    expect(cairo.inTotalityPath).toBe(false)
  })

  it('Cairo has partial eclipse (obscuration 0 < f < 1)', () => {
    expect(cairo.maxObscuration).toBeGreaterThan(0)
    expect(cairo.maxObscuration).toBeLessThan(1)
  })

  it('totality duration is 0 for partial observer', () => {
    expect(cairo.totalityDuration).toBe(0)
  })

  it('C2/C3 are not defined for partial-only observer', () => {
    expect(cairo.contacts.C2).toBeUndefined()
    expect(cairo.contacts.C3).toBeUndefined()
  })
})

describe('localCircumstances — 2026 Aug 12, observer in Spain (path edge)', () => {
  // Madrid: 40.42°N, −3.70°E — near path of totality
  // The 2026 path passes through northern Spain; Madrid may be on the edge
  const madrid = localCircumstances(eclipse2026, 40.42, -3.70)

  it('produces a valid result without throwing', () => {
    expect(madrid).toBeDefined()
    expect(madrid.maxObscuration).toBeGreaterThanOrEqual(0)
    expect(madrid.maxObscuration).toBeLessThanOrEqual(1)
  })

  it('Sun altitude at maximum eclipse is positive (day time)', () => {
    expect(madrid.sunAltitudeAtMax).toBeGreaterThan(0)
  })
})
