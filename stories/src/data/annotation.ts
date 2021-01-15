import {
  AnnotationDimension,
  AnnotationMark,
  AnnotationPinType,
  Table,
} from '../../../giraffe/src/types'
import {newTable} from '../../../giraffe/src'

const now = Date.now()
const numberOfRecords = 20
const recordsPerLine = 20
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
  dimension: AnnotationDimension
  table: Table
  x: string
  y: string
  pin: AnnotationPinType
}

export const matchAnnotationsToTable = (
  options: SampleAnnotationsCreatorOptions
): AnnotationMark[] => {
  const {color, dimension = 'x', table, pin} = options
  const values = table.getColumn(options[dimension], 'number')
  const annotationMarks: AnnotationMark[] = []

  values.forEach((value: number, i: number) => {
    annotationMarks.push({
      title: `Hi!`,
      description: `annotation at index ${i}`,
      color: typeof color === 'string' ? color : DEFAULT_COLOR,
      dimension,
      startValue: value,
      stopValue: value,
      pin,
    })
  })

  return annotationMarks
}
