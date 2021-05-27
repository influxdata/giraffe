import {getBandColorScale} from './'
import {NINETEEN_EIGHTY_FOUR} from '../constants/colorSchemes'

describe('getBandColorScale', () => {
  const COLOR_TEST_LIMIT = 1000

  it('uses the same color when bandLineMap has no rowLines', () => {
    const scale = getBandColorScale(
      {rowLines: [], lowerLines: [], upperLines: []},
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

  it('uses more than 1 color when bandLineMap.rowLines has length greater than 0', () => {
    let scale = getBandColorScale(
      {rowLines: [0], lowerLines: [], upperLines: []},
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
      {rowLines: [0, 1], lowerLines: [], upperLines: []},
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
      {rowLines: [0, 1, 2, 3], lowerLines: [], upperLines: []},
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

  it('upper and lower indicies have no effect on the colors when rowLines are empty', () => {
    let scale = getBandColorScale(
      {rowLines: [], lowerLines: [0, 1], upperLines: []},
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
      {rowLines: [], lowerLines: [], upperLines: [2, 3]},
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
      {rowLines: [], lowerLines: [0, 1], upperLines: [2, 3]},
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

  it('upper and lower indicies have no effect on the colors when rowLines are not empty', () => {
    let scale = getBandColorScale(
      {rowLines: [4, 5], lowerLines: [0, 1], upperLines: []},
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
      {rowLines: [4, 5], lowerLines: [], upperLines: [2, 3]},
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
      {rowLines: [4, 5], lowerLines: [0, 1], upperLines: [2, 3]},
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
