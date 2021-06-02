import {newTable} from '../newTable'
import {convertLineSpec} from './staticLegend'
import {NINETEEN_EIGHTY_FOUR} from '../../constants/colorSchemes'
import {STACKED_LINE_CUMULATIVE} from '../../constants/columnKeys'
import {lineTransform} from '../../transforms/line'
import {getRandomTable} from '../fixtures/randomTable'
import {LinePosition} from '../../types'

describe('convertLineSpec', () => {
  const xColKey = '_time'
  const yColKey = '_value'
  const getColumnFormatter = () => (x: string) => x
  const maxValue = 100
  const numberOfRecords = 20
  const recordsPerLine = 5
  const fillColumnKeys = ['cpu', 'host', 'machine']
  const sampleTable = getRandomTable(
    maxValue,
    false,
    numberOfRecords,
    recordsPerLine,
    fillColumnKeys
  )

  describe('overlaid line graphs', () => {
    const position: LinePosition = 'overlaid'

    it('creates certain columns for overlaid line graphs', () => {
      const lineSpec = lineTransform(
        sampleTable,
        xColKey,
        yColKey,
        fillColumnKeys,
        NINETEEN_EIGHTY_FOUR,
        position
      )

      const result = convertLineSpec(
        lineSpec,
        yColKey,
        getColumnFormatter,
        position
      )

      expect(result.length).toEqual(fillColumnKeys.length + 1)
      result.forEach(legendColumn => {
        expect(
          [...fillColumnKeys, yColKey].indexOf(legendColumn.key)
        ).toBeGreaterThanOrEqual(0)
        expect(legendColumn.values.length).toEqual(
          numberOfRecords / recordsPerLine
        )
      })
    })

    it('sorts the legend data in descending order by the value axis', () => {
      const lineSpec = lineTransform(
        sampleTable,
        xColKey,
        yColKey,
        fillColumnKeys,
        NINETEEN_EIGHTY_FOUR,
        position
      )

      const result = convertLineSpec(
        lineSpec,
        yColKey,
        getColumnFormatter,
        position
      )

      expect(result.length).toBeGreaterThan(0)
      expect(result[0].key).toEqual(yColKey)
      result[0].values.forEach((value, index, values) => {
        if (index > 0 && index < values.length) {
          expect(value).toBeLessThan(values[`${index - 1}`])
        }
      })
    })

    it('sorts the legend data in descending order with the correct values in fill columns', () => {
      const customFillKeys = ['result', '_measurement']
      const table = newTable(8)
        .addColumn('_time', 'dateTime:RFC3339', 'time', [
          1622065487240,
          1622065487240,
          1622065487240,
          1622065487240,
          1622065667240,
          1622065667240,
          1622065667240,
          1622065667240,
        ])
        .addColumn('_value', 'double', 'number', [0, 0, 0, 0, 50, 100, 10, 15])
        .addColumn(customFillKeys[0], 'string', 'string', [
          'second',
          'first',
          'fourth',
          'third',
          'second',
          'first',
          'fourth',
          'third',
        ])
        .addColumn(customFillKeys[1], 'string', 'string', [
          '2nd',
          '1st',
          '4th',
          '3rd',
          '2nd',
          '1st',
          '4th',
          '3rd',
        ])

      const lineSpec = lineTransform(
        table,
        xColKey,
        yColKey,
        customFillKeys,
        NINETEEN_EIGHTY_FOUR,
        position
      )

      const result = convertLineSpec(
        lineSpec,
        yColKey,
        getColumnFormatter,
        position
      )

      expect(
        result.find(legendColumn => legendColumn.key === customFillKeys[0])
      ).toBeDefined()
      expect(
        result.find(legendColumn => legendColumn.key === customFillKeys[1])
      ).toBeDefined()
      result.forEach(legendColumn => {
        if (legendColumn.key === customFillKeys[0]) {
          expect(legendColumn.values).toEqual([
            'first',
            'second',
            'third',
            'fourth',
          ])
        }
        if (legendColumn.key === customFillKeys[1]) {
          expect(legendColumn.values).toEqual(['1st', '2nd', '3rd', '4th'])
        }
      })
    })
  })

  describe('stacked line graphs', () => {
    const position: LinePosition = 'stacked'

    it('creates certain columns for stacked line graphs', () => {
      const addtionalColumKeys = ['cumulative', 'lines']
      const lineSpec = lineTransform(
        sampleTable,
        xColKey,
        yColKey,
        fillColumnKeys,
        NINETEEN_EIGHTY_FOUR,
        position
      )

      const result = convertLineSpec(
        lineSpec,
        yColKey,
        getColumnFormatter,
        position
      )

      expect(result.length).toEqual(fillColumnKeys.length + 3)
      result.forEach(legendColumn => {
        expect(
          [
            ...fillColumnKeys,
            ...addtionalColumKeys,
            `Latest ${yColKey}`,
          ].indexOf(legendColumn.name)
        ).toBeGreaterThanOrEqual(0)
        expect(legendColumn.values.length).toEqual(
          numberOfRecords / recordsPerLine
        )
      })
    })

    it('sorts the legend data in descending order by cumulative of the value axis', () => {
      const lineSpec = lineTransform(
        sampleTable,
        xColKey,
        yColKey,
        fillColumnKeys,
        NINETEEN_EIGHTY_FOUR,
        position
      )

      const result = convertLineSpec(
        lineSpec,
        yColKey,
        getColumnFormatter,
        position
      )

      const cumulativeLegendColumn = result.find(
        legendColumn => legendColumn.key === `_${STACKED_LINE_CUMULATIVE}`
      )
      expect(cumulativeLegendColumn).toBeDefined()
      cumulativeLegendColumn.values.forEach((value, index, values) => {
        if (index > 0 && index < values.length) {
          expect(value).toBeLessThan(values[`${index - 1}`])
        }
      })
    })

    it('sorts the legend data in descending order with the correct values in fill columns', () => {
      const customFillKeys = ['rank', 'place']
      const table = newTable(8)
        .addColumn('_time', 'dateTime:RFC3339', 'time', [
          1622065487240,
          1622065487240,
          1622065487240,
          1622065487240,
          1622065667240,
          1622065667240,
          1622065667240,
          1622065667240,
        ])
        .addColumn('_value', 'system', 'number', [
          10,
          20,
          30,
          40,
          10,
          20,
          30,
          40,
        ])
        .addColumn(customFillKeys[0], 'string', 'string', [
          'first',
          'second',
          'third',
          'fourth',
          'first',
          'second',
          'third',
          'fourth',
        ])
        .addColumn(customFillKeys[1], 'string', 'string', [
          '1st',
          '2nd',
          '3rd',
          '4th',
          '1st',
          '2nd',
          '3rd',
          '4th',
        ])

      const lineSpec = lineTransform(
        table,
        xColKey,
        yColKey,
        customFillKeys,
        NINETEEN_EIGHTY_FOUR,
        position
      )

      const result = convertLineSpec(
        lineSpec,
        yColKey,
        getColumnFormatter,
        position
      )

      expect(
        result.find(legendColumn => legendColumn.key === customFillKeys[0])
      ).toBeDefined()
      expect(
        result.find(legendColumn => legendColumn.key === customFillKeys[1])
      ).toBeDefined()

      result.forEach(legendColumn => {
        if (legendColumn.key === customFillKeys[0]) {
          expect(legendColumn.values).toEqual([
            'fourth',
            'third',
            'second',
            'first',
          ])
        }
        if (legendColumn.key === customFillKeys[1]) {
          expect(legendColumn.values).toEqual(['4th', '3rd', '2nd', '1st'])
        }
      })
    })
  })
})
