import { gcDestination } from './pathGeometry.js'

const PENUMBRA_LIMIT_GAMMA = 1.55
const PENUMBRA_MAX_RADIUS_KM = 3500
const PENUMBRA_MIN_GAMMA = 0.997

/**
 * Estimate the penumbra zone radius (km) on Earth's surface for a partial solar eclipse.
 *
 * For partial eclipses the shadow axis misses Earth (|gamma| > ~0.997). The
 * penumbra cone still intersects the surface. We interpolate linearly between
 * the theoretical limits: gamma = 0.997 (maximum partial zone, ~3 500 km) and
 * gamma = 1.55 (penumbra just grazes Earth, 0 km).
 *
 * @param gamma  Distance of shadow axis from Earth centre in Earth-radii (from SolarEclipseEntry)
 */
export function penumbraRadiusKm(gamma: number): number {
  const absGamma = Math.abs(gamma)
  if (absGamma >= PENUMBRA_LIMIT_GAMMA) return 0
  return (
    ((PENUMBRA_LIMIT_GAMMA - absGamma) / (PENUMBRA_LIMIT_GAMMA - PENUMBRA_MIN_GAMMA)) *
    PENUMBRA_MAX_RADIUS_KM
  )
}

/**
 * Build a great-circle approximation of a circle on the globe.
 *
 * @param lat       Centre latitude (degrees)
 * @param lon       Centre longitude (degrees)
 * @param radiusKm  Circle radius in km
 * @param numPoints Number of polygon vertices (default 64)
 * @returns Array of [lat, lon] pairs forming a closed polygon
 */
export function buildPenumbraCircle(
  lat: number,
  lon: number,
  radiusKm: number,
  numPoints = 64,
): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i < numPoints; i++) {
    const bearing = (360 * i) / numPoints
    pts.push(gcDestination(lat, lon, bearing, radiusKm))
  }
  return pts
}
