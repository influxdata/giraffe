import {convertLineSpec} from './staticLegend'
import {NINETEEN_EIGHTY_FOUR} from '../../constants/colorSchemes'
import {STATIC_LEGEND_DEFAULTS} from '../../constants/index'
import {lineTransform} from '../../transforms/line'
import {getRandomTable} from '../randomTable'

describe('convertLineSpec', () => {
  it('convertLineSpec', () => {
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
    const lineSpec = lineTransform(
      sampleTable,
      xColKey,
      yColKey,
      fillColumnKeys,
      NINETEEN_EIGHTY_FOUR,
      'overlaid'
    )

    const result = convertLineSpec(
      STATIC_LEGEND_DEFAULTS,
      lineSpec,
      getColumnFormatter,
      yColKey,
      'overlaid'
    )

    expect(result.length).toEqual(fillColumnKeys.length + 1)
    result.forEach(legendColumn => {
      expect(
        [...fillColumnKeys, '_value'].indexOf(legendColumn.key)
      ).toBeGreaterThanOrEqual(0)
      expect(legendColumn.values.length).toEqual(
        numberOfRecords / recordsPerLine
      )
    })
  })
})
