/**
 * Builds guaranteed-simple (non-self-intersecting) polygons for the eclipse
 * umbra/penumbra bands rendered on the map.
 *
 * The original implementation offset each waypoint perpendicular to the path
 * by a fixed distance (buildOffsetRing in pathGeometry.ts). That approach is a
 * hand-rolled polyline offset: it self-intersects whenever the offset distance
 * exceeds the local radius of curvature of the path, not just at sharp corners.
 * For the 2026-08-12 eclipse near Iceland this produced a fan of spike/tooth
 * artifacts along the curved Greenland coast (MAT-111) — one tooth per band,
 * because each band boundary offsets by a different distance and self-
 * intersects differently.
 *
 * This module sidesteps the problem entirely by using turf's buffer/union/
 * difference primitives (backed by robust polygon-clipping), which always
 * produce valid simple polygons regardless of path curvature or buffer width.
 * The path's per-waypoint width is preserved by densifying the path and
 * unioning many short, locally-constant-width buffered segments into one
 * tapered shape.
 */

import buffer from '@turf/buffer'
import union from '@turf/union'
import difference from '@turf/difference'
import { lineString, polygon, featureCollection } from '@turf/helpers'
import type { Feature, Polygon } from 'geojson'
import { gcBearing, gcDestination, gcDistance } from './pathGeometry.js'

export interface Waypoint {
  lat: number
  lon: number
  pathWidthKm: number
}

export interface BandGeometry {
  /** One or more simple polygons (a band can split into disjoint pieces). */
  polygons: Feature<Polygon>[]
}

export interface PenumbraBandsResult {
  /** BANDS annular strips, ordered from innermost (umbra edge) to outermost. */
  bands: BandGeometry[]
  /** Solid umbra polygon (radius fraction UMBRA_F). */
  umbra: BandGeometry
}

const DENSIFY_STEP_KM = 150
const BUFFER_STEPS = 8

/**
 * Inserts interpolated points along the path so consecutive points are close
 * together, carrying a linearly-interpolated pathWidthKm. This lets us buffer
 * short, near-constant-width segments and union them into a smoothly tapered
 * shape instead of buffering the whole path at one fixed width.
 */
function densify(waypoints: ReadonlyArray<Waypoint>, stepKm = DENSIFY_STEP_KM): Waypoint[] {
  const out: Waypoint[] = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]
    const b = waypoints[i + 1]
    const dist = gcDistance(a.lat, a.lon, b.lat, b.lon)
    const brg = gcBearing(a.lat, a.lon, b.lat, b.lon)
    const steps = Math.max(1, Math.ceil(dist / stepKm))
    for (let s = 0; s < steps; s++) {
      const frac = s / steps
      const [lat, lon] = frac === 0 ? [a.lat, a.lon] : gcDestination(a.lat, a.lon, brg, dist * frac)
      out.push({ lat, lon, pathWidthKm: a.pathWidthKm + (b.pathWidthKm - a.pathWidthKm) * frac })
    }
  }
  out.push(waypoints[waypoints.length - 1])
  return out
}

function unionAll(polys: Feature<Polygon>[]): Feature<Polygon> | null {
  if (polys.length === 0) return null
  let acc = polys[0]
  for (let i = 1; i < polys.length; i++) {
    const merged = union(featureCollection([acc, polys[i]]))
    if (merged) acc = merged as Feature<Polygon>
  }
  return acc
}

/**
 * Buffers the densified path by radiusFraction * pathWidthKm at each point,
 * unioning per-segment buffers into one tapered, guaranteed-simple polygon.
 */
function taperedBuffer(densified: ReadonlyArray<Waypoint>, radiusFraction: number): Feature<Polygon> | null {
  const segments: Feature<Polygon>[] = []
  for (let i = 0; i < densified.length - 1; i++) {
    const a = densified[i]
    const b = densified[i + 1]
    const widthKm = ((a.pathWidthKm + b.pathWidthKm) / 2) * radiusFraction
    if (widthKm <= 0) continue
    const seg = lineString([[a.lon, a.lat], [b.lon, b.lat]])
    segments.push(buffer(seg, widthKm, { units: 'kilometers', steps: BUFFER_STEPS }) as Feature<Polygon>)
  }
  return unionAll(segments)
}

function toPolygonList(feature: Feature<Polygon> | null): Feature<Polygon>[] {
  if (!feature) return []
  if (feature.geometry.type === 'Polygon') return [feature]
  // difference()/union() can return a MultiPolygon when pieces are disjoint.
  const coords = (feature.geometry as unknown as { coordinates: number[][][][] }).coordinates
  return coords.map(rings => polygon(rings))
}

export function buildPenumbraBands(
  waypoints: ReadonlyArray<Waypoint>,
  bands: number,
  umbraF: number,
  penumbraF: number,
): PenumbraBandsResult {
  const densified = densify(waypoints)
  const radiiF = Array.from({ length: bands + 1 }, (_, i) => umbraF + (i / bands) * (penumbraF - umbraF))
  const buffers = radiiF.map(f => taperedBuffer(densified, f))

  const bandGeometries: BandGeometry[] = []
  for (let b = 0; b < bands; b++) {
    const inner = buffers[b]
    const outer = buffers[b + 1]
    const strip = inner && outer ? difference(featureCollection([outer, inner])) : outer
    bandGeometries.push({ polygons: toPolygonList(strip as Feature<Polygon> | null) })
  }

  return {
    bands: bandGeometries,
    umbra: { polygons: toPolygonList(buffers[0]) },
  }
}
