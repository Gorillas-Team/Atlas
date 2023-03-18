import { notStrictEqual } from 'node:assert'

export class SugarMap extends Map {
  first () {
    const values = [...this.values()]
    return values.shift()
  }

  last () {
    const values = [...this.values()]
    return values.pop()
  }

  reduce (fn, initialValue) {
    notStrictEqual(initialValue, undefined, 'initialValue is undefined')

    let accumulator = initialValue

    for (const value of this.values()) {
      accumulator += fn(accumulator, value)
    }

    return accumulator
  }

  every (fn) {
    for (const value of this.values()) {
      if (!fn(value)) return false
    }

    return true
  }

  filter (fn) {
    const newSugarMap = new SugarMap()

    for (const [key, value] of this.entries()) {
      if (fn(value, key)) newSugarMap.set(key, value)
    }

    return newSugarMap
  }

  map (fn) {
    const array = []

    for (const value of this.values()) {
      array.push(fn(value))
    }

    return array
  }
}
