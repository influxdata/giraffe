import {Scale, NumericColumnData, SymbolType} from '../types'
import {
  drawCircle,
  drawSquare,
  drawPlus,
  drawTriangle,
  drawTritip,
  drawEx,
} from '../utils/drawShapes'

interface DrawPointsOptions {
  context: CanvasRenderingContext2D
  xColData: NumericColumnData
  yColData: NumericColumnData
  fillColData: NumericColumnData
  symbolColData: NumericColumnData
  yScale: Scale<number, number>
  xScale: Scale<number, number>
  fillScale: Scale<number, string>
  symbolScale: Scale<number, SymbolType>
  pointSize: number
  rowIndices?: number[]
}

export const drawPoints = ({
  context,
  xColData,
  yColData,
  fillColData,
  symbolColData,
  yScale,
  xScale,
  fillScale,
  symbolScale,
  pointSize,
  rowIndices,
}: DrawPointsOptions): void => {
  const n = rowIndices ? rowIndices.length : xColData.length

  for (var i = 0; i < n; i++) {
    const rowIndex = rowIndices ? rowIndices[i] : i
    const x = xScale(xColData[rowIndex])
    const y = yScale(yColData[rowIndex])
    const fillStyle = fillScale(fillColData[rowIndex])
    const symbolType = symbolScale(symbolColData[rowIndex])

    context.fillStyle = fillStyle
    context.strokeStyle = fillStyle

    if (symbolType === 'circle') {
      drawCircle(context, x, y, pointSize)
    } else if (symbolType === 'square') {
      drawSquare(context, x, y, pointSize)
    } else if (symbolType === 'triangle') {
      drawTriangle(context, x, y, pointSize)
    } else if (symbolType === 'plus') {
      drawPlus(context, x, y, pointSize)
    } else if (symbolType === 'tritip') {
      drawTritip(context, x, y, pointSize)
    } else if (symbolType === 'ex') {
      drawEx(context, x, y, pointSize)
    }
  }
}
