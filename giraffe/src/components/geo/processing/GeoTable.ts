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
  const acc: MinAndMax = {}
  for (let i = 0; i < rowCount; i++) {
    const value = table.getValue(i, field)
    acc.min = acc.min === undefined ? value : value < acc.min ? value : acc.min
    acc.max = acc.max === undefined ? value : value > acc.max ? value : acc.max
  }
  return acc
}
