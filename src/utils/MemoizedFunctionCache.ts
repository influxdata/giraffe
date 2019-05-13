import memoizeOne from 'memoize-one'

/*
  Stores a cache of memoized functions which can be looked up by an arbitrary
  key. The memoized functions are instatiated lazily.

  Example:

  ```
  const f = () => {
    console.log('f called')

    return 2
  }

  const cache = new MemoizedFunctionCache()
  const fMemoized = cache.get('myKey', f)

  fMemoized() // logs "f called", returns 2
  fMemoized() // returns 2
  ```

*/
export class MemoizedFunctionCache {
  private memoizedFunctions: {[key: string]: Function} = {}

  public get<T extends (...args: any[]) => any>(key: string, fn: T): T {
    if (!this.memoizedFunctions[key]) {
      this.memoizedFunctions[key] = memoizeOne(fn)
    }

    return this.memoizedFunctions[key] as T
  }
}
