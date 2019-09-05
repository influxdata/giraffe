import {useLayoutEffect, DependencyList, MutableRefObject} from 'react'
import {clearCanvas} from '../utils/clearCanvas'

export const useCanvas = (
  canvasRef: MutableRefObject<HTMLCanvasElement>,
  width: number,
  height: number,
  renderFunction: (context: CanvasRenderingContext2D) => void,
  renderFunctionDeps?: DependencyList
): void => {
  const deps = renderFunctionDeps
    ? [canvasRef.current, width, height, ...renderFunctionDeps]
    : null

  // TODO: Resize canvas immediately on width/height change but debounce drawing
  useLayoutEffect(() => {
    if (!canvasRef.current) {
      return
    }

    clearCanvas(canvasRef.current, width, height)
    renderFunction(canvasRef.current.getContext('2d'))
  }, deps)
}
