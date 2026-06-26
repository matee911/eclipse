/**
 * Camera exposure guide for solar eclipse photography.
 * Based on Fred Espenak's "Photographer's Guide to Solar Eclipses".
 * https://eclipse.gsfc.nasa.gov/SEhelp/photography.html
 */

export type EclipsePhase =
  | 'partial-thin'       // 0–25% obscuration
  | 'partial-moderate'   // 25–75% obscuration
  | 'partial-deep'       // 75–99% obscuration
  | 'bailys-beads'       // ±5 s around C2/C3
  | 'diamond-ring'       // ±15 s around C2/C3
  | 'chromosphere'       // ±30 s around C2/C3
  | 'totality-inner'     // inner corona
  | 'totality-outer'     // outer corona
  | 'annular'            // annular ring phase

export interface ExposureSetting {
  phase: EclipsePhase
  label: string
  solarFilter: boolean
  iso: number[]
  aperture: number     // f-stop (e.g. 8 = f/8)
  /** Shutter speeds in seconds (multiple recommended values) */
  shutterSpeeds: number[]
  notes: string
}

const GUIDE: ExposureSetting[] = [
  {
    phase: 'partial-thin',
    label: 'Partial — thin (0–25%)',
    solarFilter: true,
    iso: [100],
    aperture: 8,
    shutterSpeeds: [1 / 1000, 1 / 500],
    notes: 'Solar filter REQUIRED. Sun nearly full strength.',
  },
  {
    phase: 'partial-moderate',
    label: 'Partial — moderate (25–75%)',
    solarFilter: true,
    iso: [100],
    aperture: 8,
    shutterSpeeds: [1 / 1000, 1 / 500, 1 / 250],
    notes: 'Solar filter REQUIRED.',
  },
  {
    phase: 'partial-deep',
    label: 'Partial — deep (75–99%)',
    solarFilter: true,
    iso: [100, 200],
    aperture: 8,
    shutterSpeeds: [1 / 500, 1 / 250, 1 / 125],
    notes: 'Solar filter REQUIRED. Sky noticeably darker.',
  },
  {
    phase: 'bailys-beads',
    label: "Baily's Beads (±5 s of C2/C3)",
    solarFilter: false,
    iso: [100],
    aperture: 8,
    shutterSpeeds: [1 / 1000, 1 / 500, 1 / 250],
    notes: 'REMOVE filter immediately at C2. Replace before C3.',
  },
  {
    phase: 'diamond-ring',
    label: 'Diamond Ring (±15 s of C2/C3)',
    solarFilter: false,
    iso: [100, 200],
    aperture: 8,
    shutterSpeeds: [1 / 500, 1 / 250, 1 / 125],
    notes: 'No filter. Bracket exposures.',
  },
  {
    phase: 'chromosphere',
    label: 'Chromosphere / Prominences',
    solarFilter: false,
    iso: [100, 200],
    aperture: 8,
    shutterSpeeds: [1 / 250, 1 / 125, 1 / 60],
    notes: 'Pinkish layer visible just before/after totality.',
  },
  {
    phase: 'totality-inner',
    label: 'Totality — inner corona',
    solarFilter: false,
    iso: [400],
    aperture: 8,
    shutterSpeeds: [1 / 1000, 1 / 500, 1 / 250, 1 / 125],
    notes: 'No filter during totality. Bracket to capture full corona range.',
  },
  {
    phase: 'totality-outer',
    label: 'Totality — outer corona',
    solarFilter: false,
    iso: [400, 800],
    aperture: 8,
    shutterSpeeds: [1 / 60, 1 / 30, 1 / 15, 1 / 4],
    notes: 'Longer exposures reveal faint outer corona streamers.',
  },
  {
    phase: 'annular',
    label: 'Annular ring phase',
    solarFilter: true,
    iso: [100],
    aperture: 8,
    shutterSpeeds: [1 / 1000, 1 / 500],
    notes: 'Solar filter REQUIRED throughout annular eclipse — never look directly.',
  },
]

/** Look up the exposure guide entry for a given eclipse phase. */
export function exposureForPhase(phase: EclipsePhase): ExposureSetting {
  const entry = GUIDE.find(g => g.phase === phase)
  if (!entry) throw new Error(`Unknown eclipse phase: ${phase}`)
  return entry
}

/**
 * Determine eclipse phase label from obscuration and timing context.
 *
 * @param obscuration  0–1 fraction of solar disc covered
 * @param isTotality   True if observer is inside umbra
 * @param isAnnular    True if eclipse is annular type
 * @param secondsToContact  Negative = seconds since last contact, positive = seconds until next
 */
export function phaseFromObscuration(
  obscuration: number,
  isTotality: boolean,
  isAnnular: boolean,
  secondsToC2orC3?: number,
): EclipsePhase {
  if (isAnnular && isTotality) return 'annular'

  if (isTotality) {
    // Inside totality — recommend bracketing inner/outer corona
    return 'totality-inner'
  }

  // Near-totality contacts — override with special phases
  if (secondsToC2orC3 !== undefined) {
    const abs = Math.abs(secondsToC2orC3)
    if (abs <= 5) return 'bailys-beads'
    if (abs <= 15) return 'diamond-ring'
    if (abs <= 30) return 'chromosphere'
  }

  // Partial phases by obscuration
  if (obscuration < 0.25) return 'partial-thin'
  if (obscuration < 0.75) return 'partial-moderate'
  return 'partial-deep'
}

/** Format a shutter speed as a human-readable fraction string, e.g. "1/500". */
export function formatShutter(seconds: number): string {
  if (seconds >= 1) return `${seconds}s`
  return `1/${Math.round(1 / seconds)}`
}
