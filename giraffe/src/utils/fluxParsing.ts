import Papa from 'papaparse'
import uuid from 'uuid'

import {FluxTable} from '../types'
import {get} from './get'
import {groupBy} from './groupBy'
import {escapeCommas} from './escape'

export const parseResponseError = (response: string): FluxTable[] => {
  const data = Papa.parse(response.trim()).data as string[][]

  return [
    {
      id: uuid.v4(),
      name: 'Error',
      result: '',
      groupKey: {},
      dataTypes: {},
      data,
    },
  ]
}

/*
  A Flux CSV response can contain multiple CSV files each joined by a newline.
  This function splits up a CSV response into these individual CSV files.

  See https://github.com/influxdata/flux/blob/master/docs/SPEC.md#multiple-tables.
*/
export const parseChunks = (response: string): string[] => {
  const trimmedResponse = response.trim()

  if (trimmedResponse === '') {
    return []
  }

  // Split the response into separate chunks whenever we encounter:
  //
  // 1. A newline
  // 2. Followed by any amount of whitespace
  // 3. Followed by a newline
  // 4. Followed by a `#` character
  //
  // The last condition is [necessary][0] for handling CSV responses with
  // values containing newlines.
  //
  // [0]: https://github.com/influxdata/influxdb/issues/15017

  // use regex lookahead
  const chunks = trimmedResponse
    .split(/\n\s*\n#(?=datatype|group|default)/)
    .map((chunk, chunkNumber) => (chunkNumber === 0 ? chunk : `#${chunk}`)) // Add back the `#` characters that were removed by splitting

  return chunks
}

export const parseResponse = (response: string): FluxTable[] => {
  const chunks = parseChunks(response)
  const tables = chunks.reduce((acc, chunk) => {
    return [...acc, ...parseTables(chunk)]
  }, [])

  return tables
}

export const parseTables = (responseChunk: string): FluxTable[] => {
  const linesData = Papa.parse(responseChunk).data
  const lines: string[] = linesData.map(line =>
    line.map(escapeCommas).join(',')
  )
  const annotationLines: string = lines
    .filter(line => line.startsWith('#'))
    .join('\n')
    .trim()

  if (!annotationLines) {
    throw new Error('Unable to extract annotation data')
  }

  const nonAnnotationLines: string = lines
    .filter(line => !line.startsWith('#'))
    .join('\n')
    .trim()

  if (!nonAnnotationLines) {
    // A response may be truncated on an arbitrary line. This guards against
    // the case where a response is truncated on annotation data
    return []
  }

  const nonAnnotationData = Papa.parse(nonAnnotationLines).data
  const annotationData = Papa.parse(annotationLines).data
  const headerRow = nonAnnotationData[0]
  const tableColIndex = headerRow.findIndex(h => h === 'table')
  const resultColIndex = headerRow.findIndex(h => h === 'result')

  interface TableGroup {
    [tableId: string]: string[]
  }

  const tableGroup: TableGroup = groupBy(
    nonAnnotationData.slice(1),
    row => row[tableColIndex]
  )
  // Group rows by their table id
  const tablesData = Object.values(tableGroup)

  const groupRow = annotationData.find(row => row[0] === '#group')
  const defaultsRow = annotationData.find(row => row[0] === '#default')
  const dataTypeRow = annotationData.find(row => row[0] === '#datatype')

  const groupKeyIndices = groupRow.reduce((acc, value, i) => {
    if (value === 'true') {
      return [...acc, i]
    }

    return acc
  }, [])

  const tables = tablesData.map(tableData => {
    const dataRow = get(tableData, '0', defaultsRow)

    const result: string =
      get(dataRow, resultColIndex, '') || get(defaultsRow, resultColIndex, '')

    const groupKey = groupKeyIndices.reduce((acc, i) => {
      return {...acc, [headerRow[i]]: get(dataRow, i, '')}
    }, {})

    const name = Object.entries(groupKey)
      .filter(([k]) => !['_start', '_stop'].includes(k))
      .map(([k, v]) => `${k}=${v}`)
      .join(' ')

    const dataTypes = dataTypeRow.reduce(
      (acc, dataType, i) => ({
        ...acc,
        [headerRow[i]]: dataType,
      }),
      {}
    )
    return {
      id: uuid.v4(),
      data: [[...headerRow], ...tableData],
      name,
      result,
      groupKey,
      dataTypes,
    } as FluxTable
  })

  return tables
}
