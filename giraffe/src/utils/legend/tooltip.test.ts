import {getPointsTooltipData} from './tooltip'
import {convertLineSpec} from './staticLegend'
import {NINETEEN_EIGHTY_FOUR} from '../../constants/colorSchemes'
import {
  FILL,
  STACKED_LINE_CUMULATIVE,
  LINE_COUNT,
} from '../../constants/columnKeys'
import {getNominalColorScale, createGroupIDColumn} from '../../transforms'
import {lineTransform} from '../../transforms/line'
import {
  createSampleTable,
  COLUMN_KEY,
  POINT_KEY,
  HOST_KEY,
} from '../fixtures/randomTable'
import {LayerTypes, LineLayerSpec, ScatterLayerSpec} from '../../types'

describe('getPointsTooltipData', () => {
  let sampleTable
  const xColKey = '_time'
  const yColKey = '_value'
  const columnFormatter = () => x => String(x)
  const pointFormatter = () => x => String(x)
  let lineSpec
  let fillScale
  let result
  let cumulativeValueColumn

  const numberOfRecords = 1000
  const recordsPerLine = 10
  let startingIndex

  const setUp = options => {
    const {plotType = 'line', position, ...tableOptions} = options
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
    sampleTable = sampleTable.addColumn(FILL, 'system', 'number', fillColumn)

    const fillColumnFromSampleTable = sampleTable.getColumn(FILL, 'number')
    fillColumn.forEach((item, index) =>
      expect(item).toEqual(fillColumnFromSampleTable[index])
    )
  }

  describe('tooltip for overlaid line graph', () => {
    const position = 'overlaid'

    it('should have a value column that is sorted in descending order', () => {
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
        'overlaid'
      )
      const singleValueColumn = result.find(column => column.name === yColKey)
      expect(
        singleValueColumn.values.every((value, index) => {
          if (index === 0) {
            return true
          }
          return Number(value) <= Number(singleValueColumn.values[index - 1])
        })
      ).toEqual(true)
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
        position,
        lineSpec.stackedDomainValueColumn
      )
      const cumulativeValueColumn = result.find(
        column => column.name === STACKED_LINE_CUMULATIVE
      )
      expect(cumulativeValueColumn).toBeTruthy()
      expect(
        cumulativeValueColumn.values.every((cumulativeValue, index) => {
          if (index === 0) {
            return true
          }
          return (
            Number(cumulativeValue) <=
            Number(cumulativeValueColumn.values[index - 1])
          )
        })
      ).toEqual(true)
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
        position,
        lineSpec.stackedDomainValueColumn
      )
      const cumulativeValueColumn = result.find(
        column => column.name === STACKED_LINE_CUMULATIVE
      )
      expect(cumulativeValueColumn).toBeTruthy()
      expect(
        cumulativeValueColumn.values.every((cumulativeValue, index) => {
          if (index === 0) {
            return true
          }
          return (
            Number(cumulativeValue) <=
            Number(cumulativeValueColumn.values[index - 1])
          )
        })
      ).toEqual(true)
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
        position,
        lineSpec.stackedDomainValueColumn
      )
      const cumulativeValueColumn = result.find(
        column => column.name === STACKED_LINE_CUMULATIVE
      )
      expect(cumulativeValueColumn).toBeTruthy()
      expect(
        cumulativeValueColumn.values.every((cumulativeValue, index) => {
          if (index === 0) {
            return true
          }
          return (
            Number(cumulativeValue) <=
            Number(cumulativeValueColumn.values[index - 1])
          )
        })
      ).toEqual(true)
    })
  })

  describe('tooltip and static legend at the edge of the graph', () => {
    it('should have the same columns and order for tooltip and static legend in an overlaid line graph', () => {
      lineSpec = {} as LineLayerSpec
      const position = 'overlaid'
      setUp({
        include_negative: true,
        all_negative: false,
        numberOfRecords,
        recordsPerLine,
        position,
      })
      const overlaidLineGraphStaticLegend = convertLineSpec(
        lineSpec,
        yColKey,
        columnFormatter,
        position
      )
      const overlaidLineGraphTooltip = getPointsTooltipData(
        Object.values(lineSpec.columnGroupMaps.latestIndices),
        sampleTable,
        xColKey,
        yColKey,
        FILL,
        columnFormatter,
        [COLUMN_KEY],
        fillScale,
        position,
        lineSpec.stackedDomainValueColumn
      )

      overlaidLineGraphStaticLegend.forEach(staticLegendColumn => {
        const matchingTooltipColumn = overlaidLineGraphTooltip.find(
          tooltipColumn => {
            return (
              staticLegendColumn.key === tooltipColumn.key &&
              staticLegendColumn.name.includes(tooltipColumn.name)
            )
          }
        )
        expect(matchingTooltipColumn).toBeDefined()
        expect(
          staticLegendColumn.colors.every(
            (color, index) => color === matchingTooltipColumn.colors[index]
          )
        ).toEqual(true)
        expect(
          staticLegendColumn.values.every(
            (value, index) => value === matchingTooltipColumn.values[index]
          )
        ).toEqual(true)
      })
    })

    it('should have the same columns and order for tooltip and static legend in a stacked line graph', () => {
      lineSpec = {} as LineLayerSpec
      const position = 'stacked'
      setUp({
        include_negative: true,
        all_negative: false,
        numberOfRecords,
        recordsPerLine,
        position,
      })
      const stackedLineGraphStaticLegend = convertLineSpec(
        lineSpec,
        yColKey,
        columnFormatter,
        position
      )
      const stackedLineGraphTooltip = getPointsTooltipData(
        Object.values(lineSpec.columnGroupMaps.latestIndices),
        sampleTable,
        xColKey,
        yColKey,
        FILL,
        columnFormatter,
        [COLUMN_KEY],
        fillScale,
        position,
        lineSpec.stackedDomainValueColumn
      )

      stackedLineGraphStaticLegend.forEach(staticLegendColumn => {
        const matchingTooltipColumn = stackedLineGraphTooltip.find(
          tooltipColumn => {
            return (
              staticLegendColumn.key === tooltipColumn.key &&
              staticLegendColumn.name.includes(tooltipColumn.name)
            )
          }
        )
        expect(matchingTooltipColumn).toBeDefined()
        expect(
          staticLegendColumn.colors.every(
            (color, index) => color === matchingTooltipColumn.colors[index]
          )
        ).toEqual(true)
        expect(
          staticLegendColumn.values.every(
            (value, index) => value === matchingTooltipColumn.values[index]
          )
        ).toEqual(true)
      })
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
        plotType: LayerTypes.Scatter,
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
