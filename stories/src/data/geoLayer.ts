import {newTable, Table} from '../../../giraffe/src'
import memoizeOne from 'memoize-one'
import {getRandomOrFixed, nowOrFixed} from './utils'

export const getGeoTable = (fixed: boolean, numberOfRecords = 200) => {
  const TIME_COL = []
  const VALUE1_COL = []
  const VALUE2_COL = []
  const LAT_COL = []
  const LON_COL = []
  for (let i = 0; i < numberOfRecords; i += 1) {
    VALUE1_COL.push(getRandomOrFixed(fixed, i, 0, 7))
    VALUE2_COL.push(getRandomOrFixed(fixed, i, 20, 80))
    LAT_COL.push(getRandomOrFixed(fixed, i, 37, 43))
    LON_COL.push(getRandomOrFixed(fixed, i, -81, -75))
    TIME_COL.push(nowOrFixed(fixed) + i * 1000 * 60)
  }

  return newTable(numberOfRecords)
    .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
    .addColumn('magnitude', 'double', 'number', VALUE1_COL)
    .addColumn('duration', 'double', 'number', VALUE2_COL)
    .addColumn('lat', 'double', 'number', LAT_COL)
    .addColumn('lon', 'double', 'number', LON_COL)
}

const addTrack = (fixed: boolean, data, startLat: number, startLon: number) => {
  const tid = Math.floor(Math.random() * 1000)
  let lat = startLat,
    lon = startLon
  for (let i = 0; i < 10; i++) {
    const time = nowOrFixed(fixed) + i * 1000 * 60
    lat += Math.random() * 1.5
    lon += Math.random() * 1.5
    data.push({time, lat, lon, tid})
  }
}

export const geoTracks = memoizeOne(
  (fixed: boolean, lon: number, lat: number, count = 1): Table => {
    const data = []
    for (let i = 0; i < count; i++) {
      addTrack(fixed, data, lat - 4, lon - 6)
    }
    return newTable(data.length)
      .addColumn(
        '_time',
        'dateTime:RFC3339',
        'time',
        data.map(x => x.time)
      )
      .addColumn(
        'lat',
        'double',
        'number',
        data.map(x => x.lat)
      )
      .addColumn(
        'lon',
        'double',
        'number',
        data.map(x => x.lon)
      )
      .addColumn(
        'table',
        'double',
        'number',
        data.map(x => x.tid)
      )
  }
)
