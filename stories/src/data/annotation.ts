import {
  AnnotationDirection,
  AnnotationMark,
  Table,
} from '../../../giraffe/src/types'
import {newTable} from '../../../giraffe/src'

const now = Date.now()
const numberOfRecords = 10
const recordsPerLine = 10
const maxValue = 10

const TIME_COL = []
const VALUE_COL = []
const CPU_COL = []

const DEFAULT_COLOR = 'green'

function getRandomNumber(max) {
  return Math.random() * Math.floor(max)
}
for (let i = 0; i < numberOfRecords; i += 1) {
  VALUE_COL.push(getRandomNumber(maxValue))
  CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
  TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
}

export const annotationsTable = newTable(numberOfRecords)
  .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
  .addColumn('_value', 'system', 'number', VALUE_COL)
  .addColumn('cpu', 'string', 'string', CPU_COL)

interface SampleAnnotationsCreatorOptions {
  color: string
  direction: AnnotationDirection
  table: Table
  x: string
  y: string
}

export const matchAnnotationsToTable = (
  options: SampleAnnotationsCreatorOptions
): AnnotationMark[] => {
  const {color, direction = 'x', table} = options
  const values = table.getColumn(options[direction], 'number')
  const annotationMarks: AnnotationMark[] = []

  values.forEach((value: number, i: number) => {
    annotationMarks.push({
      title: `annotation at index ${i}`,
      description: `Hi, I am an annotation that starts at ${value} and ends at ${value}`,
      color: typeof color === 'string' ? color : DEFAULT_COLOR,
      direction,
      startValue: value,
      stopValue: value,
    })
  })

  return annotationMarks
}
