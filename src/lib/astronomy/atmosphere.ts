/**
 * Sky darkening model during solar eclipses.
 *
 * Sources:
 *  - Koomen et al. (1952), "Luminance of the Solar Corona"
 *  - Silverman & Mullen (1975), empirical illuminance observations
 *  - Meeus "More Mathematical Astronomy Morsels" Ch. 7
 */

export interface SkyCondition {
  /** Fraction of sky illuminance remaining (0–1). 1 = full sun, ~0 = totality. */
  illuminanceFraction: number
  /** Human-readable description */
  description: string
  /** Whether stars / bright planets are visible to the naked eye */
  starsVisible: boolean
}

/**
 * Estimate sky illuminance fraction from solar obscuration.
 *
 * @param obscuration Fraction of solar disc covered (0 = no eclipse, 1 = total)
 * @param isTotality  True only during totality (umbra over observer)
 */
export function skyDarkening(obscuration: number, isTotality: boolean): SkyCondition {
  if (isTotality) {
    return {
      illuminanceFraction: 0.0001,   // corona ≈ 10⁻⁴ of full sun
      description: 'Night-like: corona and bright stars visible',
      starsVisible: true,
    }
  }

  const f = Math.max(0, Math.min(1, obscuration))
  // Empirical model: sky brightness drops steeply near totality.
  // Uses f^1.5 to account for limb darkening and sky scatter.
  const illuminanceFraction = Math.max(0.001, 1 - Math.pow(f, 1.5))

  let description: string
  let starsVisible: boolean

  if (f < 0.1) {
    description = 'Barely noticeable darkening'
    starsVisible = false
  } else if (f < 0.5) {
    description = 'Slight darkening, like thin clouds'
    starsVisible = false
  } else if (f < 0.8) {
    description = 'Noticeable darkening'
    starsVisible = false
  } else if (f < 0.95) {
    description = 'Twilight-like conditions'
    starsVisible = false
  } else {
    description = 'Deep twilight: bright planets visible'
    starsVisible = true
  }

  return { illuminanceFraction, description, starsVisible }
}

/** Convert illuminance fraction to approximate lux.
 * Reference: ~50 000 lux for typical midday direct sunlight in European/mid-latitude
 * conditions. Peak tropical zenith sun can reach 100k, but 50k better matches
 * real-world lux-meter readings most users experience (MAT-145). */
export function toLux(illuminanceFraction: number): number {
  return Math.round(illuminanceFraction * 50_000)
}

/** Magnitude change in stellar magnitudes (Δm = −2.5·log₁₀(I/I₀)). */
export function deltaMagnitude(illuminanceFraction: number): number {
  return -2.5 * Math.log10(Math.max(illuminanceFraction, 1e-10))
}
