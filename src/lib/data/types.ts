/** Shared TypeScript interfaces for the eclipse catalog. */

export type SolarEclipseType = 'T' | 'A' | 'H' | 'P'
export type LunarEclipseType = 'T' | 'P' | 'N'  // Total, Partial, penumbral (N)

/** One point along the central line of a solar eclipse path. */
export interface PathWaypoint {
  /** UTC ISO string for when the umbra centre is at this point */
  time: string
  lat: number
  lon: number
  /** Duration of totality/annularity in seconds at this point */
  duration: number
  /** Width of the umbral/antumbral path in km */
  pathWidthKm: number
}

export interface SolarEclipseEntry {
  /** e.g. "SE2027Aug02T" */
  id: string
  /** ISO date "YYYY-MM-DD" */
  date: string
  type: SolarEclipseType
  saros: number
  /** Distance of shadow axis from Earth centre (positive = N hemisphere) */
  gamma: number
  /** Fraction of solar diameter covered at greatest eclipse */
  magnitude: number
  /** Duration of totality/annularity in seconds at greatest eclipse (0 for partial) */
  durationAtGreatest: number
  greatest: {
    /** UTC ISO datetime */
    time: string
    lat: number
    lon: number
    /** Sun altitude at greatest eclipse */
    sunAlt: number
  }
  /** Central line waypoints — empty for partial eclipses */
  centralLine: PathWaypoint[]
  /** Human-readable list of major regions in the totality path */
  regions: string[]
}

export interface LunarContactTimes {
  /** Penumbra first contact */
  P1: string
  /** Umbra first contact (undefined for penumbral-only) */
  U1?: string
  /** Totality start */
  U2?: string
  /** Maximum eclipse */
  mid: string
  /** Totality end */
  U3?: string
  /** Umbra last contact */
  U4?: string
  /** Penumbra last contact */
  P4: string
}

export interface LunarEclipseEntry {
  id: string
  date: string
  type: LunarEclipseType
  saros: number
  /** Fraction of Moon's diameter in umbra at maximum */
  magnitude: number
  contacts: LunarContactTimes
  /** Geographic sub-lunar point at maximum eclipse */
  greatest: { lat: number; lon: number }
  /** Regions where the eclipse is visible at maximum */
  regions: string[]
}

export type EclipseEntry = SolarEclipseEntry | LunarEclipseEntry

export function isSolar(e: EclipseEntry): e is SolarEclipseEntry {
  return 'gamma' in e
}
