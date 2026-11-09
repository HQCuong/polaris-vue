// Token categories shared by the tokens.css generator (scripts/tokens-lib.mjs) and the docs
// tables (docs/.vitepress/theme/CssVariables.vue). Dependency-free so the docs client bundle
// can import it.

// Ordered category prefixes for grouping tokens.css and the docs tables. The first
// matching prefix wins, so more specific prefixes come first.
export const TOKEN_GROUPS = [
  ['color-bg', '--p-color-bg'],
  ['color-text', '--p-color-text'],
  ['color-border', '--p-color-border'],
  ['color-icon', '--p-color-icon'],
  ['color-other', '--p-color-'],
  ['space', '--p-space-'],
  ['border-radius', '--p-border-radius-'],
  ['border-width', '--p-border-width-'],
  ['font', '--p-font-'],
  ['shadow', '--p-shadow-'],
  ['motion', '--p-motion-'],
  ['z-index', '--p-z-index-'],
  ['width', '--p-width-'],
  ['height', '--p-height-'],
  ['breakpoints', '--p-breakpoints-'],
]

export const GROUP_TITLES = {
  'color-bg': 'Color: background',
  'color-text': 'Color: text',
  'color-border': 'Color: border',
  'color-icon': 'Color: icon',
  'color-other': 'Color: other',
  space: 'Space',
  'border-radius': 'Border radius',
  'border-width': 'Border width',
  font: 'Font',
  shadow: 'Shadow',
  motion: 'Motion',
  'z-index': 'Z-index',
  width: 'Width',
  height: 'Height',
  breakpoints: 'Breakpoints',
  other: 'Other',
}

/** @param {string} name */
export function groupOf(name) {
  for (const [group, prefix] of TOKEN_GROUPS) if (name.startsWith(prefix)) return group
  return 'other'
}

/**
 * @param {Record<string, string>} tokens
 * @returns {Array<[string, Array<[string, string]>]>}
 */
export function groupTokens(tokens) {
  /** @type {Map<string, Array<[string, string]>>} */
  const groups = new Map([...TOKEN_GROUPS.map(([g]) => [g, []]), ['other', []]])
  for (const [name, value] of Object.entries(tokens)) groups.get(groupOf(name)).push([name, value])
  return [...groups].filter(([, entries]) => entries.length > 0)
}
