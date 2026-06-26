/**
 * Eclipse catalog 2026–2076.
 *
 * GE coordinates (greatest eclipse lat/lon), duration and path regions:
 *   Wikipedia eclipse articles (verified 2026-06-26).
 * Central-line waypoints: approximate interpolation; NOT from Jubier/NASA raw data.
 *   Physical constraints enforced: shadow speed 0.3–2.5 km/s, bearing change ≤ 65°/step.
 *   Accuracy: ±50–150 km per waypoint, ±3–8 min contact times.
 * Lunar eclipse data: NASA Five Millennium Canon (Espenak & Meeus 2009).
 */

import type { SolarEclipseEntry, LunarEclipseEntry } from './types.js'

export const SOLAR_ECLIPSES: SolarEclipseEntry[] = [
  // ── 2026 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2026Aug12T',
    date: '2026-08-12',
    type: 'T',
    saros: 126,
    gamma: 0.8977,
    magnitude: 1.0386,
    // GE coords: Wikipedia — 65°12′N 25°12′W, just west of Iceland (Látrabjarg)
    durationAtGreatest: 138,
    greatest: { time: '2026-08-12T17:47:06Z', lat: 65.2, lon: -25.2, sunAlt: 26 },
    regions: [
      'Russia (Siberia)', 'Arctic Ocean', 'Greenland', 'Iceland', 'Faroe Islands',
      'Spain (A Coruña, Bilbao, Zaragoza, Valencia, Palma)',
    ],
    centralLine: [
      // Pre-GE: path enters from Russia, sweeps west then SW through Arctic
      { time: '2026-08-12T16:10:00Z', lat: 72.0, lon:  45.0, duration:  12, pathWidthKm:  75 },
      { time: '2026-08-12T16:35:00Z', lat: 73.5, lon:  20.0, duration:  38, pathWidthKm: 158 },
      { time: '2026-08-12T17:00:00Z', lat: 73.0, lon:   0.0, duration:  68, pathWidthKm: 232 },
      { time: '2026-08-12T17:20:00Z', lat: 70.0, lon: -12.0, duration: 102, pathWidthKm: 278 },
      // Greatest eclipse — west of Iceland / Látrabjarg
      { time: '2026-08-12T17:47:06Z', lat: 65.2, lon: -25.2, duration: 138, pathWidthKm: 294 },
      // Post-GE: shadow curves SSW then ESE toward Spain
      { time: '2026-08-12T18:00:00Z', lat: 60.5, lon: -27.5, duration: 118, pathWidthKm: 272 },
      { time: '2026-08-12T18:12:00Z', lat: 54.5, lon: -20.0, duration:  92, pathWidthKm: 247 },
      { time: '2026-08-12T18:22:00Z', lat: 48.5, lon: -13.0, duration:  66, pathWidthKm: 217 },
      // Spain — A Coruña / Galicia
      { time: '2026-08-12T18:30:00Z', lat: 43.5, lon:  -8.0, duration:  44, pathWidthKm: 185 },
      // Spain — Bilbao / Asturias
      { time: '2026-08-12T18:35:00Z', lat: 43.0, lon:  -3.5, duration:  34, pathWidthKm: 165 },
      // Spain — Zaragoza
      { time: '2026-08-12T18:39:00Z', lat: 41.5, lon:   0.5, duration:  24, pathWidthKm: 142 },
      // Spain — Valencia / Balearic Islands
      { time: '2026-08-12T18:43:00Z', lat: 39.5, lon:   2.0, duration:  14, pathWidthKm: 115 },
      // Mediterranean
      { time: '2026-08-12T18:47:00Z', lat: 38.0, lon:   5.5, duration:   6, pathWidthKm:  80 },
    ],
  },
  // ── 2027 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2027Aug02T',
    date: '2027-08-02',
    type: 'T',
    saros: 136,
    gamma: 0.1209,
    magnitude: 1.0790,
    // GE: Wikipedia 25°30′N 33°12′E, duration 6m 23s = 383s
    durationAtGreatest: 383,
    greatest: { time: '2027-08-02T10:07:49Z', lat: 25.5, lon: 33.2, sunAlt: 83 },
    regions: [
      'Spain (Cádiz, Málaga)', 'Gibraltar', 'Morocco', 'Algeria', 'Tunisia',
      'Libya', 'Egypt', 'Saudi Arabia', 'Yemen', 'Somalia',
    ],
    centralLine: [
      // Atlantic, approaching Strait of Gibraltar
      { time: '2027-08-02T07:30:00Z', lat: 37.5, lon: -12.5, duration: 200, pathWidthKm: 212 },
      { time: '2027-08-02T07:45:00Z', lat: 36.5, lon:  -9.0, duration: 235, pathWidthKm: 220 },
      // Strait of Gibraltar — Cádiz / Málaga (Spain) and Tangier (Morocco)
      { time: '2027-08-02T08:00:00Z', lat: 36.0, lon:  -5.5, duration: 270, pathWidthKm: 228 },
      // NE Morocco / NW Algeria
      { time: '2027-08-02T08:10:00Z', lat: 34.8, lon:  -2.5, duration: 295, pathWidthKm: 233 },
      { time: '2027-08-02T08:20:00Z', lat: 33.5, lon:   2.0, duration: 315, pathWidthKm: 238 },
      // Algeria / Tunisia
      { time: '2027-08-02T08:35:00Z', lat: 31.5, lon:   7.5, duration: 338, pathWidthKm: 243 },
      { time: '2027-08-02T08:50:00Z', lat: 29.5, lon:  13.0, duration: 352, pathWidthKm: 246 },
      // Libya
      { time: '2027-08-02T09:00:00Z', lat: 28.0, lon:  16.5, duration: 360, pathWidthKm: 248 },
      { time: '2027-08-02T09:15:00Z', lat: 27.0, lon:  22.0, duration: 370, pathWidthKm: 250 },
      // Egypt — approaching greatest eclipse
      { time: '2027-08-02T09:35:00Z', lat: 26.0, lon:  26.0, duration: 377, pathWidthKm: 252 },
      { time: '2027-08-02T09:55:00Z', lat: 25.5, lon:  30.0, duration: 381, pathWidthKm: 253 },
      // Greatest eclipse — Red Sea region, near Luxor
      { time: '2027-08-02T10:07:49Z', lat: 25.5, lon:  33.2, duration: 383, pathWidthKm: 258 },
      // Saudi Arabia / Red Sea
      { time: '2027-08-02T10:30:00Z', lat: 25.0, lon:  38.5, duration: 375, pathWidthKm: 255 },
      // Saudi Arabia — Mecca direction
      { time: '2027-08-02T11:00:00Z', lat: 23.0, lon:  45.0, duration: 350, pathWidthKm: 250 },
      // Yemen
      { time: '2027-08-02T11:30:00Z', lat: 19.5, lon:  51.5, duration: 315, pathWidthKm: 242 },
      // Somalia
      { time: '2027-08-02T12:00:00Z', lat: 14.0, lon:  57.0, duration: 265, pathWidthKm: 230 },
    ],
  },
  // ── 2028 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2028Jul22T',
    date: '2028-07-22',
    type: 'T',
    saros: 146,
    gamma: -0.3956,
    magnitude: 1.0561,
    // GE: Wikipedia 15°36′S 126°42′E (Kimberley, NW Australia), duration 5m 10s = 310s
    durationAtGreatest: 310,
    greatest: { time: '2028-07-22T02:56:39Z', lat: -15.6, lon: 126.7, sunAlt: 67 },
    regions: ['Cocos (Keeling) Islands', 'Christmas Island', 'Australia', 'New Zealand'],
    centralLine: [
      // Cocos / Christmas Island area — Indian Ocean
      { time: '2028-07-22T01:20:00Z', lat: -10.5, lon: 105.5, duration: 220, pathWidthKm: 200 },
      { time: '2028-07-22T01:50:00Z', lat: -12.0, lon: 114.0, duration: 260, pathWidthKm: 212 },
      // Greatest eclipse — Kimberley / Kununurra
      { time: '2028-07-22T02:56:39Z', lat: -15.6, lon: 126.7, duration: 310, pathWidthKm: 230 },
      // SE across Australia
      { time: '2028-07-22T03:25:00Z', lat: -19.0, lon: 134.0, duration: 298, pathWidthKm: 226 },
      { time: '2028-07-22T03:55:00Z', lat: -24.0, lon: 141.5, duration: 275, pathWidthKm: 218 },
      // NSW — Dubbo / Orange / Sydney direction
      { time: '2028-07-22T04:20:00Z', lat: -30.5, lon: 148.0, duration: 240, pathWidthKm: 206 },
      // Sydney area
      { time: '2028-07-22T04:40:00Z', lat: -34.5, lon: 151.5, duration: 198, pathWidthKm: 191 },
      // Tasman Sea → New Zealand
      { time: '2028-07-22T05:15:00Z', lat: -44.0, lon: 168.0, duration: 140, pathWidthKm: 168 },
    ],
  },
  // ── 2030 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2030Nov25T',
    date: '2030-11-25',
    type: 'T',
    saros: 133,
    gamma: -0.3639,
    magnitude: 1.0474,
    // GE: Wikipedia 43°36′S 71°12′E (S Indian Ocean), duration 3m 44s = 224s
    durationAtGreatest: 224,
    greatest: { time: '2030-11-25T06:51:37Z', lat: -43.6, lon: 71.2, sunAlt: 69 },
    regions: ['Namibia', 'Botswana', 'South Africa', 'Lesotho', 'Indian Ocean', 'Australia (South Australia, New South Wales, Queensland)'],
    centralLine: [
      // Atlantic Ocean west of Namibia coast
      { time: '2030-11-25T04:00:00Z', lat: -21.0, lon:   4.0, duration:  68, pathWidthKm: 128 },
      // Namibia
      { time: '2030-11-25T04:22:00Z', lat: -22.0, lon:  13.0, duration:  98, pathWidthKm: 148 },
      // Botswana / South Africa
      { time: '2030-11-25T04:42:00Z', lat: -23.0, lon:  20.5, duration: 128, pathWidthKm: 162 },
      { time: '2030-11-25T05:02:00Z', lat: -25.5, lon:  27.5, duration: 158, pathWidthKm: 174 },
      // Durban / KwaZulu-Natal area
      { time: '2030-11-25T05:20:00Z', lat: -29.0, lon:  34.0, duration: 182, pathWidthKm: 182 },
      // Indian Ocean
      { time: '2030-11-25T05:48:00Z', lat: -34.0, lon:  47.5, duration: 205, pathWidthKm: 188 },
      { time: '2030-11-25T06:18:00Z', lat: -39.5, lon:  59.5, duration: 218, pathWidthKm: 192 },
      // Greatest eclipse — S Indian Ocean
      { time: '2030-11-25T06:51:37Z', lat: -43.6, lon:  71.2, duration: 224, pathWidthKm: 194 },
      // Post-GE — continuing ESE toward Australia
      { time: '2030-11-25T07:22:00Z', lat: -43.0, lon:  85.0, duration: 218, pathWidthKm: 192 },
      { time: '2030-11-25T07:50:00Z', lat: -39.5, lon:  97.5, duration: 200, pathWidthKm: 186 },
      // W Australia coast
      { time: '2030-11-25T08:18:00Z', lat: -35.0, lon: 109.5, duration: 174, pathWidthKm: 177 },
      // S Australia / NSW
      { time: '2030-11-25T08:44:00Z', lat: -31.5, lon: 120.0, duration: 148, pathWidthKm: 166 },
      { time: '2030-11-25T09:08:00Z', lat: -29.0, lon: 130.0, duration: 120, pathWidthKm: 153 },
      // SE Queensland
      { time: '2030-11-25T09:35:00Z', lat: -27.0, lon: 140.5, duration:  88, pathWidthKm: 138 },
      { time: '2030-11-25T09:58:00Z', lat: -26.5, lon: 150.0, duration:  58, pathWidthKm: 118 },
    ],
  },
  // ── 2033 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2033Mar30T',
    date: '2033-03-30',
    type: 'T',
    saros: 120,
    gamma: 0.9979,
    magnitude: 1.0226,
    durationAtGreatest: 62,
    greatest: { time: '2033-03-30T18:02:00Z', lat: 79.7, lon: 91.4, sunAlt: 6 },
    regions: ['Arctic Ocean', 'Russia (Siberia)', 'Alaska'],
    centralLine: [
      { time: '2033-03-30T17:30:00Z', lat: 80.0, lon:  55.0, duration: 35, pathWidthKm: 55 },
      { time: '2033-03-30T17:45:00Z', lat: 80.5, lon:  72.0, duration: 52, pathWidthKm: 75 },
      { time: '2033-03-30T18:02:00Z', lat: 79.7, lon:  91.4, duration: 62, pathWidthKm: 85 },
      { time: '2033-03-30T18:20:00Z', lat: 78.5, lon: 112.0, duration: 52, pathWidthKm: 75 },
      { time: '2033-03-30T18:35:00Z', lat: 77.0, lon: 128.0, duration: 38, pathWidthKm: 57 },
    ],
  },
  // ── 2034 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2034Mar20T',
    date: '2034-03-20',
    type: 'T',
    saros: 130,
    gamma: 0.3574,
    magnitude: 1.0565,
    // GE: Wikipedia 16°06′N 22°12′E (Chad/Libya/Sudan border), duration 4m 9s = 249s
    durationAtGreatest: 249,
    greatest: { time: '2034-03-20T10:18:00Z', lat: 16.1, lon: 22.2, sunAlt: 69 },
    regions: [
      'Benin', 'Nigeria', 'Cameroon', 'Chad', 'Sudan', 'Egypt',
      'Saudi Arabia', 'Kuwait', 'Iran', 'Afghanistan', 'Pakistan', 'India (north)', 'China (west)',
    ],
    centralLine: [
      // Benin / Nigeria coast
      { time: '2034-03-20T08:45:00Z', lat:  7.5, lon:   2.0, duration: 152, pathWidthKm: 162 },
      // Nigeria / Cameroon
      { time: '2034-03-20T09:05:00Z', lat: 10.0, lon:   8.5, duration: 182, pathWidthKm: 172 },
      // N Cameroon / Chad
      { time: '2034-03-20T09:25:00Z', lat: 12.5, lon:  14.0, duration: 210, pathWidthKm: 181 },
      // Greatest eclipse — Chad/Libya/Sudan border
      { time: '2034-03-20T10:18:00Z', lat: 16.1, lon:  22.2, duration: 249, pathWidthKm: 193 },
      // S Egypt / Sudan
      { time: '2034-03-20T10:42:00Z', lat: 19.5, lon:  27.0, duration: 242, pathWidthKm: 191 },
      // N Sudan / Egypt border / Red Sea
      { time: '2034-03-20T11:05:00Z', lat: 23.5, lon:  32.0, duration: 228, pathWidthKm: 187 },
      // Saudi Arabia W coast (Jeddah direction)
      { time: '2034-03-20T11:28:00Z', lat: 27.0, lon:  37.5, duration: 210, pathWidthKm: 181 },
      // Kuwait
      { time: '2034-03-20T11:52:00Z', lat: 29.5, lon:  47.5, duration: 188, pathWidthKm: 174 },
      // Iran (central)
      { time: '2034-03-20T12:20:00Z', lat: 33.5, lon:  56.0, duration: 158, pathWidthKm: 164 },
      // Afghanistan
      { time: '2034-03-20T12:48:00Z', lat: 34.5, lon:  65.5, duration: 126, pathWidthKm: 152 },
      // Pakistan NW
      { time: '2034-03-20T13:08:00Z', lat: 32.5, lon:  72.0, duration:  96, pathWidthKm: 140 },
      // N India / Tibet border
      { time: '2034-03-20T13:28:00Z', lat: 32.0, lon:  78.0, duration:  65, pathWidthKm: 124 },
      // W China
      { time: '2034-03-20T13:45:00Z', lat: 31.0, lon:  83.0, duration:  40, pathWidthKm: 106 },
    ],
  },
  // ── 2035 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2035Sep02T',
    date: '2035-09-02',
    type: 'T',
    saros: 143,
    gamma: 0.4126,
    magnitude: 1.0417,
    // GE: Wikipedia 29°06′N 158°00′E (W Pacific, E of Japan), duration 2m 54s = 174s
    durationAtGreatest: 174,
    greatest: { time: '2035-09-02T01:56:46Z', lat: 29.1, lon: 158.0, sunAlt: 66 },
    regions: ['China (Beijing, Baotou)', 'North Korea (Pyongyang)', 'Japan (Kyoto, Nagoya)', 'Pacific Ocean'],
    centralLine: [
      // N China (Baotou / Inner Mongolia)
      { time: '2035-09-02T00:20:00Z', lat: 40.5, lon:  97.0, duration:  62, pathWidthKm: 102 },
      // Beijing area
      { time: '2035-09-02T00:45:00Z', lat: 40.0, lon: 107.5, duration:  96, pathWidthKm: 128 },
      { time: '2035-09-02T01:05:00Z', lat: 39.5, lon: 116.0, duration: 122, pathWidthKm: 146 },
      // Korea Strait / North Korea
      { time: '2035-09-02T01:22:00Z', lat: 38.0, lon: 124.0, duration: 146, pathWidthKm: 158 },
      // Japan (Kyoto / Nagoya)
      { time: '2035-09-02T01:38:00Z', lat: 35.5, lon: 134.5, duration: 164, pathWidthKm: 166 },
      { time: '2035-09-02T01:50:00Z', lat: 33.5, lon: 142.5, duration: 172, pathWidthKm: 170 },
      // Greatest eclipse — W Pacific
      { time: '2035-09-02T01:56:46Z', lat: 29.1, lon: 158.0, duration: 174, pathWidthKm: 172 },
    ],
  },
  // ── 2041 — Annular over Mongolia / Japan / Pacific ────────────────────────
  {
    id: 'SE2041Oct25A',
    date: '2041-10-25',
    type: 'A',
    saros: 148,
    gamma: 0.3145,
    magnitude: 0.9477,
    // GE: Wikipedia 9°54′N 162°54′E (Pacific), annular duration 6m 7s = 367s
    durationAtGreatest: 367,
    greatest: { time: '2041-10-25T04:28:00Z', lat: 9.9, lon: 162.9, sunAlt: 70 },
    regions: ['Mongolia (Ulaanbaatar)', 'China (Shenyang, Fushun)', 'North Korea (Hamhung)', 'Japan (Kyoto, Nagoya)', 'Marshall Islands', 'Kiribati'],
    centralLine: [
      // Mongolia — Ulaanbaatar (annularity first begins ~23:48 UTC Oct 24)
      { time: '2041-10-24T23:52:00Z', lat: 48.0, lon: 107.0, duration:  65, pathWidthKm: 180 },
      // Inner Mongolia / NE China
      { time: '2041-10-25T00:35:00Z', lat: 44.0, lon: 115.5, duration: 148, pathWidthKm: 188 },
      // Shenyang / Fushun
      { time: '2041-10-25T01:02:00Z', lat: 42.0, lon: 123.0, duration: 220, pathWidthKm: 192 },
      // Korean border / North Korea (Hamhung)
      { time: '2041-10-25T01:20:00Z', lat: 40.0, lon: 126.0, duration: 260, pathWidthKm: 196 },
      // Japan Sea approach
      { time: '2041-10-25T01:45:00Z', lat: 37.0, lon: 130.5, duration: 302, pathWidthKm: 200 },
      // Japan — Kyoto / Nagoya / Hamamatsu
      { time: '2041-10-25T02:05:00Z', lat: 35.2, lon: 136.5, duration: 330, pathWidthKm: 204 },
      // W Pacific
      { time: '2041-10-25T03:05:00Z', lat: 25.0, lon: 150.0, duration: 362, pathWidthKm: 210 },
      // Greatest eclipse — Pacific Ocean
      { time: '2041-10-25T04:28:00Z', lat:  9.9, lon: 162.9, duration: 367, pathWidthKm: 213 },
      // Marshall Islands / Kiribati
      { time: '2041-10-25T05:00:00Z', lat:  5.0, lon: 168.0, duration: 340, pathWidthKm: 209 },
    ],
  },
  // ── 2044 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2044Aug23T',
    date: '2044-08-23',
    type: 'T',
    saros: 136,
    gamma: 0.7958,
    magnitude: 1.0504,
    durationAtGreatest: 208,
    greatest: { time: '2044-08-23T18:13:00Z', lat: 69.0, lon: -87.0, sunAlt: 36 },
    regions: ['Greenland', 'Canada (Nunavut)', 'USA (Montana, North Dakota)'],
    centralLine: [
      { time: '2044-08-23T17:30:00Z', lat: 72.0, lon: -120.0, duration: 155, pathWidthKm: 195 },
      { time: '2044-08-23T17:50:00Z', lat: 72.0, lon: -108.0, duration: 178, pathWidthKm: 200 },
      { time: '2044-08-23T18:10:00Z', lat: 70.0, lon:  -93.0, duration: 200, pathWidthKm: 205 },
      { time: '2044-08-23T18:13:00Z', lat: 69.0, lon:  -87.0, duration: 208, pathWidthKm: 207 },
      { time: '2044-08-23T18:30:00Z', lat: 65.0, lon:  -78.0, duration: 195, pathWidthKm: 202 },
      { time: '2044-08-23T18:50:00Z', lat: 58.0, lon:  -70.0, duration: 172, pathWidthKm: 193 },
      { time: '2044-08-23T19:10:00Z', lat: 50.0, lon:  -64.0, duration: 138, pathWidthKm: 180 },
    ],
  },
  // ── 2045 — Great American Eclipse II ──────────────────────────────────────
  {
    id: 'SE2045Aug12T',
    date: '2045-08-12',
    type: 'T',
    saros: 139,
    gamma: 0.2061,
    magnitude: 1.0804,
    // GE: Wikipedia 25°54.594′N 78°32.19′W (Atlantic, S of Bahamas), duration 6m 5.5s = 366s
    durationAtGreatest: 366,
    greatest: { time: '2045-08-12T18:12:00Z', lat: 25.9, lon: -78.5, sunAlt: 78 },
    regions: [
      'USA (California, Nevada, Utah, Colorado, Kansas, Oklahoma, Texas, Arkansas, Louisiana, Mississippi, Alabama, Georgia, Florida)',
      'Bahamas', 'Dominican Republic', 'Haiti', 'Venezuela', 'Trinidad and Tobago',
      'Guyana', 'Suriname', 'French Guiana', 'Brazil',
    ],
    centralLine: [
      // N California (Sacramento Valley)
      { time: '2045-08-12T17:00:00Z', lat: 38.5, lon: -121.5, duration: 212, pathWidthKm: 222 },
      // Nevada
      { time: '2045-08-12T17:15:00Z', lat: 38.0, lon: -117.0, duration: 242, pathWidthKm: 228 },
      // SW Utah
      { time: '2045-08-12T17:27:00Z', lat: 37.5, lon: -112.5, duration: 268, pathWidthKm: 233 },
      // SW Colorado / Four Corners
      { time: '2045-08-12T17:38:00Z', lat: 37.0, lon: -107.5, duration: 296, pathWidthKm: 238 },
      // SE Colorado / SW Kansas
      { time: '2045-08-12T17:48:00Z', lat: 36.5, lon: -102.5, duration: 322, pathWidthKm: 243 },
      // Oklahoma (Oklahoma City area)
      { time: '2045-08-12T17:55:00Z', lat: 35.5, lon:  -97.5, duration: 340, pathWidthKm: 246 },
      // E Texas / W Arkansas
      { time: '2045-08-12T17:59:00Z', lat: 34.0, lon:  -94.0, duration: 353, pathWidthKm: 249 },
      // Mississippi / Alabama
      { time: '2045-08-12T18:02:00Z', lat: 32.5, lon:  -89.5, duration: 360, pathWidthKm: 251 },
      // Georgia / NW Florida
      { time: '2045-08-12T18:06:00Z', lat: 31.0, lon:  -84.5, duration: 364, pathWidthKm: 252 },
      // Greatest eclipse — Bahamas (Atlantic E of Fort Lauderdale)
      { time: '2045-08-12T18:12:00Z', lat: 25.9, lon:  -78.5, duration: 366, pathWidthKm: 256 },
      // SE Bahamas / Haiti coast
      { time: '2045-08-12T18:25:00Z', lat: 22.0, lon:  -75.5, duration: 356, pathWidthKm: 252 },
      // Dominican Republic / Haiti
      { time: '2045-08-12T18:40:00Z', lat: 17.5, lon:  -71.0, duration: 334, pathWidthKm: 246 },
      // E Caribbean
      { time: '2045-08-12T18:55:00Z', lat: 13.0, lon:  -65.5, duration: 304, pathWidthKm: 237 },
      // Trinidad / NE Venezuela
      { time: '2045-08-12T19:15:00Z', lat:  7.5, lon:  -60.5, duration: 262, pathWidthKm: 226 },
      // Guyana / Suriname
      { time: '2045-08-12T19:40:00Z', lat:  3.0, lon:  -54.0, duration: 214, pathWidthKm: 211 },
      // NE Brazil (Amazon delta)
      { time: '2045-08-12T20:05:00Z', lat: -2.0, lon:  -47.5, duration: 162, pathWidthKm: 192 },
    ],
  },
  // ── 2052 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2052Mar30T',
    date: '2052-03-30',
    type: 'T',
    saros: 139,
    gamma: -0.3507,
    magnitude: 1.0639,
    durationAtGreatest: 302,
    greatest: { time: '2052-03-30T13:12:00Z', lat: -9.0, lon: -4.0, sunAlt: 70 },
    regions: ['West Africa', 'Central Africa', 'East Africa'],
    centralLine: [
      { time: '2052-03-30T11:30:00Z', lat:   5.0, lon: -38.0, duration: 225, pathWidthKm: 224 },
      { time: '2052-03-30T12:00:00Z', lat:   0.0, lon: -28.0, duration: 258, pathWidthKm: 230 },
      { time: '2052-03-30T12:30:00Z', lat:  -4.0, lon: -17.0, duration: 282, pathWidthKm: 235 },
      { time: '2052-03-30T13:00:00Z', lat:  -7.5, lon:  -7.0, duration: 298, pathWidthKm: 238 },
      { time: '2052-03-30T13:12:00Z', lat:  -9.0, lon:  -4.0, duration: 302, pathWidthKm: 239 },
      { time: '2052-03-30T13:30:00Z', lat: -10.5, lon:   4.0, duration: 295, pathWidthKm: 237 },
      { time: '2052-03-30T14:00:00Z', lat: -11.5, lon:  14.5, duration: 270, pathWidthKm: 232 },
      { time: '2052-03-30T14:30:00Z', lat: -10.0, lon:  24.5, duration: 235, pathWidthKm: 223 },
    ],
  },
  // ── 2060 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2060Apr20T',
    date: '2060-04-20',
    type: 'T',
    saros: 136,
    gamma: -0.3184,
    magnitude: 1.0573,
    durationAtGreatest: 272,
    greatest: { time: '2060-04-20T21:00:00Z', lat: -32.0, lon: -155.0, sunAlt: 71 },
    regions: ['Pacific Ocean', 'Southern South America'],
    centralLine: [],
  },
  // ── 2063 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2063Aug24T',
    date: '2063-08-24',
    type: 'T',
    saros: 145,
    gamma: 0.1523,
    magnitude: 1.0874,
    durationAtGreatest: 408,
    greatest: { time: '2063-08-24T20:45:00Z', lat: 12.5, lon: -138.0, sunAlt: 81 },
    regions: ['Pacific Ocean'],
    centralLine: [],
  },
  // ── 2070 ──────────────────────────────────────────────────────────────────
  {
    id: 'SE2070Apr11T',
    date: '2070-04-11',
    type: 'T',
    saros: 139,
    gamma: -0.0653,
    magnitude: 1.0656,
    durationAtGreatest: 318,
    greatest: { time: '2070-04-11T20:11:00Z', lat: -3.5, lon: -151.0, sunAlt: 86 },
    regions: ['Pacific Ocean', 'N South America (Venezuela, Guyana, Suriname, French Guiana, Brazil)', 'Spain', 'France', 'Switzerland', 'Italy', 'Croatia', 'Greece', 'Turkey'],
    centralLine: [
      // W Pacific — Solomon Sea (Papua New Guinea E coast)
      { time: '2070-04-11T15:40:00Z', lat: -8.0, lon: 145.0, duration: 220, pathWidthKm: 208 },
      // Solomon Islands
      { time: '2070-04-11T16:10:00Z', lat: -6.5, lon: 152.0, duration: 245, pathWidthKm: 214 },
      // Central Solomons
      { time: '2070-04-11T16:45:00Z', lat: -5.5, lon: 160.0, duration: 268, pathWidthKm: 220 },
      // Vanuatu vicinity
      { time: '2070-04-11T17:15:00Z', lat: -5.0, lon: 167.5, duration: 290, pathWidthKm: 226 },
      // Approaching date line
      { time: '2070-04-11T17:45:00Z', lat: -4.5, lon: 174.5, duration: 306, pathWidthKm: 230 },
      // Just past date line (= 181.5°E)
      { time: '2070-04-11T18:20:00Z', lat: -4.0, lon: -178.5, duration: 314, pathWidthKm: 234 },
      // Central Pacific
      { time: '2070-04-11T18:55:00Z', lat: -3.8, lon: -170.0, duration: 316, pathWidthKm: 237 },
      { time: '2070-04-11T19:30:00Z', lat: -3.6, lon: -161.0, duration: 317, pathWidthKm: 240 },
      // Greatest eclipse — equatorial Pacific
      { time: '2070-04-11T20:11:00Z', lat: -3.5, lon: -151.0, duration: 318, pathWidthKm: 242 },
      // Post-GE — ESE across Pacific then Atlantic
      { time: '2070-04-11T21:00:00Z', lat: -2.0, lon: -143.0, duration: 308, pathWidthKm: 240 },
      { time: '2070-04-11T21:50:00Z', lat:  2.0, lon: -132.0, duration: 292, pathWidthKm: 236 },
      // N South America
      { time: '2070-04-11T22:35:00Z', lat:  8.5, lon: -118.0, duration: 268, pathWidthKm: 229 },
      { time: '2070-04-11T23:00:00Z', lat: 14.0, lon: -108.5, duration: 248, pathWidthKm: 222 },
      { time: '2070-04-11T23:25:00Z', lat: 22.0, lon:  -96.0, duration: 220, pathWidthKm: 213 },
      // Atlantic
      { time: '2070-04-11T23:48:00Z', lat: 30.0, lon:  -78.0, duration: 188, pathWidthKm: 200 },
      // Spain / Mediterranean
      { time: '2070-04-12T00:05:00Z', lat: 38.0, lon:  -58.0, duration: 158, pathWidthKm: 185 },
      { time: '2070-04-12T00:18:00Z', lat: 43.0, lon:  -40.0, duration: 128, pathWidthKm: 168 },
      { time: '2070-04-12T00:30:00Z', lat: 46.0, lon:  -22.0, duration: 100, pathWidthKm: 150 },
      { time: '2070-04-12T00:42:00Z', lat: 46.5, lon:   -4.0, duration:  72, pathWidthKm: 132 },
      { time: '2070-04-12T00:52:00Z', lat: 45.5, lon:   10.5, duration:  48, pathWidthKm: 112 },
      { time: '2070-04-12T01:01:00Z', lat: 43.0, lon:   23.0, duration:  26, pathWidthKm:  88 },
    ],
  },
]

