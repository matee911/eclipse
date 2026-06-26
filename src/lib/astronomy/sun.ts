/**
 * Solar position — Meeus "Astronomical Algorithms" Ch. 25 (low accuracy ±0.01°).
 * Suitable for eclipse altitude/azimuth display, not for precise contact timing.
 */

import { julianCenturies } from './julian.js'

const DEG = Math.PI / 180
const RAD = 180 / Math.PI

function toRad(deg: number): number { return deg * DEG }
function toDeg(rad: number): number { return rad * RAD }
function mod360(x: number): number { return ((x % 360) + 360) % 360 }

export interface HorizontalCoords {
  /** Degrees above the horizon (negative = below) */
  altitude: number
  /** Degrees from North clockwise (0 = N, 90 = E, 180 = S, 270 = W) */
  azimuth: number
}

export interface EquatorialCoords {
  /** Right Ascension in degrees */
  ra: number
  /** Declination in degrees */
  dec: number
}

/**
 * Sun's apparent equatorial coordinates for a given Julian Date.
 * Accuracy: ~0.01° in longitude.
 */
export function sunEquatorial(jd: number): EquatorialCoords {
  const T = julianCenturies(jd)

  // Geometric mean longitude (degrees)
  const L0 = mod360(280.46646 + 36000.76983 * T + 0.0003032 * T * T)
  // Mean anomaly (degrees)
  const M = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T)
  const Mrad = toRad(M)

  // Equation of centre
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad)

  // Sun's true longitude
  const sunLon = mod360(L0 + C)

  // Apparent longitude (correcting for aberration and nutation)
  const omega = mod360(125.04 - 1934.136 * T)
  const lambda = mod360(sunLon - 0.00569 - 0.00478 * Math.sin(toRad(omega)))

  // Mean obliquity of the ecliptic
  const eps0 =
    23.439291111 -
    0.013004167 * T -
    0.000000164 * T * T +
    0.000000504 * T * T * T
  // Apparent obliquity
  const eps = eps0 + 0.00256 * Math.cos(toRad(omega))

  const lambdaRad = toRad(lambda)
  const epsRad = toRad(eps)

  const ra = toDeg(Math.atan2(Math.cos(epsRad) * Math.sin(lambdaRad), Math.cos(lambdaRad)))
  const dec = toDeg(Math.asin(Math.sin(epsRad) * Math.sin(lambdaRad)))

  return { ra: mod360(ra), dec }
}

/**
 * Greenwich Mean Sidereal Time in degrees — Meeus p. 87.
 */
export function gmst(jd: number): number {
  const T = julianCenturies(jd)
  const theta =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000
  return mod360(theta)
}

/**
 * Sun altitude and azimuth for a ground observer.
 *
 * @param jd  Julian Date (UTC)
 * @param lat Observer latitude in degrees (north positive)
 * @param lon Observer longitude in degrees (east positive)
 */
export function sunAltAz(jd: number, lat: number, lon: number): HorizontalCoords {
  const { ra, dec } = sunEquatorial(jd)

  // Local Sidereal Time in degrees
  const LST = mod360(gmst(jd) + lon)
  // Hour angle in radians
  const H = toRad(mod360(LST - ra))

  const decRad = toRad(dec)
  const latRad = toRad(lat)

  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(H)
  const altitude = toDeg(Math.asin(Math.max(-1, Math.min(1, sinAlt))))

  const cosAz =
    (Math.sin(decRad) - Math.sin(latRad) * sinAlt) /
    (Math.cos(latRad) * Math.cos(toRad(altitude)))
  let azimuth = toDeg(Math.acos(Math.max(-1, Math.min(1, cosAz))))
  if (Math.sin(H) > 0) azimuth = 360 - azimuth

  return { altitude, azimuth }
}

/**
 * Find the UTC time of solar transit (solar noon) for a given date.
 * Returns an approximate JD; accurate to within a minute.
 */
export function solarTransitJD(year: number, month: number, day: number, lon: number): number {
  let y = year, m = month
  if (m <= 2) { y -= 1; m += 12 }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  // Start at local noon estimate
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5 + 0.5

  // Iterate: shift by the hour angle of the Sun at this estimate
  for (let i = 0; i < 3; i++) {
    const { ra } = sunEquatorial(jd)
    const lst = mod360(gmst(jd) + lon)
    const H = lst - ra
    // Normalise H to [-180, 180]
    const Hnorm = H > 180 ? H - 360 : H < -180 ? H + 360 : H
    jd -= Hnorm / 360
  }
  return jd
}
