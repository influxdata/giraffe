import {mosaicTransform} from './mosaic'
import {TIME, VALUE} from '../constants/columnKeys'
import {NINETEEN_EIGHTY_FOUR} from '../constants/colorSchemes'
import {newTable} from '../utils/newTable'

describe('mosaic transformation', () => {
  const timeCol = [
    1612482900000,
    1612483000000,
    1612483100000,
    1612483200000,
    1612483300000,
    1612483400000,
  ]
  const valueCol = ['red', 'green', 'green', 'yellow', 'red', 'yellow']
  const cpuCol = ['cpu0', 'cpu1', 'cpu2', 'cpu1', 'cpu0', 'cpu2']
  const hostCol = ['host-A', 'host-A', 'host-B', 'host-A', 'host-B', 'host-B']
  const machineCol = ['pc1', 'pc2', 'pc3', 'pc1', 'pc2', 'pc3']
  const testTable = newTable(6)
    .addColumn('_time', 'dateTime:RFC3339', 'time', timeCol)
    .addColumn('_value', 'string', 'string', valueCol)
    .addColumn('cpu', 'string', 'string', cpuCol)
    .addColumn('host', 'string', 'string', hostCol)
    .addColumn('machine', 'string', 'string', machineCol)
  const xColumnKey = TIME
  const xDomain = [timeCol[0], timeCol[timeCol.length - 1]]
  const fillColKeys = [VALUE]
  const colors = NINETEEN_EIGHTY_FOUR

  let yColumnKeys: Array<string>
  let yLabelColumns: Array<string>
  let yLabelColumnSeparator: string

  it('should handle falsy value, empty array, and empty strings for yColumnKeys and yLabelColumns', () => {
    yColumnKeys = undefined
    yLabelColumns = undefined
    yLabelColumnSeparator = undefined
    let result = mosaicTransform(
      testTable,
      xColumnKey,
      yColumnKeys,
      yLabelColumns,
      yLabelColumnSeparator,
      xDomain,
      fillColKeys,
      colors
    )
    expect(result.type).toEqual('mosaic')
    expect(result.ySeries.length).toEqual(result.yTicks.length)
    expect(result.yTicks.length).toEqual(1)
    expect(result.yTicks[0]).toEqual('')

    yColumnKeys = []
    yLabelColumns = []
    result = mosaicTransform(
      testTable,
      xColumnKey,
      yColumnKeys,
      yLabelColumns,
      yLabelColumnSeparator,
      xDomain,
      fillColKeys,
      colors
    )
    expect(result.ySeries.length).toEqual(result.yTicks.length)
    expect(result.yTicks.length).toEqual(1)
    expect(result.yTicks[0]).toEqual('')

    yColumnKeys = ['']
    yLabelColumns = ['']
    result = mosaicTransform(
      testTable,
      xColumnKey,
      yColumnKeys,
      yLabelColumns,
      yLabelColumnSeparator,
      xDomain,
      fillColKeys,
      colors
    )
    expect(result.ySeries.length).toEqual(result.yTicks.length)
    expect(result.yTicks.length).toEqual(1)
    expect(result.yTicks[0]).toEqual('')

    yColumnKeys = ['', '']
    yLabelColumns = ['', '']
    result = mosaicTransform(
      testTable,
      xColumnKey,
      yColumnKeys,
      yLabelColumns,
      yLabelColumnSeparator,
      xDomain,
      fillColKeys,
      colors
    )
    expect(result.ySeries.length).toEqual(result.yTicks.length)
    expect(result.yTicks.length).toEqual(1)
    expect(result.yTicks[0]).toEqual('')
  })

  it('should output correct spec when yColumnKeys and yLabelColumns are the same', () => {
    yColumnKeys = ['cpu', 'host']
    yLabelColumns = ['cpu', 'host']
    yLabelColumnSeparator = ''

    const result = mosaicTransform(
      testTable,
      xColumnKey,
      yColumnKeys,
      yLabelColumns,
      yLabelColumnSeparator,
      xDomain,
      fillColKeys,
      colors
    )

    expect(result.type).toEqual('mosaic')
    expect(result.ySeries.length).toEqual(result.yTicks.length)
    expect(result.yDomain).toEqual([0, result.ySeries.length])
    expect(
      result.yTicks.every((tick, index) => {
        return tick === result.ySeries[index]
      })
    ).toEqual(true)
  })

  it('should include the yLabelColumnSeparator in yTicks', () => {
    yColumnKeys = ['cpu', 'host']
    yLabelColumns = ['cpu', 'host']
    yLabelColumnSeparator = ' + '

    const result = mosaicTransform(
      testTable,
      xColumnKey,
      yColumnKeys,
      yLabelColumns,
      yLabelColumnSeparator,
      xDomain,
      fillColKeys,
      colors
    )

    expect(
      result.yTicks.every(tick => tick.indexOf(yLabelColumnSeparator) > -1)
    ).toEqual(true)
  })

  it('should ignore yLabelColumns elements that are not in yColumnKeys', () => {
    yColumnKeys = ['cpu', 'host']
    yLabelColumns = ['cpu', 'machine']
    yLabelColumnSeparator = ''

    const result = mosaicTransform(
      testTable,
      xColumnKey,
      yColumnKeys,
      yLabelColumns,
      yLabelColumnSeparator,
      xDomain,
      fillColKeys,
      colors
    )

    expect(result.ySeries.length).toEqual(result.yTicks.length)
    expect(result.yDomain).toEqual([0, result.ySeries.length])
    expect(
      result.yTicks.every((tick, index) => {
        return (
          machineCol.indexOf('tick') === -1 &&
          tick.length < result.ySeries[index].length
        )
      })
    ).toEqual(true)
  })
})
