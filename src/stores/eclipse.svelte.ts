import type { SolarEclipseEntry, LunarEclipseEntry } from '../lib/data/types.js'
import { SOLAR_ECLIPSES, LUNAR_ECLIPSES } from '../lib/data/catalog.js'

type Filter = 'all' | 'solar' | 'lunar'

const allSolar = SOLAR_ECLIPSES.map(e => ({ ...e, _kind: 'solar' as const }))
const allLunar = LUNAR_ECLIPSES.map(e => ({ ...e, _kind: 'lunar' as const }))

export type CatalogEntry =
  | (SolarEclipseEntry & { _kind: 'solar' })
  | (LunarEclipseEntry & { _kind: 'lunar' })

const all: CatalogEntry[] = [...allSolar, ...allLunar].sort((a, b) =>
  a.date.localeCompare(b.date),
)

let _selected = $state<CatalogEntry | null>(null)
let _filter = $state<Filter>('all')

export const eclipseStore = {
  get all() { return all },
  get filtered() {
    if (_filter === 'solar') return all.filter(e => e._kind === 'solar')
    if (_filter === 'lunar') return all.filter(e => e._kind === 'lunar')
    return all
  },
  get selected() { return _selected },
  get filter() { return _filter },
  select(entry: CatalogEntry | null) { _selected = entry },
  setFilter(f: Filter) { _filter = f },
}
