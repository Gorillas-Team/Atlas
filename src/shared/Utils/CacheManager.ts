export class CacheManager<K, V> {
  private values: Map<K, V>
  private timestamp: Map<K, Date>

  constructor() {
    this.values = new Map<K, V>()
    this.timestamp = new Map<K, Date>()
  }

  getValue(key: K): V | undefined {
    return this.values.get(key)
  }

  getValueOrCreate(key: K, defaultValue: V): V {
    const value = this.values.get(key)
    if (value !== undefined) return value

    this.setValue(key, defaultValue)
    return defaultValue
  }

  getTimestamp(key: K): Date | undefined {
    return this.timestamp.get(key)
  }

  setValue(key: K, value: V): void {
    this.values.set(key, value)
    this.timestamp.set(key, new Date())
  }
}
