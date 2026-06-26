/**
 * Camera exposure guide tests.
 * Expected values from Espenak "Photographer's Guide to Solar Eclipses".
 */

import { describe, it, expect } from 'vitest'
import {
  exposureForPhase,
  phaseFromObscuration,
  formatShutter,
} from '../../../src/lib/astronomy/camera.js'

describe('exposureForPhase', () => {
  it('requires solar filter for partial-thin phase', () => {
    expect(exposureForPhase('partial-thin').solarFilter).toBe(true)
  })

  it('requires solar filter for partial-moderate phase', () => {
    expect(exposureForPhase('partial-moderate').solarFilter).toBe(true)
  })

  it('does NOT require filter during totality', () => {
    expect(exposureForPhase('totality-inner').solarFilter).toBe(false)
    expect(exposureForPhase('totality-outer').solarFilter).toBe(false)
  })

  it("does NOT require filter for Baily's Beads", () => {
    expect(exposureForPhase('bailys-beads').solarFilter).toBe(false)
  })

  it('requires filter for annular ring phase', () => {
    expect(exposureForPhase('annular').solarFilter).toBe(true)
  })

  it('totality-inner fastest shutter speed is ≤ 1/500 (for inner corona)', () => {
    // Inner corona is bright: fastest recommended speed should be 1/500 or faster
    const { shutterSpeeds } = exposureForPhase('totality-inner')
    expect(Math.min(...shutterSpeeds)).toBeLessThanOrEqual(1 / 500)
  })

  it('totality-outer allows long exposures (≥ 1/60)', () => {
    const { shutterSpeeds } = exposureForPhase('totality-outer')
    expect(Math.max(...shutterSpeeds)).toBeGreaterThanOrEqual(1 / 60)
  })

  it('throws for unknown phase', () => {
    // @ts-expect-error testing bad input
    expect(() => exposureForPhase('rainbow')).toThrow()
  })
})

describe('phaseFromObscuration', () => {
  it('returns partial-thin for low obscuration', () => {
    expect(phaseFromObscuration(0.1, false, false)).toBe('partial-thin')
  })

  it('returns partial-moderate for 50% obscuration', () => {
    expect(phaseFromObscuration(0.5, false, false)).toBe('partial-moderate')
  })

  it('returns partial-deep for 90% obscuration', () => {
    expect(phaseFromObscuration(0.9, false, false)).toBe('partial-deep')
  })

  it('returns totality-inner inside umbra', () => {
    expect(phaseFromObscuration(1.0, true, false)).toBe('totality-inner')
  })

  it('returns annular for annular totality', () => {
    expect(phaseFromObscuration(1.0, true, true)).toBe('annular')
  })

  it("returns bailys-beads within 5s of C2", () => {
    expect(phaseFromObscuration(0.99, false, false, 3)).toBe('bailys-beads')
    expect(phaseFromObscuration(0.99, false, false, -3)).toBe('bailys-beads')
  })

  it('returns diamond-ring within 15s of C2', () => {
    expect(phaseFromObscuration(0.99, false, false, 10)).toBe('diamond-ring')
  })

  it('returns chromosphere within 30s of C2', () => {
    expect(phaseFromObscuration(0.99, false, false, 22)).toBe('chromosphere')
  })
})

describe('formatShutter', () => {
  it('formats 1/1000 correctly', () => {
    expect(formatShutter(1 / 1000)).toBe('1/1000')
  })

  it('formats 1/4 correctly', () => {
    expect(formatShutter(1 / 4)).toBe('1/4')
  })

  it('formats 1 second', () => {
    expect(formatShutter(1)).toBe('1s')
  })

  it('formats 2 seconds', () => {
    expect(formatShutter(2)).toBe('2s')
  })
})
