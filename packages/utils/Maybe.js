export const maybe = (value) => {
  if (value === null || value === undefined) {
    return new Nothing()
  }

  return new Just(value)
}

export class Just {
  constructor (value) {
    this.value = value
  }

  map (fn) {
    return maybe(fn(this.value))
  }

  bind (fn) {
    return fn(this.value)
  }

  getOr () {
    return this.value
  }
}

export class Nothing {
  map () {
    return new Nothing()
  }

  bind () {
    return new Nothing()
  }

  getOr (defaultValue) {
    return defaultValue
  }
}
