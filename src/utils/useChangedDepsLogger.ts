import {useRef, MutableRefObject} from 'react'

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
