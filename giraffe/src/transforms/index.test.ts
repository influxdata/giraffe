import {getBandColorScale} from './'
import {NINETEEN_EIGHTY_FOUR} from '../constants/colorSchemes'

describe('getBandColorScale', () => {
  const COLOR_TEST_LIMIT = 1000

  it('uses the same color when bandIndexMap has no rowIndices', () => {
    const scale = getBandColorScale(
      {rowIndices: [], lowerIndices: [], upperIndices: []},
      NINETEEN_EIGHTY_FOUR
    )

    const colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    expect(Object.keys(colorsTracker).length).toEqual(1)
    expect(scale(0)).toEqual(scale(1))
    expect(scale(0)).toEqual(scale(2))
    expect(scale(0)).toEqual(scale(100))
  })

  it('uses more than 1 color when bandIndexMap.rowIndices has length greater than 0', () => {
    let scale = getBandColorScale(
      {rowIndices: [0], lowerIndices: [], upperIndices: []},
      NINETEEN_EIGHTY_FOUR
    )
    let colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    expect(Object.keys(colorsTracker).length).toBeGreaterThan(1)

    scale = getBandColorScale(
      {rowIndices: [0, 1], lowerIndices: [], upperIndices: []},
      NINETEEN_EIGHTY_FOUR
    )
    colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    expect(Object.keys(colorsTracker).length).toBeGreaterThan(1)

    scale = getBandColorScale(
      {rowIndices: [0, 1, 2, 3], lowerIndices: [], upperIndices: []},
      NINETEEN_EIGHTY_FOUR
    )
    colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    expect(Object.keys(colorsTracker).length).toBeGreaterThan(1)
  })

  it('upper and lower indicies have no effect on the colors when rowIndices are empty', () => {
    let scale = getBandColorScale(
      {rowIndices: [], lowerIndices: [0, 1], upperIndices: []},
      NINETEEN_EIGHTY_FOUR
    )

    let colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    const lowerWithoutUpper = Object.keys(colorsTracker).length

    scale = getBandColorScale(
      {rowIndices: [], lowerIndices: [], upperIndices: [2, 3]},
      NINETEEN_EIGHTY_FOUR
    )
    colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    const upperWithoutLower = Object.keys(colorsTracker).length

    scale = getBandColorScale(
      {rowIndices: [], lowerIndices: [0, 1], upperIndices: [2, 3]},
      NINETEEN_EIGHTY_FOUR
    )
    colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    const lowerAndUpper = Object.keys(colorsTracker).length

    expect(
      lowerWithoutUpper === upperWithoutLower &&
        lowerWithoutUpper === lowerAndUpper
    ).toEqual(true)
  })

  it('upper and lower indicies have no effect on the colors when rowIndices are not empty', () => {
    let scale = getBandColorScale(
      {rowIndices: [4, 5], lowerIndices: [0, 1], upperIndices: []},
      NINETEEN_EIGHTY_FOUR
    )

    let colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    const lowerWithoutUpper = Object.keys(colorsTracker).length

    scale = getBandColorScale(
      {rowIndices: [4, 5], lowerIndices: [], upperIndices: [2, 3]},
      NINETEEN_EIGHTY_FOUR
    )
    colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    const upperWithoutLower = Object.keys(colorsTracker).length

    scale = getBandColorScale(
      {rowIndices: [4, 5], lowerIndices: [0, 1], upperIndices: [2, 3]},
      NINETEEN_EIGHTY_FOUR
    )
    colorsTracker = {}
    for (let i = 0; i < COLOR_TEST_LIMIT; i += 1) {
      const color = scale(i)
      if (!colorsTracker[color]) {
        colorsTracker[color] = true
      }
    }
    const lowerAndUpper = Object.keys(colorsTracker).length

    expect(
      lowerWithoutUpper === upperWithoutLower &&
        lowerWithoutUpper === lowerAndUpper
    ).toEqual(true)
  })
})
