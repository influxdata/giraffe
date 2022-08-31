export interface Coordinates {
  lon: number
  lat: number
}

export enum CoordinateEncoding {
  GEO_HASH,
  FIELDS,
}

export interface Track extends Array<number[]> {}

export interface GeoTable {
  getValue(index: number, field: string): number

  getRowCount(): number

  getLatLon(index: number): Coordinates

  getTimeString(index: number): string

  isTruncated(): boolean

  mapTracks<T, U>(
    mapper: (track: Track, options: U, index: number) => T,
    options: U
  ): T[]
}

export interface MinAndMax {
  min?: number
  max?: number
}

export const getMinAndMax = (table: GeoTable, field: string): MinAndMax => {
  const rowCount = table.getRowCount()
  const range: MinAndMax = {}
  for (let i = 0; i < rowCount; i++) {
    const value = table.getValue(i, field)

    if (range.min === undefined || value < range.min) {
      range.min = value
    }

    if (range.max === undefined || value > range.max) {
      range.max = value
    }
  }
  return range
}
