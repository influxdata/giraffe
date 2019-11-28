import {useLayoutEffect, DependencyList, MutableRefObject} from 'react'

export interface DivRenderingContext {}

export const useDiv = (
  divRef: MutableRefObject<HTMLDivElement>,
  context: DivRenderingContext,
  width: number,
  height: number,
  renderFunction: (context: DivRenderingContext) => void,
  renderFunctionDeps?: DependencyList
): void => {
  const deps = renderFunctionDeps
    ? [divRef.current, width, height, ...renderFunctionDeps]
    : null

  // TODO: Resize div immediately on width/height change but debounce drawing
  useLayoutEffect(() => {
    if (!divRef.current) {
      return
    }

    renderFunction(context)
  }, deps)
}
