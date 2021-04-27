import {convertLineSpec} from './staticLegend'
import {NINETEEN_EIGHTY_FOUR} from '../../constants/colorSchemes'
import {STATIC_LEGEND_DEFAULTS} from '../../constants/index'
import {lineTransform} from '../../transforms/line'
import {getRandomTable} from '../fixtures/randomTable'

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

  it('creates certain columns for overlaid line graphs', () => {
    const position = 'overlaid'
    const lineSpec = lineTransform(
      sampleTable,
      xColKey,
      yColKey,
      fillColumnKeys,
      NINETEEN_EIGHTY_FOUR,
      position
    )

    const result = convertLineSpec(
      STATIC_LEGEND_DEFAULTS,
      lineSpec,
      getColumnFormatter,
      yColKey,
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

  it('creates ertain columns for stacked line graphs', () => {
    const position = 'stacked'
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
      STATIC_LEGEND_DEFAULTS,
      lineSpec,
      getColumnFormatter,
      yColKey,
      position
    )

    expect(result.length).toEqual(fillColumnKeys.length + 3)
    result.forEach(legendColumn => {
      expect(
        [...fillColumnKeys, ...addtionalColumKeys, `Latest ${yColKey}`].indexOf(
          legendColumn.name
        )
      ).toBeGreaterThanOrEqual(0)
      expect(legendColumn.values.length).toEqual(
        numberOfRecords / recordsPerLine
      )
    })
  })
})