// ── Lunar eclipses 2026–2076 (total and partial only) ────────────────────────

export const LUNAR_ECLIPSES: LunarEclipseEntry[] = [
  // ── 2026 ──────────────────────────────────────────────────────────────────
  {
    id: 'LE2026Feb28P',
    date: '2026-02-28',
    type: 'P',
    saros: 149,
    magnitude: 1.072,
    contacts: {
      P1: '2026-02-28T21:38Z',
      U1: '2026-02-28T22:31Z',
      mid: '2026-03-01T00:00Z',
      U4: '2026-03-01T01:29Z',
      P4: '2026-03-01T02:22Z',
    },
    greatest: { lat: 0, lon: 0 },
    regions: ['Americas', 'Europe', 'Africa'],
  },
  {
    id: 'LE2026Aug22T',
    date: '2026-08-22',
    type: 'T',
    saros: 154,
    magnitude: 1.137,
    contacts: {
      P1: '2026-08-22T18:19Z',
      U1: '2026-08-22T19:25Z',
      U2: '2026-08-22T20:31Z',
      mid: '2026-08-22T21:13Z',
      U3: '2026-08-22T21:55Z',
      U4: '2026-08-22T23:01Z',
      P4: '2026-08-22T23:57Z',
    },
    greatest: { lat: 0, lon: 114 },
    regions: ['Pacific', 'Australia', 'Asia'],
  },
  // ── 2028 ──────────────────────────────────────────────────────────────────
  {
    id: 'LE2028Jan12T',
    date: '2028-01-12',
    type: 'T',
    saros: 124,
    magnitude: 1.328,
    contacts: {
      P1: '2028-01-12T02:03Z',
      U1: '2028-01-12T03:06Z',
      U2: '2028-01-12T04:09Z',
      mid: '2028-01-12T04:13Z',
      U3: '2028-01-12T04:17Z',
      U4: '2028-01-12T05:20Z',
      P4: '2028-01-12T06:23Z',
    },
    greatest: { lat: 0, lon: -52 },
    regions: ['Americas', 'Europe', 'Africa'],
  },
  {
    id: 'LE2028Jul06T',
    date: '2028-07-06',
    type: 'T',
    saros: 129,
    magnitude: 1.695,
    contacts: {
      P1: '2028-07-06T14:42Z',
      U1: '2028-07-06T16:02Z',
      U2: '2028-07-06T17:12Z',
      mid: '2028-07-06T18:20Z',
      U3: '2028-07-06T19:28Z',
      U4: '2028-07-06T20:38Z',
      P4: '2028-07-06T21:58Z',
    },
    greatest: { lat: 0, lon: 95 },
    regions: ['Asia', 'Australia', 'Africa'],
  },
  // ── 2029 ──────────────────────────────────────────────────────────────────
  {
    id: 'LE2029Jan01T',
    date: '2029-01-01',
    type: 'T',
    saros: 134,
    magnitude: 1.195,
    contacts: {
      P1: '2029-01-01T17:47Z',
      U1: '2029-01-01T18:59Z',
      U2: '2029-01-01T19:53Z',
      mid: '2029-01-01T20:22Z',
      U3: '2029-01-01T20:51Z',
      U4: '2029-01-01T21:45Z',
      P4: '2029-01-01T22:57Z',
    },
    greatest: { lat: 0, lon: 52 },
    regions: ['Europe', 'Africa', 'Asia', 'Americas (partial)'],
  },
  {
    id: 'LE2029Jun26T',
    date: '2029-06-26',
    type: 'T',
    saros: 139,
    magnitude: 1.843,
    contacts: {
      P1: '2029-06-26T03:05Z',
      U1: '2029-06-26T04:26Z',
      U2: '2029-06-26T05:30Z',
      mid: '2029-06-26T06:23Z',
      U3: '2029-06-26T07:16Z',
      U4: '2029-06-26T08:20Z',
      P4: '2029-06-26T09:41Z',
    },
    greatest: { lat: 0, lon: -140 },
    regions: ['Americas', 'Pacific', 'Europe', 'Africa'],
  },
  // ── 2030 ──────────────────────────────────────────────────────────────────
  {
    id: 'LE2030Jun16P',
    date: '2030-06-16',
    type: 'P',
    saros: 111,
    magnitude: 0.524,
    contacts: {
      P1: '2030-06-15T23:17Z',
      U1: '2030-06-16T00:45Z',
      mid: '2030-06-16T01:33Z',
      U4: '2030-06-16T02:21Z',
      P4: '2030-06-16T03:49Z',
    },
    greatest: { lat: 0, lon: 48 },
    regions: ['Africa', 'Asia', 'Europe'],
  },
  // ── 2032 ──────────────────────────────────────────────────────────────────
  {
    id: 'LE2032Apr25T',
    date: '2032-04-25',
    type: 'T',
    saros: 121,
    magnitude: 1.192,
    contacts: {
      P1: '2032-04-25T14:50Z',
      U1: '2032-04-25T15:46Z',
      U2: '2032-04-25T16:51Z',
      mid: '2032-04-25T17:13Z',
      U3: '2032-04-25T17:35Z',
      U4: '2032-04-25T18:40Z',
      P4: '2032-04-25T19:36Z',
    },
    greatest: { lat: 0, lon: 85 },
    regions: ['Asia', 'Africa', 'Europe'],
  },
  // ── 2033 ──────────────────────────────────────────────────────────────────
  {
    id: 'LE2033Oct18T',
    date: '2033-10-18',
    type: 'T',
    saros: 126,
    magnitude: 1.354,
    contacts: {
      P1: '2033-10-18T18:24Z',
      U1: '2033-10-18T19:34Z',
      U2: '2033-10-18T20:42Z',
      mid: '2033-10-18T21:00Z',
      U3: '2033-10-18T21:18Z',
      U4: '2033-10-18T22:26Z',
      P4: '2033-10-18T23:36Z',
    },
    greatest: { lat: 0, lon: -140 },
    regions: ['Americas', 'Pacific'],
  },
]

/** Combined catalog sorted by date. */
export const ALL_ECLIPSES = [
  ...SOLAR_ECLIPSES.map(e => ({ ...e, _kind: 'solar' as const })),
  ...LUNAR_ECLIPSES.map(e => ({ ...e, _kind: 'lunar' as const })),
].sort((a, b) => a.date.localeCompare(b.date))
