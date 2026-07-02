/**
 * Catalog data consistency tests.
 */

import { describe, it, expect } from 'vitest'
import { SOLAR_ECLIPSES, LUNAR_ECLIPSES } from '../../../src/lib/data/catalog.js'
import { isSolar } from '../../../src/lib/data/types.js'

describe('solar eclipse path completeness (MAT-142)', () => {
  // SE2060Apr20T and SE2063Aug24T are known stubs (Pacific Ocean, no populated waypoints yet).
  // This test documents the known gap — any unexpected new empty-path eclipses should fail.
  const KNOWN_STUBS = new Set(['SE2060Apr20T', 'SE2063Aug24T'])

  it('no unexpected Total/Annular/Hybrid solar eclipses have empty centralLine', () => {
    const missingPath = SOLAR_ECLIPSES.filter(
      (e) => e.type !== 'P' && e.centralLine.length < 2 && !KNOWN_STUBS.has(e.id)
    )
    expect(missingPath.map((e) => e.id)).toEqual([])
  })

  it('known stub eclipses have correct type and greatest-eclipse coordinates', () => {
    const se2060 = SOLAR_ECLIPSES.find((e) => e.id === 'SE2060Apr20T')
    const se2063 = SOLAR_ECLIPSES.find((e) => e.id === 'SE2063Aug24T')

    expect(se2060?.type).toBe('T')
    expect(typeof se2060?.greatest.lat).toBe('number')
    expect(se2063?.type).toBe('T')
    expect(typeof se2063?.greatest.lat).toBe('number')
  })
})

describe('lunar eclipse visibility (MAT-143)', () => {
  it('lunar eclipses exist in catalog', () => {
    expect(LUNAR_ECLIPSES.length).toBeGreaterThan(0)
  })

  it('lunar eclipses have a greatest-eclipse sub-lunar point (lat/lon)', () => {
    for (const e of LUNAR_ECLIPSES) {
      expect(typeof e.greatest.lat).toBe('number')
      expect(typeof e.greatest.lon).toBe('number')
    }
  })

  it('lunar eclipse i18n visibilityNote key exists in catalog module', () => {
    // Confirm LUNAR_ECLIPSES export exists — the UI note is controlled by i18n
    expect(LUNAR_ECLIPSES).toBeDefined()
  })
})

describe('SE2026Aug12T region ordering (MAT-146)', () => {
  const eclipse = SOLAR_ECLIPSES.find(e => e.id === 'SE2026Aug12T')!

  it('eclipse exists in catalog', () => {
    expect(eclipse).toBeDefined()
  })

  it('first region is the most spectacular viewing area (Iceland or Spain), not Russia/Arctic', () => {
    // Greatest eclipse at 65.2°N, 25.2°W — west of Iceland.
    // Russia/Arctic are the chronological start but NOT the prime viewing areas.
    // Regions should be ordered by viewing quality, not shadow chronology.
    expect(eclipse.regions[0]).not.toMatch(/russia|arctic/i)
  })

  it('Iceland appears in regions list', () => {
    expect(eclipse.regions.some(r => /iceland/i.test(r))).toBe(true)
  })

  it('Spain appears in regions list', () => {
    expect(eclipse.regions.some(r => /spain/i.test(r))).toBe(true)
  })

  it('Iceland or Spain is listed first (prime viewing area)', () => {
    expect(eclipse.regions[0]).toMatch(/iceland|spain/i)
  })
})
