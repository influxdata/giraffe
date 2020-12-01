import {AnnotationLayerSpec, AnnotationMark, Table} from '../types'
import {FILL} from '../constants/columnKeys'
import {createGroupIDColumn} from './'

export const annotationTransform = (
  inputTable: Table,
  inputAnnotations: AnnotationMark[],
  xColumnKey: string,
  yColumnKey: string,
  fillColKeys: string[]
): AnnotationLayerSpec => {
  const [fillColumn] = createGroupIDColumn(inputTable, fillColKeys)
  const table = inputTable.addColumn(FILL, 'system', 'number', fillColumn)
  const xCol = table.getColumn(xColumnKey, 'number')
  const yCol = table.getColumn(yColumnKey, 'number')

  let xMin = Infinity
  let xMax = -Infinity
  let yMin = Infinity
  let yMax = -Infinity

  for (let i = 0; i < table.length; i += 1) {
    if (xCol[i] < xMin) {
      xMin = xCol[i]
    }

    if (xCol[i] > xMax) {
      xMax = xCol[i]
    }

    if (yCol[i] < yMin) {
      yMin = yCol[i]
    }

    if (yCol[i] > yMax) {
      yMax = yCol[i]
    }
  }

  const annotations: AnnotationMark[] = []

  for (let i = 0; i < inputAnnotations.length; i += 1) {
    if (
      (inputAnnotations[i].direction === 'y' &&
        yMin <= inputAnnotations[i].startValue &&
        inputAnnotations[i].stopValue <= yMax) ||
      (inputAnnotations[i].direction !== 'y' &&
        xMin <= inputAnnotations[i].startValue &&
        inputAnnotations[i].stopValue <= xMax)
    ) {
      annotations.push(inputAnnotations[i])
    }
  }

  return {
    type: 'annotation',
    table,
    annotations,
    xColumnKey,
    yColumnKey,
    xColumnType: table.getColumnType(xColumnKey),
    yColumnType: table.getColumnType(yColumnKey),
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
  }
}
