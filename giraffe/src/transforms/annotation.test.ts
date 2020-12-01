import {annotationTransform} from './annotation'
import {AnnotationMark} from '../types'
import {newTable} from '../utils/newTable'
import {TIME, VALUE} from '../constants/columnKeys'

describe('annotation transform', () => {
  const table = newTable(3)
    .addColumn('_time', 'dateTime:RFC3339', 'time', [
      1606862528103,
      1606862628103,
      1606862728103,
    ])
    .addColumn('_value', 'system', 'number', [0, 5, 10])
    .addColumn('cpu', 'string', 'string', ['cpu0', 'cpu0', 'cpu0'])

  it('creates no annotations when given no annotations', () => {
    const result = annotationTransform(table, null, TIME, VALUE, ['cpu'])

    expect(Array.isArray(result.annotations)).toEqual(true)
    expect(result.annotations.length).toEqual(0)
  })

  it('calculates the xDomain and yDomain based on the given table and column keys', () => {
    const result1 = annotationTransform(table, null, TIME, VALUE, ['cpu'])

    const [xMin1, xMax1] = result1.xDomain
    const [yMin1, yMax1] = result1.yDomain

    expect(xMin1).toEqual(1606862528103)
    expect(xMax1).toEqual(1606862728103)
    expect(yMin1).toEqual(0)
    expect(yMax1).toEqual(10)

    const result2 = annotationTransform(table, null, VALUE, TIME, ['cpu'])

    const [xMin2, xMax2] = result2.xDomain
    const [yMin2, yMax2] = result2.yDomain

    expect(xMin2).toEqual(0)
    expect(xMax2).toEqual(10)
    expect(yMin2).toEqual(1606862528103)
    expect(yMax2).toEqual(1606862728103)
  })

  it('keeps only annotations within the domains of the table when given annotations', () => {
    const inputAnnotations = [
      {
        title: 'annotation 0',
        description: 'Hi, i am index 0',
        color: 'green',
        startValue: 1606862528103,
        stopValue: 1606862528103,
        direction: 'x',
      },
      {
        title: 'annotation 1',
        description: 'Hi, i am index 1',
        color: 'green',
        startValue: 1606862628103,
        stopValue: 1606862628103,
        direction: 'x',
      },
      {
        title: 'annotation 2',
        description: 'Hi, i am index 2',
        color: 'green',
        startValue: 1606862728103,
        stopValue: 1606862728103,
        direction: 'x',
      },
      {
        title: 'annotation 3',
        description: 'whoops, i do not belong in here!',
        color: 'green',
        startValue: 1706862728103,
        stopValue: 1706862728103,
        direction: 'x',
      },
      {
        title: 'annotation 4',
        description: 'the beginning of time',
        color: 'green',
        startValue: 0,
        stopValue: 0,
        direction: 'x',
      },
    ] as AnnotationMark[]
    const annotations = annotationTransform(
      table,
      inputAnnotations,
      TIME,
      VALUE,
      ['cpu']
    ).annotations

    expect(Array.isArray(annotations)).toEqual(true)
    expect(inputAnnotations.length > annotations.length).toEqual(true)
    expect(annotations.length).toEqual(3)
    expect(
      annotations.every(
        (annotation, i) => annotation.title === `annotation ${i}`
      )
    )
  })
})
