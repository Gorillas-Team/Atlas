/**
 * @template T
 * @param {T} value
 */
const Maybe = (value) => {
  if (value === null || value === undefined) {
    return new Nothing()
  }

  return new Just(value)
}

/** @template T */
export class Just {
  /** @param {T} value  */
  constructor (value) {
    /**
     * @type {T}
     * @private
     */
    this.value = value
  }

  isNothing () { return false }

  /** @param {T} value */
  contains (value) { return (this.value === value) }

  /** @param {T} defaultValue */
  getOr (defaultValue) { return this.value }

  /**
   * @template U
   * @param {(x: T) => U} fn
   */
  map (fn) {
    return Maybe(fn(this.value))
  }

  /**
   * @template U
   * @param {U} defaultValue
   * @param {(x: T) => U} fn
   */
  mapOr (defaultValue, fn) {
    return Maybe(fn(this.value))
  }

  /**
   * @template U
   * @param {(x: T) => U | void} just
   * @param {() => U | void} nothing
   */
  match (just, nothing) {
    if (!just || !nothing) throw new Error('Non-exhaustive patterns')
    return just(this.value)
  }
}

export class Nothing {
  isNothing () { return true }

  contains (value) { return false }

  /**
   * @template T
   * @param {T} defaultValue
   */
  getOr (defaultValue) { return defaultValue }

  map () { return new Nothing() }

  /**
   * @template T
   * @param {T} defaultValue
   */
  mapOr (defaultValue) { return new Just(defaultValue) }

  /**
   * @template U
   * @param {(x: T) => U | void} just
   * @param {() => U | void} nothing
   */
  match (just, nothing) {
    if (!just || !nothing) throw new Error('Non-exhaustive patterns in function')
    return nothing()
  }
}

Maybe.Just = Just
Maybe.Nothing = Nothing
Maybe.of = Maybe

export default Maybe
