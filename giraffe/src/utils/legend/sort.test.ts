import {sortBandLines, sortIndicesByValueColumn} from './sort'

describe('sortIndicesByValueColumn', () => {
  it('sorts falsy values as last', () => {
    let lineValues = [0, 10, 20, 30]
    let indices = [0, 1, 2, 3, 4, 5, 6]
    expect(sortIndicesByValueColumn(lineValues, indices)).toEqual([
      3,
      2,
      1,
      0,
      4,
      5,
      6,
    ])

    indices = [0, 1, 2, 3]
    lineValues = [undefined, null, 0, NaN]
    expect(sortIndicesByValueColumn(lineValues, indices)).toEqual(indices)

    lineValues = [NaN, undefined, 0, null]
    expect(sortIndicesByValueColumn(lineValues, indices)).toEqual(indices)

    lineValues = [0, 0, 0, 0, 0, 0, 0]
    expect(sortIndicesByValueColumn(lineValues, indices)).toEqual(indices)

    lineValues = [NaN, 1, 0, null]
    expect(sortIndicesByValueColumn(lineValues, indices)).toEqual(indices)

    lineValues = [NaN, 2, 1000, null, 0, 5]
    indices = [5, 4, 3, 2, 1, 0]
    expect(sortIndicesByValueColumn(lineValues, indices)).toEqual([
      2,
      5,
      1,
      4,
      3,
      0,
    ])
  })

  it('sorts all values of a line graph by the latest indices', () => {
    const lineValues = [0, 10, 20, 30]
    const indices = [0, 1, 2, 3]
    expect(sortIndicesByValueColumn(lineValues, indices)).toEqual([3, 2, 1, 0])
  })
})

describe('sortBandLines', () => {
  it('sorts band lines according to "rows" in the bandLineMap', () => {
    const rowFour = [2, 3, 4]
    const rowFive = [12, 13, 14]
    const bandValues = [
      rowFour[0] + 4,
      rowFour[1] + 4,
      rowFour[2] + 4,
      rowFive[0] + 3,
      rowFive[1] + 3,
      rowFive[2] + 3,
      rowFour[0] - 1,
      rowFour[1] - 1,
      rowFour[2] - 1,
      rowFive[0] - 5,
      rowFive[1] - 5,
      rowFive[2] - 5,
      ...rowFour,
      ...rowFive,
    ]
    const bandLineMap = {
      upperLines: [0, 1],
      rowLines: [4, 5],
      lowerLines: [2, 3],
    }
    const latestIndices = {0: 2, 1: 5, 2: 8, 3: 11, 4: 14, 5: 17}
    expect(sortBandLines(bandValues, bandLineMap, latestIndices)).toEqual({
      upperLines: [1, 0],
      rowLines: [5, 4],
      lowerLines: [3, 2],
    })
  })
})
