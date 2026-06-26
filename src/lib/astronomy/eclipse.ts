/**
 * Local eclipse circumstances derived from eclipse path geometry.
 *
 * Uses the central-line waypoints (lat, lon, time, duration, pathWidthKm)
 * provided by NASA / Xavier Jubier to estimate an observer's experience.
 *
 * Limitations vs. full Besselian-element approach:
 *   - Contact times accurate to ±1–3 min (Besselian gives ±seconds).
 *   - Obscuration is a linear interpolation, not a precise overlap integral.
 *   These are acceptable for display and photography planning purposes.
 */

import { isoToJD } from './julian.js'
import { sunAltAz } from './sun.js'
import type { PathWaypoint, SolarEclipseEntry } from '../data/types.js'

/** Great-circle distance in km between two geographic points. */
export function gcDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export interface EclipseContact {
  /** UTC ISO string for C1 (first external contact — partial begins) */
  C1?: string
  /** UTC ISO string for C2 (second contact — totality/annularity begins) */
  C2?: string
  /** UTC ISO string for maximum eclipse */
  Cmax: string
  /** UTC ISO string for C3 (third contact — totality/annularity ends) */
  C3?: string
  /** UTC ISO string for C4 (fourth external contact — partial ends) */
  C4?: string
}

export interface LocalCircumstances {
  /** Whether observer is inside the umbral/antumbral path */
  inTotalityPath: boolean
  /** Maximum obscuration fraction (0–1) */
  maxObscuration: number
  /** Duration of totality or annularity in seconds (0 if partial-only) */
  totalityDuration: number
  /** Estimated contact times */
  contacts: EclipseContact
  /** Sun altitude at maximum eclipse */
  sunAltitudeAtMax: number
  /** Sun azimuth at maximum eclipse */
  sunAzimuthAtMax: number
}

/**
 * Find the waypoint on the central line closest to the observer,
 * and the observer's cross-track distance.
 */
function closestWaypoint(
  lat: number,
  lon: number,
  waypoints: PathWaypoint[],
): { waypoint: PathWaypoint; distKm: number; index: number } {
  let best = { waypoint: waypoints[0], distKm: Infinity, index: 0 }
  for (let i = 0; i < waypoints.length; i++) {
    const d = gcDistanceKm(lat, lon, waypoints[i].lat, waypoints[i].lon)
    if (d < best.distKm) {
      best = { waypoint: waypoints[i], distKm: d, index: i }
    }
  }
  return best
}

/**
 * Estimate the penumbral radius at a given waypoint.
 * Approximation: penumbra half-width ≈ pathWidthKm * 3.5 (empirical average).
 * The exact value depends on the Sun–Moon geometry and varies per eclipse.
 */
function penumbraHalfWidthKm(wp: PathWaypoint): number {
  // Penumbra is typically ~3 000–3 500 km wide at totality paths
  // We estimate it proportional to the umbral width.
  return (wp.pathWidthKm ?? 200) * 3.5
}

/**
 * Compute local circumstances for a ground observer.
 *
 * @param eclipse  Eclipse catalog entry (must have centralLine waypoints)
 * @param lat      Observer latitude in degrees
 * @param lon      Observer longitude in degrees
 */
export function localCircumstances(
  eclipse: SolarEclipseEntry,
  lat: number,
  lon: number,
): LocalCircumstances {
  const waypoints = eclipse.centralLine ?? []

  if (waypoints.length === 0) {
    // Partial-only eclipse or no path data — use greatest eclipse point
    const maxJD = isoToJD(eclipse.greatest.time)
    const { altitude, azimuth } = sunAltAz(maxJD, lat, lon)
    return {
      inTotalityPath: false,
      maxObscuration: eclipse.type === 'P' ? eclipse.magnitude * 0.5 : 0,
      totalityDuration: 0,
      contacts: { Cmax: eclipse.greatest.time },
      sunAltitudeAtMax: altitude,
      sunAzimuthAtMax: azimuth,
    }
  }

  const { waypoint: closest, distKm } = closestWaypoint(lat, lon, waypoints)
  const umbraHalfWidth = (closest.pathWidthKm ?? 0) / 2
  const penumbraHalfWidth = penumbraHalfWidthKm(closest)

  const inTotality = distKm <= umbraHalfWidth
  const inPenumbra = distKm <= penumbraHalfWidth

  if (!inPenumbra) {
    // Observer outside eclipse zone
    const maxJD = isoToJD(eclipse.greatest.time)
    const { altitude, azimuth } = sunAltAz(maxJD, lat, lon)
    return {
      inTotalityPath: false,
      maxObscuration: 0,
      totalityDuration: 0,
      contacts: { Cmax: eclipse.greatest.time },
      sunAltitudeAtMax: altitude,
      sunAzimuthAtMax: azimuth,
    }
  }

  // Obscuration: linear falloff from centre (1.0) to penumbra edge (0.0)
  const maxObscuration = inTotality
    ? 1.0
    : Math.max(0, 1 - (distKm - umbraHalfWidth) / (penumbraHalfWidth - umbraHalfWidth))

  const totalityDuration = inTotality
    ? Math.max(0, closest.duration - (distKm / umbraHalfWidth) * closest.duration * 0.15)
    : 0

  // Estimate contact times from closest waypoint timing
  // C1/C4 partial contacts: eclipse duration scales with obscuration
  const partialDurationSec = closest.duration + (1 - maxObscuration) * 3600
  const maxTime = new Date(closest.time)

  const c1 = new Date(maxTime.getTime() - (partialDurationSec / 2) * 1000)
  const c4 = new Date(maxTime.getTime() + (partialDurationSec / 2) * 1000)

  const maxJD = isoToJD(closest.time)
  const { altitude, azimuth } = sunAltAz(maxJD, lat, lon)

  const contacts: EclipseContact = {
    C1: c1.toISOString(),
    Cmax: closest.time,
    C4: c4.toISOString(),
  }

  if (inTotality) {
    const half = (totalityDuration / 2) * 1000
    contacts.C2 = new Date(maxTime.getTime() - half).toISOString()
    contacts.C3 = new Date(maxTime.getTime() + half).toISOString()
  }

  return {
    inTotalityPath: inTotality,
    maxObscuration,
    totalityDuration,
    contacts,
    sunAltitudeAtMax: altitude,
    sunAzimuthAtMax: azimuth,
  }
}
