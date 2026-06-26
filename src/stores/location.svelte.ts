export interface ObserverLocation {
  name: string
  lat: number
  lon: number
}

export const PRESET_CITIES: ObserverLocation[] = [
  { name: 'Cairo', lat: 30.06, lon: 31.25 },
  { name: 'Luxor', lat: 25.69, lon: 32.64 },
  { name: 'Madrid', lat: 40.42, lon: -3.70 },
  { name: 'Reykjavik', lat: 64.13, lon: -21.82 },
  { name: 'London', lat: 51.51, lon: -0.13 },
  { name: 'Warsaw', lat: 52.23, lon: 21.01 },
  { name: 'New York', lat: 40.71, lon: -74.01 },
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { name: 'Dubai', lat: 25.20, lon: 55.27 },
  { name: 'Nairobi', lat: -1.29, lon: 36.82 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
]

let _location = $state<ObserverLocation>(PRESET_CITIES[0])

export const locationStore = {
  get current() { return _location },
  set(loc: ObserverLocation) { _location = loc },
}
