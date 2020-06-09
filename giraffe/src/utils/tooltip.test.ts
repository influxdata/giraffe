import {getPointsTooltipData} from './tooltip'
import {NINETEEN_EIGHTY_FOUR} from '../constants/colorSchemes'
import {
  FILL,
  STACKED_LINE_CUMULATIVE,
  LINE_COUNT,
} from '../constants/columnKeys'
import {getNominalColorScale, createGroupIDColumn} from '../transforms'
import {lineTransform} from '../transforms/line'
import {
  createSampleTable,
  COLUMN_KEY,
  POINT_KEY,
  HOST_KEY,
} from './fixtures/tooltip'
import {LineLayerSpec, ScatterLayerSpec} from '../types'

describe('getPointsTooltipData', () => {
  let sampleTable
  const xColKey = '_time'
  const yColKey = '_value'
  const columnFormatter = () => x => String(x)
  const pointFormatter = () => x => String(x)
  let lineSpec
  let fillScale
  let hoveredValues
  let result
  let cumulativeValueColumn

  const numberOfRecords = 1000
  const recordsPerLine = 10
  let startingIndex

  const setUp = options => {
    const {
      plotType = 'line',
      hoveredRowIndices,
      position,
      ...tableOptions
    } = options
    sampleTable = createSampleTable({...tableOptions, plotType})
    if (plotType === 'line') {
      lineSpec = lineTransform(
        sampleTable,
        xColKey,
        yColKey,
        [COLUMN_KEY],
        NINETEEN_EIGHTY_FOUR,
        position
      )
    }

    const [fillColumn, fillColumnMap] = createGroupIDColumn(sampleTable, [
      plotType === 'line' ? COLUMN_KEY : HOST_KEY,
    ])
    fillScale = getNominalColorScale(fillColumnMap, NINETEEN_EIGHTY_FOUR)
    sampleTable = sampleTable.addColumn(FILL, 'number', fillColumn)

    const fillColumnFromSampleTable = sampleTable.getColumn(FILL, 'number')
    fillColumn.forEach((item, index) =>
      expect(item).toEqual(fillColumnFromSampleTable[index])
    )

    const allValues = sampleTable.getColumn('_value')
    hoveredValues = hoveredRowIndices.map(i => allValues[i])
  }

  describe('tooltip for overlaid line graph', () => {
    const position = 'overlaid'

    it('should have a value column that is not necessarily sorted', () => {
      lineSpec = {} as LineLayerSpec
      startingIndex = 3
      const hoveredRowIndices = []
      for (let i = startingIndex; i < numberOfRecords; i += recordsPerLine) {
        hoveredRowIndices.push(i)
      }
      setUp({
        include_negative: true,
        all_negative: false,
        numberOfRecords,
        recordsPerLine,
        hoveredRowIndices,
        position,
      })
      result = getPointsTooltipData(
        hoveredRowIndices,
        sampleTable,
        xColKey,
        yColKey,
        FILL,
        columnFormatter,
        [COLUMN_KEY],
        fillScale,
        'overlaid',
        lineSpec.lineData
      )
      const singleValueColumn = result.find(column => column.name === yColKey)
      expect(singleValueColumn.values.map(value => Number(value))).toEqual(
        hoveredValues
      )
    })
  })

  describe('tooltip for stacked line graph', () => {
    const position = 'stacked'

    afterEach(() => {
      const totalColumns = result.length
      const totalRows = numberOfRecords / recordsPerLine
      const colorsCounter = {}

      // color is the same across a row
      for (let i = 0; i < totalRows; i += 1) {
        for (let j = 0; j < totalColumns; j += 1) {
          const rowColor = result[0].colors[i]
          expect(rowColor === result[j].colors[i])
        }
      }
      result.forEach(column => {
        const {colors} = column
        colors.forEach(color => {
          if (!colorsCounter[color]) {
            colorsCounter[color] = 0
          }
          colorsCounter[color] += 1
        })
      })

      // number of different colors should equal number of rows
      expect(Object.keys(colorsCounter).length).toEqual(totalRows)

      // each column should have color
      expect(
        Object.values(colorsCounter).every(
          colorCount => colorCount === totalColumns
        )
      ).toEqual(true)

      cumulativeValueColumn = result.find(
        column => column.name === STACKED_LINE_CUMULATIVE
      )
      expect(cumulativeValueColumn).toBeTruthy()
      expect(
        cumulativeValueColumn.values.every((value, index, arr) => {
          if (index === 0) {
            return true
          }
          return Number(arr[index - 1]) >= Number(value)
        })
      ).toEqual(true)

      expect(result.find(column => column.name === LINE_COUNT)).toBeTruthy()
    })

    it('should create proper columns when all values are positive numbers', () => {
      lineSpec = {} as LineLayerSpec
      startingIndex = 0
      const hoveredRowIndices = []
      for (let i = startingIndex; i < numberOfRecords; i += recordsPerLine) {
        hoveredRowIndices.push(i)
      }
      setUp({
        include_negative: false,
        all_negative: false,
        numberOfRecords,
        recordsPerLine,
        hoveredRowIndices,
        position,
      })
      result = getPointsTooltipData(
        hoveredRowIndices,
        sampleTable,
        xColKey,
        yColKey,
        FILL,
        columnFormatter,
        [COLUMN_KEY],
        fillScale,
        'stacked',
        lineSpec.lineData
      )
      const singleValueColumn = result.find(column => column.name === yColKey)
      expect(singleValueColumn).toBeTruthy()
      expect(
        singleValueColumn.values.map(value => Number(value)).reverse()
      ).toEqual(hoveredValues)
    })

    it('should create proper columns when all values are negative numbers', () => {
      lineSpec = {} as LineLayerSpec
      startingIndex = 1
      const hoveredRowIndices = []
      for (let i = startingIndex; i < numberOfRecords; i += recordsPerLine) {
        hoveredRowIndices.push(i)
      }
      setUp({
        include_negative: true,
        all_negative: true,
        numberOfRecords,
        recordsPerLine,
        hoveredRowIndices,
        position,
      })
      result = getPointsTooltipData(
        hoveredRowIndices,
        sampleTable,
        xColKey,
        yColKey,
        FILL,
        columnFormatter,
        [COLUMN_KEY],
        fillScale,
        'stacked',
        lineSpec.lineData
      )
      const singleValueColumn = result.find(column => column.name === yColKey)

      expect(singleValueColumn).toBeTruthy()
      expect(singleValueColumn.values.map(value => Number(value))).toEqual(
        hoveredValues
      )
    })

    it('should create proper columns when values can be positive or negative', () => {
      lineSpec = {} as LineLayerSpec
      startingIndex = 2
      const hoveredRowIndices = []
      for (let i = startingIndex; i < numberOfRecords; i += recordsPerLine) {
        hoveredRowIndices.push(i)
      }
      setUp({
        include_negative: true,
        all_negative: false,
        numberOfRecords,
        recordsPerLine,
        hoveredRowIndices,
        position,
      })
      result = getPointsTooltipData(
        hoveredRowIndices,
        sampleTable,
        xColKey,
        yColKey,
        FILL,
        columnFormatter,
        [COLUMN_KEY],
        fillScale,
        'stacked',
        lineSpec.lineData
      )
      expect(result.find(column => column.name === yColKey)).toBeTruthy()
    })
  })

  describe('tooltip for scattered plot', () => {
    it('should create the proper columns each with length 1 when optional parameters are missing', () => {
      lineSpec = {} as ScatterLayerSpec
      const randomIndex = Math.floor(Math.random() * numberOfRecords)
      const hoveredRowIndices = [randomIndex]
      setUp({
        numberOfRecords,
        recordsPerLine,
        hoveredRowIndices,
        plotType: 'scatter',
      })
      result = getPointsTooltipData(
        hoveredRowIndices,
        sampleTable,
        xColKey,
        yColKey,
        FILL,
        pointFormatter,
        [POINT_KEY, HOST_KEY],
        fillScale
      )
      expect(sampleTable.getColumn(POINT_KEY)).toBeTruthy()
      expect(sampleTable.getColumn(HOST_KEY)).toBeTruthy()
      expect(
        result.every(col => col.values && col.values.length === 1)
      ).toEqual(true)
    })
  })
})
