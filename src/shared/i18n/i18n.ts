import { locales } from './locales.js'

export type SupportedLangs = keyof typeof locales
export const defaultLang: SupportedLangs = 'en'

type MessageTree = (typeof locales)[SupportedLangs]

export type FlattenKeys<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends string
    ? `${Prefix}${K & string}`
    : FlattenKeys<T[K], `${Prefix}${K & string}.`>
}[keyof T]

export type MessageKey = FlattenKeys<MessageTree>

/* eslint-disable prettier/prettier, @typescript-eslint/no-unused-vars */
type GetTemplateFromPath<Path extends string, T = MessageTree> = 
  Path extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T
      ? GetTemplateFromPath<Tail, T[Head]>
      : never
    : Path extends keyof T
      ? T[Path]
      : never

type ExtractPlaceholdersFromTemplate<T extends string> = 
  T extends `${infer _}{{${infer Param}}}${infer Tail}`
    ? Param | ExtractPlaceholdersFromTemplate<Tail>
    : never

type TemplateParams<T extends string> = {
  [K in ExtractPlaceholdersFromTemplate<T>]?: string | number
}
/* eslint-enable prettier/prettier, @typescript-eslint/no-unused-vars */

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

export function getFixedT<L extends SupportedLangs>(lang = defaultLang as L) {
  return function t<K extends MessageKey>(
    ...args: ExtractPlaceholdersFromTemplate<GetTemplateFromPath<K>> extends never
      ? [key: K]
      : [key: K, placeholders: TemplateParams<GetTemplateFromPath<K>>]
  ) {
    const [key, vars = {}] = args

    const catalog = locales[lang] ?? locales[defaultLang]
    let template = getNestedValue(catalog, key) ?? getNestedValue(locales[defaultLang], key) ?? key

    for (const [k, v] of Object.entries(vars)) {
      template = template.replaceAll(`{{${k}}}`, String(v))
    }

    return template
  }
}
