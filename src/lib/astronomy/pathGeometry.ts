const DEG = Math.PI / 180
const RAD = 180 / Math.PI
const R_KM = 6371

/**
 * Great-circle bearing from (lat1, lon1) to (lat2, lon2), in degrees [0, 360).
 */
export function gcBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = lat1 * DEG
  const φ2 = lat2 * DEG
  const Δλ = (lon2 - lon1) * DEG
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return (Math.atan2(y, x) * RAD + 360) % 360
}

/**
 * Destination point given start (lat, lon), bearing (degrees), and distance (km).
 * Returns [lat, lon] in degrees.
 */
export function gcDestination(lat: number, lon: number, bearingDeg: number, distKm: number): [number, number] {
  const φ1 = lat * DEG
  const λ1 = lon * DEG
  const θ = bearingDeg * DEG
  const δ = distKm / R_KM
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ))
  const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2))
  return [φ2 * RAD, ((λ2 * RAD + 540) % 360) - 180]
}

/**
 * Path bearing at waypoint i, averaged from the incoming and outgoing segments.
 * Uses vector-sum averaging to handle the circular nature of bearings.
 */
export function waypointBearing(
  waypoints: ReadonlyArray<{ lat: number; lon: number }>,
  i: number,
): number {
  const n = waypoints.length
  if (n < 2) return 0
  if (i === 0) return gcBearing(waypoints[0].lat, waypoints[0].lon, waypoints[1].lat, waypoints[1].lon)
  if (i === n - 1) return gcBearing(waypoints[n - 2].lat, waypoints[n - 2].lon, waypoints[n - 1].lat, waypoints[n - 1].lon)
  const b1 = gcBearing(waypoints[i - 1].lat, waypoints[i - 1].lon, waypoints[i].lat, waypoints[i].lon)
  const b2 = gcBearing(waypoints[i].lat, waypoints[i].lon, waypoints[i + 1].lat, waypoints[i + 1].lon)
  const sinAvg = (Math.sin(b1 * DEG) + Math.sin(b2 * DEG)) / 2
  const cosAvg = (Math.cos(b1 * DEG) + Math.cos(b2 * DEG)) / 2
  return (Math.atan2(sinAvg, cosAvg) * RAD + 360) % 360
}

/**
 * Offset a point perpendicular to the given path bearing by distKm.
 *
 * 'N' = the geographic north side of the path (the perpendicular bearing with
 *       a northward component, i.e. cos < 90°).
 * 'S' = the geographic south side (opposite perpendicular).
 *
 * For an east-going path this is identical to pure N/S lat shifts.
 * For diagonal paths this correctly follows the path's perpendicular direction.
 */
export function perpendicularOffset(
  lat: number,
  lon: number,
  pathBearingDeg: number,
  distKm: number,
  side: 'N' | 'S',
): [number, number] {
  const perp1 = (pathBearingDeg - 90 + 360) % 360
  const perp2 = (pathBearingDeg + 90) % 360
  // The bearing with cos ≥ 0 points northward (or east/west for due N/S paths)
  const perpN = Math.cos(perp1 * DEG) >= 0 ? perp1 : perp2
  const perpS = (perpN + 180) % 360
  return gcDestination(lat, lon, side === 'N' ? perpN : perpS, distKm)
}
