function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue
    return ''
  }
  return value
}

export function getEnvNumber(key: string, defaultValue?: number): number {
  const raw = getEnv(key, defaultValue?.toString())
  const value = parseInt(raw, 10)

  if (isNaN(value)) {
    throw new Error(`Environment variable "${key}" must be a valid number, got "${raw}"`)
  }

  return value
}

export function getEnvBoolean(key: string, defaultValue?: boolean): boolean {
  const raw = getEnv(key, defaultValue?.toString())

  if (raw === 'true') return true
  if (raw === 'false') return false

  throw new Error(`Environment variable "${key}" must be "true" or "false", got "${raw}"`)
}

export function getEnvString(key: string, defaultValue?: string): string {
  return getEnv(key, defaultValue)
}

export function getEnvJson<T>(key: string, defaultValue?: T): T {
  const raw = getEnv(key, JSON.stringify(defaultValue))

  try {
    return JSON.parse(raw) as T
  } catch {
    throw new Error(`Environment variable "${key}" must be valid JSON, got "${raw}"`)
  }
}

export function getEnvStringArray(key: string, defaultValue?: string[]): string[] {
  // 1,2,3
  const raw = getEnv(key, defaultValue?.join(','))
  const values = raw
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

  if (values.length === 0) {
    throw new Error(`Environment variable "${key}" must be a non-empty comma-separated list`)
  }

  return values
}
