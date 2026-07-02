/**
 * Catalog data consistency tests.
 */

import { describe, it, expect } from 'vitest'
import { SOLAR_ECLIPSES } from '../../../src/lib/data/catalog.js'

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
