import { computed, reactive } from 'vue'

import tokensDoc from '../../../../tokens/tokens.json'
import { groupOf } from '../../../../scripts/token-groups.mjs'

// Page-wide state shared by the toolbar, the specimen and every group table on
// docs/css-variables/reference.md. SSR renders the defaults (nothing filtered); only the
// client mutates it.

export type ThemeName = 'base' | 'admin-next'
export type CopyFormat = 'name' | 'var'
type TokenMap = Record<string, string>

export const base: TokenMap = tokensDoc.tokens
export const overrides: TokenMap = (tokensDoc.themes as Record<string, TokenMap>)['admin-next'] ?? {}
const themed: TokenMap = { ...base, ...overrides }
export const names = Object.keys(base)

export const state = reactive({
  query: '',
  // What the runtime applies by default (see the page's "Themes" section).
  theme: 'admin-next' as ThemeName,
  format: 'name' as CopyFormat,
  copied: null as string | null,
  copiedText: '',
})

export function tokensFor(theme: ThemeName): TokenMap {
  return theme === 'base' ? base : themed
}

export function valueOf(name: string): string {
  return tokensFor(state.theme)[name] ?? ''
}

/** True when Base and admin-next give the token different values. */
export function differs(name: string): boolean {
  return name in overrides && overrides[name] !== base[name]
}

/** Follows var(--p-…) references so previews render without tokens.css on the page. */
export function resolve(value: string, map: TokenMap, depth = 0): string {
  if (depth > 10) return value
  return value.replace(/var\((--p-[\w-]+)(?:,\s*([^()]*))?\)/g, (match, name: string, fallback?: string) => {
    const target = map[name] ?? fallback
    return target === undefined ? match : resolve(target, map, depth + 1)
  })
}

export function resolved(name: string, theme: ThemeName = state.theme): string {
  const map = tokensFor(theme)
  return resolve(map[name] ?? '', map)
}

function normalizedQuery(): string {
  return state.query
    .trim()
    .toLowerCase()
    .replace(/^var\(\s*/, '')
    .replace(/\s*\)$/, '')
}

export function matches(name: string): boolean {
  const query = normalizedQuery()
  if (query === '') return true
  return name.includes(query) || valueOf(name).toLowerCase().includes(query)
}

export const matchCount = computed(() => names.filter(matches).length)

export function namesIn(group: string): string[] {
  return names.filter((name) => groupOf(name) === group)
}

let timer: ReturnType<typeof setTimeout> | undefined

export async function copy(name: string): Promise<void> {
  const text = state.format === 'var' ? `var(${name})` : name
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    return
  }
  state.copied = name
  state.copiedText = text
  clearTimeout(timer)
  timer = setTimeout(() => {
    state.copied = null
  }, 1500)
}
