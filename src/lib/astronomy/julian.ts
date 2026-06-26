/**
 * Julian Date utilities — Meeus "Astronomical Algorithms" Ch. 7
 */

export interface UT {
  year: number
  month: number   // 1–12
  day: number
  hour: number
  minute: number
  second: number
}

/** Calendar date + time (UTC) → Julian Date */
export function toJulianDate({ year, month, day, hour, minute, second }: UT): number {
  let y = year
  let m = month
  if (m <= 2) {
    y -= 1
    m += 12
  }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  const dayFrac = day + hour / 24 + minute / 1440 + second / 86400
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5
}

/** ISO 8601 UTC string → Julian Date */
export function isoToJD(iso: string): number {
  const d = new Date(iso)
  return toJulianDate({
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
  })
}

/** Julian Date → JavaScript Date (UTC) */
export function jdToDate(jd: number): Date {
  const z = Math.floor(jd + 0.5)
  const f = jd + 0.5 - z
  let A: number
  if (z < 2299161) {
    A = z
  } else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25)
    A = z + 1 + alpha - Math.floor(alpha / 4)
  }
  const B = A + 1524
  const C = Math.floor((B - 122.1) / 365.25)
  const D = Math.floor(365.25 * C)
  const E = Math.floor((B - D) / 30.6001)

  const dayFrac = B - D - Math.floor(30.6001 * E) + f
  const day = Math.floor(dayFrac)
  const hourFrac = (dayFrac - day) * 24
  const hour = Math.floor(hourFrac)
  const minuteFrac = (hourFrac - hour) * 60
  const minute = Math.floor(minuteFrac)
  const second = Math.round((minuteFrac - minute) * 60)

  const month = E < 14 ? E - 1 : E - 13
  const year = month > 2 ? C - 4716 : C - 4715

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second))
}

/** Julian centuries from J2000.0 */
export function julianCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525.0
}
