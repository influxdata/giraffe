import {formatLegendValues} from './format'

describe('formatLegendValues', () => {
  const formatter = value => String(value)

  it('handles undefined and null indexes as empty output', () => {
    expect(formatLegendValues([1, 2, 3], undefined, formatter)).toEqual([])
    expect(formatLegendValues([1, 2, 3], null, formatter)).toEqual([])
  })

  it('uses the formatter on every value given by the indexes', () => {
    const values = [1, 2, 3]
    expect(formatLegendValues(values, [0], formatter)).toEqual([
      formatter(values[0]),
    ])
    expect(formatLegendValues(values, [1], formatter)).toEqual([
      formatter(values[1]),
    ])
    expect(formatLegendValues(values, [2], formatter)).toEqual([
      formatter(values[2]),
    ])
    expect(formatLegendValues(values, [3], formatter)).toEqual([
      formatter(values[3]),
    ])
  })

  it('uses the formatter even for falsy values', () => {
    let falsyValue: any
    expect(formatLegendValues([falsyValue], [0], formatter)).toEqual([
      formatter(falsyValue),
    ])

    falsyValue = false
    expect(formatLegendValues([falsyValue], [0], formatter)).toEqual([
      formatter(falsyValue),
    ])

    falsyValue = 0
    expect(formatLegendValues([falsyValue], [falsyValue], formatter)).toEqual([
      formatter(0),
    ])

    falsyValue = NaN
    expect(formatLegendValues([falsyValue], [0], formatter)).toEqual([
      formatter(falsyValue),
    ])
  })
})
