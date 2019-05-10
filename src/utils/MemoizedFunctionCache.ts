import memoizeOne from 'memoize-one'

export class MemoizedFunctionCache {
  private memoizedFunctions: {[key: string]: Function} = {}

  public get<T extends (...args: any[]) => any>(key: string, fn: T): T {
    if (!this.memoizedFunctions[key]) {
      this.memoizedFunctions[key] = memoizeOne(fn)
    }

    return this.memoizedFunctions[key] as T
  }
}
