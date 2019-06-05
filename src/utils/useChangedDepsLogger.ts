import {useRef, MutableRefObject} from 'react'

/*
  This utility can be used to debug why a `useEffect` or `useMemo` hook is
  firing.

  For example, given the following hook:

      useEffect(() => {
        doTheThing()
      }, [a, b, c])

  We can place the `useChangeDepsLogger` immediately after:

      useEffect(() => {
        doTheThing()
      }, [a, b, c])

      useChangedDepsLogger({a, b, c})

  If any of the dependencies `a`, `b`, or `c` changes in a render (causing the
  effect to fire) then a message will be logged to the console.
*/
export const useChangedDepsLogger = deps => {
  const prevDeps: MutableRefObject<any> = useRef({})

  for (const key of Object.keys(deps)) {
    if (deps[key] !== prevDeps.current[key]) {
      // eslint-disable-next-line no-console
      console.log(
        `dependency changed: ${key}`,
        prevDeps.current[key],
        deps[key]
      )
    }
  }

  prevDeps.current = deps
}
