/**
 * Julian Date tests — expected values from Meeus "Astronomical Algorithms" Table 7.a
 * and the USNO Julian Date calculator.
 */

import { describe, it, expect } from 'vitest'
import { toJulianDate, isoToJD, jdToDate, julianCenturies } from '../../../src/lib/astronomy/julian.js'

describe('toJulianDate', () => {
  it('converts 2000-Jan-1.5 (J2000.0 epoch) correctly', () => {
    // Meeus p. 62: JD 2451545.0 = 2000 Jan 1 12:00 TT ≈ UTC
    expect(toJulianDate({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, second: 0 }))
      .toBeCloseTo(2451545.0, 5)
  })

  it('converts 1999-Jan-1.0 correctly', () => {
    // Meeus p. 62: JD 2451179.5
    expect(toJulianDate({ year: 1999, month: 1, day: 1, hour: 0, minute: 0, second: 0 }))
      .toBeCloseTo(2451179.5, 4)
  })

  it('converts 1987-Apr-10.0 correctly', () => {
    // Meeus p. 62: JD 2446895.5
    expect(toJulianDate({ year: 1987, month: 4, day: 10, hour: 0, minute: 0, second: 0 }))
      .toBeCloseTo(2446895.5, 4)
  })

  it('converts 1900-Jan-1.0 correctly', () => {
    // JD 2415020.5
    expect(toJulianDate({ year: 1900, month: 1, day: 1, hour: 0, minute: 0, second: 0 }))
      .toBeCloseTo(2415020.5, 4)
  })

  it('handles month <= 2 (treats as previous year)', () => {
    // 2000-Feb-1 12:00 → JD 2451576.0
    expect(toJulianDate({ year: 2000, month: 2, day: 1, hour: 12, minute: 0, second: 0 }))
      .toBeCloseTo(2451576.0, 4)
  })

  it('encodes fractional hours correctly', () => {
    const jdNoon = toJulianDate({ year: 2024, month: 4, day: 8, hour: 12, minute: 0, second: 0 })
    const jdMidnight = toJulianDate({ year: 2024, month: 4, day: 8, hour: 0, minute: 0, second: 0 })
    expect(jdNoon - jdMidnight).toBeCloseTo(0.5, 5)
  })
})

describe('isoToJD', () => {
  it('parses ISO UTC string to JD', () => {
    const jd = isoToJD('2000-01-01T12:00:00Z')
    expect(jd).toBeCloseTo(2451545.0, 4)
  })

  it('parses 2027-08-02 greatest eclipse time', () => {
    // NASA: greatest eclipse at 2027-08-02T10:07:49Z
    const jd = isoToJD('2027-08-02T10:07:49Z')
    expect(jd).toBeGreaterThan(2461000)
    expect(jd).toBeLessThan(2462000)
  })
})

describe('jdToDate', () => {
  it('round-trips J2000.0 epoch', () => {
    const jd = 2451545.0
    const d = jdToDate(jd)
    expect(d.getUTCFullYear()).toBe(2000)
    expect(d.getUTCMonth()).toBe(0)   // January
    expect(d.getUTCDate()).toBe(1)
    expect(d.getUTCHours()).toBe(12)
  })

  it('round-trips a known date', () => {
    const input = { year: 2027, month: 8, day: 2, hour: 10, minute: 7, second: 49 }
    const jd = toJulianDate(input)
    const d = jdToDate(jd)
    expect(d.getUTCFullYear()).toBe(2027)
    expect(d.getUTCMonth()).toBe(7)   // August (0-indexed)
    expect(d.getUTCDate()).toBe(2)
    expect(d.getUTCHours()).toBe(10)
    expect(d.getUTCMinutes()).toBe(7)
  })
})

describe('julianCenturies', () => {
  it('returns 0 at J2000.0', () => {
    expect(julianCenturies(2451545.0)).toBeCloseTo(0, 10)
  })

  it('returns 1 at J2100.0', () => {
    // One Julian century = 36525 days
    expect(julianCenturies(2451545.0 + 36525)).toBeCloseTo(1, 5)
  })
})
