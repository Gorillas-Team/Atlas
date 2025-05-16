import { locales } from './locales.js'

export type SupportedLang = keyof typeof locales
export const defaultLang: SupportedLang = 'en'

type MessageTree = (typeof locales)[SupportedLang]

export type FlattenKeys<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends string
    ? `${Prefix}${K & string}`
    : FlattenKeys<T[K], `${Prefix}${K & string}.`>
}[keyof T]

export type MessageKey = FlattenKeys<MessageTree>

export function getNestedValue<T>(obj: T, path: string): string | undefined {
  const parts = path.split('.')

  let current: unknown = obj

  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }

  return typeof current === 'string' ? current : undefined
}

export function t<K extends MessageKey, L extends SupportedLang = typeof defaultLang>(
  key: K,
  vars: Record<string, string | number> = {},
  lang: L = defaultLang as L,
): string {
  const catalog = locales[lang] ?? locales[defaultLang]
  let template = getNestedValue(catalog, key) ?? getNestedValue(locales[defaultLang], key) ?? key

  for (const [k, v] of Object.entries(vars)) {
    template = template.replaceAll(`{{${k}}}`, String(v))
  }

  return template
}
