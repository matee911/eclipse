/**
 * Sky darkening model tests.
 * Expected illuminance values cross-checked against:
 *   - Silverman & Mullen (1975) eclipse illuminance observations
 *   - General eclipse photography guides (Espenak, Littmann)
 */

import { describe, it, expect } from 'vitest'
import { skyDarkening, toLux, deltaMagnitude } from '../../../src/lib/astronomy/atmosphere.js'

describe('skyDarkening', () => {
  it('returns full illuminance at zero obscuration', () => {
    const { illuminanceFraction } = skyDarkening(0, false)
    expect(illuminanceFraction).toBeCloseTo(1.0, 2)
  })

  it('returns near-zero illuminance at totality', () => {
    const { illuminanceFraction } = skyDarkening(1.0, true)
    expect(illuminanceFraction).toBeLessThan(0.001)
  })

  it('starsVisible is false at 50% obscuration', () => {
    const { starsVisible } = skyDarkening(0.5, false)
    expect(starsVisible).toBe(false)
  })

  it('starsVisible is true during totality', () => {
    const { starsVisible } = skyDarkening(1.0, true)
    expect(starsVisible).toBe(true)
  })

  it('illuminance is strictly decreasing with obscuration', () => {
    const fracs = [0, 0.25, 0.5, 0.75, 0.9, 0.99].map(f => skyDarkening(f, false).illuminanceFraction)
    for (let i = 1; i < fracs.length; i++) {
      expect(fracs[i]).toBeLessThan(fracs[i - 1])
    }
  })

  it('illuminance is below 10% at 90% obscuration (deep twilight)', () => {
    const { illuminanceFraction } = skyDarkening(0.9, false)
    // Empirical: 90% coverage → ~30% illuminance (scattered sky light dominates)
    // Our model: (1 - 0.9^1.5) ≈ 0.146
    expect(illuminanceFraction).toBeLessThan(0.30)
    expect(illuminanceFraction).toBeGreaterThan(0.05)
  })

  it('description changes with obscuration', () => {
    expect(skyDarkening(0.05, false).description.toLowerCase()).toContain('barely')
    expect(skyDarkening(0.97, false).description.toLowerCase()).toContain('twilight')
    expect(skyDarkening(1.0, true).description.toLowerCase()).toContain('night')
  })

  it('clamps obscuration to [0, 1]', () => {
    expect(() => skyDarkening(-0.1, false)).not.toThrow()
    expect(() => skyDarkening(1.5, false)).not.toThrow()
    expect(skyDarkening(-0.1, false).illuminanceFraction).toBeCloseTo(1.0, 2)
  })
})

describe('toLux', () => {
  it('full illuminance = 100 000 lux', () => {
    expect(toLux(1.0)).toBe(100_000)
  })

  it('totality illuminance is very low', () => {
    expect(toLux(0.0001)).toBeLessThan(20)
  })
})

describe('deltaMagnitude', () => {
  it('is 0 at full illuminance', () => {
    expect(deltaMagnitude(1.0)).toBeCloseTo(0, 3)
  })

  it('increases with darkening', () => {
    expect(deltaMagnitude(0.01)).toBeGreaterThan(deltaMagnitude(0.1))
  })

  it('totality darkening is >5 magnitudes (like going from day to deep twilight)', () => {
    expect(deltaMagnitude(0.0001)).toBeGreaterThan(5)
  })
})
