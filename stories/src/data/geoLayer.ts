import {newTable, Table} from '../../../giraffe/src'
import memoizeOne from 'memoize-one'

const now = Date.now()

function getRandomNumber(center: number, spread: number) {
  return center + (0.5 - Math.random()) * spread * 2
}

const createDataColumns = (numberOfRecords: number) => {
  const TIME_COL = []
  const VALUE1_COL = []
  const VALUE2_COL = []
  const LAT_COL = []
  const LON_COL = []
  for (let i = 0; i < numberOfRecords; i += 1) {
    VALUE1_COL.push(getRandomNumber(3.5, 3.5))
    VALUE2_COL.push(getRandomNumber(50, 30))
    LAT_COL.push(getRandomNumber(40, 3))
    LON_COL.push(getRandomNumber(-78, 3))
    TIME_COL.push(now + i * 1000 * 60)
  }
  return {TIME_COL, VALUE1_COL, VALUE2_COL, LAT_COL, LON_COL}
}

export const geoTable = memoizeOne(
  (numberOfRecords = 200): Table => {
    const columns = createDataColumns(numberOfRecords)
    return newTable(numberOfRecords)
      .addColumn('_time', 'dateTime:RFC3339', 'time', columns.TIME_COL)
      .addColumn('magnitude', 'double', 'number', columns.VALUE1_COL)
      .addColumn('duration', 'double', 'number', columns.VALUE2_COL)
      .addColumn('lat', 'double', 'number', columns.LAT_COL)
      .addColumn('lon', 'double', 'number', columns.LON_COL)
  }
)

const addTrack = (data, startLat: number, startLon: number) => {
  const tid = Math.floor(Math.random() * 1000)
  let lat = startLat,
    lon = startLon
  for (let i = 0; i < 10; i++) {
    const time = now + i * 1000 * 60
    lat += Math.random() * 1.5
    lon += Math.random() * 1.5
    data.push({time, lat, lon, tid})
  }
}

export const geoTracks = memoizeOne(
  (lon: number, lat: number, count = 1): Table => {
    const data = []
    for (let i = 0; i < count; i++) {
      addTrack(data, lat - 4, lon - 6)
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
