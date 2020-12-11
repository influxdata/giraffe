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

  // A hash of all input annotations is needed to:
  // - keep only the first occurence of an annotation with the same
  //   dimension, startValue, stopValue
  // - ensure 'y' dimension annotations are within yDomain
  // - ensure 'x' dimension annotations are within xDomain
  const annotationMap = {}
  if (Array.isArray(inputAnnotations)) {
    for (let i = 0; i < inputAnnotations.length; i += 1) {
      if (
        !annotationMap[
          `${inputAnnotations[i].dimension}-${inputAnnotations[i].startValue}-${inputAnnotations[i].stopValue}`
        ] &&
        ((inputAnnotations[i].dimension === 'y' &&
          yMin <= inputAnnotations[i].startValue &&
          inputAnnotations[i].stopValue <= yMax) ||
          (inputAnnotations[i].dimension === 'x' &&
            xMin <= inputAnnotations[i].startValue &&
            inputAnnotations[i].stopValue <= xMax))
      ) {
        annotationMap[
          `${inputAnnotations[i].dimension}-${inputAnnotations[i].startValue}-${inputAnnotations[i].stopValue}`
        ] = inputAnnotations[i]
      }
    }
  }
  const annotationData: AnnotationMark[] = Object.values(annotationMap)

  return {
    type: 'annotation',
    table,
    annotationData,
    xColumnKey,
    yColumnKey,
    xColumnType: table.getColumnType(xColumnKey),
    yColumnType: table.getColumnType(yColumnKey),
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
  }
}
