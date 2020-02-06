import {getPointsTooltipData} from './tooltip'
import {NINETEEN_EIGHTY_FOUR} from '../constants/colorSchemes'
import {
  FILL,
  STACKED_LINE_CUMULATIVE,
  LINE_COUNT,
} from '../constants/columnKeys'
import {getNominalColorScale, createGroupIDColumn} from '../transforms'
import {lineTransform} from '../transforms/line'
import {createSampleTable, columnKey} from './fixtures/tooltip'

describe('getPointsTooltipData', () => {
  let sampleTable
  const xColKey = '_time'
  const yColKey = '_value'
  const columnFormatter = () => x => String(x)
  let lineSpec
  let fillScale
  let hoveredValues
  let result
  let cumulativeValueColumn

  const setUp = options => {
    const {hoveredRowIndices, position} = options
    sampleTable = createSampleTable(options)
    lineSpec = lineTransform(
      sampleTable,
      xColKey,
      yColKey,
      [columnKey],
      NINETEEN_EIGHTY_FOUR,
      position
    )

    const [fillColumn, fillColumnMap] = createGroupIDColumn(sampleTable, [
      columnKey,
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
      const hoveredRowIndices = [3, 8, 13, 18]
      setUp({
        include_negative: true,
        all_negative: false,
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
        [columnKey],
        fillScale,
        'overlaid',
        lineSpec.lineData
      )
      const singleValueColumn = result.find(column => column.key === yColKey)
      expect(singleValueColumn.values.map(value => Number(value))).toEqual(
        hoveredValues
      )
    })
  })

  describe('tooltip for stacked line graph', () => {
    const position = 'stacked'

    afterEach(() => {
      cumulativeValueColumn = result.find(
        column => column.key === STACKED_LINE_CUMULATIVE
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

      expect(result.find(column => column.key === LINE_COUNT)).toBeTruthy()
    })

    it('should create proper columns when all values are positive numbers', () => {
      const hoveredRowIndices = [0, 5, 10, 15]
      setUp({
        include_negative: false,
        all_negative: false,
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
        [columnKey],
        fillScale,
        'stacked',
        lineSpec.lineData
      )
      const singleValueColumn = result.find(column => column.key === yColKey)
      expect(singleValueColumn).toBeTruthy()
      expect(
        singleValueColumn.values.map(value => Number(value)).reverse()
      ).toEqual(hoveredValues)
    })

    it('should create proper columns when all values are negative numbers', () => {
      const hoveredRowIndices = [1, 6, 11, 16]
      setUp({
        include_negative: true,
        all_negative: true,
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
        [columnKey],
        fillScale,
        'stacked',
        lineSpec.lineData
      )
      const singleValueColumn = result.find(column => column.key === yColKey)

      expect(singleValueColumn).toBeTruthy()
      expect(singleValueColumn.values.map(value => Number(value))).toEqual(
        hoveredValues
      )
    })

    it('should create proper columns when values can be positive or negative', () => {
      const hoveredRowIndices = [2, 7, 12, 17]
      setUp({
        include_negative: true,
        all_negative: false,
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
        [columnKey],
        fillScale,
        'stacked',
        lineSpec.lineData
      )
      expect(result.find(column => column.key === yColKey)).toBeTruthy()
    })
  })
})
