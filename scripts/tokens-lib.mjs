// Pure helpers behind scripts/extract-tokens.mjs and the tokens.css generator. No I/O
// here, so the unit tests (scripts/__tests__/tokens-lib.spec.mjs) can feed fixture strings.
//
// The Polaris web components runtime (https://cdn.shopify.com/shopifycloud/polaris-N.js)
// embeds its design tokens as CSS inside JS string literals: `:root{--p-…-HASH:value;…}`
// blocks plus partial theme blocks (`.p-partial-theme-admin-next-dark{…}`). Every custom
// property name carries a per-build hash suffix (`--p-color-bg-surface-6e076`), which we
// detect and strip so the published names are stable across builds.

import { parse as parseCss } from 'postcss'

import { GROUP_TITLES, groupTokens } from './token-groups.mjs'

export { GROUP_TITLES, TOKEN_GROUPS, groupOf, groupTokens } from './token-groups.mjs'

/** Minimum number of base tokens a healthy extraction must produce. */
export const MIN_BASE_TOKENS = 300
/** Maximum allowed drop in base token count versus the committed tokens.json. */
export const MAX_DROP_RATIO = 0.2

// Identifier-like words after which a `/` starts a regex literal, not a division.
const KEYWORDS_BEFORE_EXPRESSION = new Set([
  'return',
  'typeof',
  'instanceof',
  'in',
  'of',
  'new',
  'delete',
  'void',
  'throw',
  'case',
  'do',
  'else',
  'yield',
  'await',
])

/**
 * Tokenizes JavaScript just enough to return the raw source of every string literal
 * ('…', "…" and the static parts of `…` templates), skipping comments and regex
 * literals so quotes inside them aren't mistaken for string delimiters.
 *
 * @param {string} js
 * @returns {Array<{quote: string, raw: string}>}
 */
export function extractStringLiterals(js) {
  /** @type {Array<{quote: string, raw: string}>} */
  const out = []
  const n = js.length
  let i = 0
  let regexAllowed = true
  // One entry per open `${`: the code-mode brace depth inside that substitution.
  /** @type {number[]} */
  const templateDepths = []

  const readTemplate = () => {
    // `i` points just after the opening backtick or the `}` closing a substitution.
    const start = i
    while (i < n) {
      const c = js[i]
      if (c === '\\') {
        i += 2
        continue
      }
      if (c === '`') {
        out.push({ quote: '`', raw: js.slice(start, i) })
        i++
        regexAllowed = false
        return
      }
      if (c === '$' && js[i + 1] === '{') {
        out.push({ quote: '`', raw: js.slice(start, i) })
        i += 2
        templateDepths.push(0)
        regexAllowed = true
        return
      }
      i++
    }
    throw new Error('unterminated template literal')
  }

  while (i < n) {
    const c = js[i]
    const next = js[i + 1]

    if (c === '/' && next === '/') {
      const end = js.indexOf('\n', i)
      i = end === -1 ? n : end
      continue
    }
    if (c === '/' && next === '*') {
      const end = js.indexOf('*/', i + 2)
      if (end === -1) throw new Error('unterminated block comment')
      i = end + 2
      continue
    }
    if (c === '"' || c === "'") {
      const start = ++i
      while (i < n && js[i] !== c) {
        if (js[i] === '\\') i++
        else if (js[i] === '\n') throw new Error(`unterminated string literal at ${start - 1}`)
        i++
      }
      if (i >= n) throw new Error(`unterminated string literal at ${start - 1}`)
      out.push({ quote: c, raw: js.slice(start, i) })
      i++
      regexAllowed = false
      continue
    }
    if (c === '`') {
      i++
      readTemplate()
      continue
    }
    if (c === '/' && regexAllowed) {
      i++
      let inClass = false
      while (i < n) {
        const r = js[i]
        if (r === '\\') i += 2
        else if (r === '\n') throw new Error('unterminated regex literal')
        else if (inClass) {
          if (r === ']') inClass = false
          i++
        } else if (r === '[') {
          inClass = true
          i++
        } else if (r === '/') break
        else i++
      }
      i++
      while (i < n && /[a-z]/i.test(js[i])) i++
      regexAllowed = false
      continue
    }
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (/[\w$]/.test(c)) {
      const start = i
      while (i < n && /[\w$]/.test(js[i])) i++
      regexAllowed = KEYWORDS_BEFORE_EXPRESSION.has(js.slice(start, i))
      continue
    }
    if (c === '{') {
      if (templateDepths.length > 0) templateDepths[templateDepths.length - 1]++
      regexAllowed = true
      i++
      continue
    }
    if (c === '}') {
      i++
      if (templateDepths.length > 0) {
        if (templateDepths[templateDepths.length - 1] === 0) {
          templateDepths.pop()
          readTemplate()
          continue
        }
        templateDepths[templateDepths.length - 1]--
      }
      regexAllowed = true
      continue
    }
    if (c === ')' || c === ']') {
      regexAllowed = false
      i++
      continue
    }
    if ((c === '+' || c === '-') && next === c) {
      // `a++ / b` is a division, `++/re/` doesn't occur in practice.
      i += 2
      continue
    }
    regexAllowed = true
    i++
  }
  return out
}

/**
 * Decodes the escape sequences of a JS string literal body.
 *
 * @param {string} raw
 * @returns {string}
 */
export function decodeJsString(raw) {
  const simple = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' }
  return raw.replace(
    /\\(?:x([0-9a-fA-F]{2})|u\{([0-9a-fA-F]+)\}|u([0-9a-fA-F]{4})|(\r\n|\n|\r)|([\s\S]))/g,
    (_m, hex, codePoint, unicode, lineContinuation, char) => {
      if (hex) return String.fromCharCode(Number.parseInt(hex, 16))
      if (codePoint) return String.fromCodePoint(Number.parseInt(codePoint, 16))
      if (unicode) return String.fromCharCode(Number.parseInt(unicode, 16))
      if (lineContinuation) return ''
      return Object.hasOwn(simple, char) ? simple[char] : char
    },
  )
}

/**
 * Finds the build hash suffix shared by every `--p-*` custom property name defined in
 * the given CSS strings (e.g. `6e076` for `--p-color-bg-6e076`). Returns null when the
 * names carry no common 5-hex-digit suffix (Shopify dropped the hash); throws when most
 * but not all names share one, since that means our assumptions no longer hold.
 *
 * @param {string[]} cssStrings
 * @returns {string | null}
 */
export function detectHash(cssStrings) {
  /** @type {Map<string, number>} */
  const counts = new Map()
  let total = 0
  for (const css of cssStrings) {
    for (const match of css.matchAll(/(?<![\w-])(--p-[\w-]+)\s*:/g)) {
      total++
      const suffix = /-([0-9a-f]{5})$/.exec(match[1])
      if (suffix) counts.set(suffix[1], (counts.get(suffix[1]) ?? 0) + 1)
    }
  }
  if (total === 0) return null
  let best = null
  let bestCount = 0
  for (const [suffix, count] of counts) {
    if (count > bestCount) {
      best = suffix
      bestCount = count
    }
  }
  if (best && bestCount === total) return best
  if (best && bestCount / total > 0.5) {
    throw new Error(
      `inconsistent hash suffix: ${bestCount} of ${total} --p-* names end in -${best}, the rest don't`,
    )
  }
  return null
}

/**
 * Removes the build hash from every custom property name (definitions and `var()` refs).
 *
 * @param {string} css
 * @param {string | null} hash
 */
export function stripHash(css, hash) {
  if (!hash) return css
  return css.replace(new RegExp(`(--[\\w-]+?)-${hash}(?![\\w-])`, 'g'), '$1')
}

/**
 * Normalizes trivial formatting differences so equivalent values don't flip-flop between
 * syncs: whitespace runs, spaces inside parens and around commas, hex color case.
 *
 * @param {string} value
 */
export function normalizeValue(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s*,\s*/g, ', ')
    .replace(/#[0-9a-fA-F]{3,8}\b/g, (hex) => hex.toLowerCase())
}

/**
 * Replaces `var(--s-…, fallback)` and `var(--p-when-…, fallback)` with the fallback.
 * Internal refs without a fallback are kept and their names added to `unresolved`.
 *
 * @param {string} value
 * @param {Set<string>} [unresolved]
 */
export function resolveInternalRefs(value, unresolved = new Set()) {
  let out = ''
  let i = 0
  while (i < value.length) {
    const start = value.indexOf('var(', i)
    if (start === -1) {
      out += value.slice(i)
      break
    }
    out += value.slice(i, start)
    // Find the matching close paren and the first top-level comma.
    let depth = 0
    let comma = -1
    let end = -1
    for (let j = start + 3; j < value.length; j++) {
      const c = value[j]
      if (c === '(') depth++
      else if (c === ')') {
        depth--
        if (depth === 0) {
          end = j
          break
        }
      } else if (c === ',' && depth === 1 && comma === -1) comma = j
    }
    if (end === -1) throw new Error(`unbalanced parentheses in value: ${value}`)
    const name = value.slice(start + 4, comma === -1 ? end : comma).trim()
    const internal = name.startsWith('--s-') || name.startsWith('--p-when-')
    if (internal && comma !== -1) {
      out += resolveInternalRefs(value.slice(comma + 1, end).trim(), unresolved)
    } else {
      if (internal) unresolved.add(name)
      const inner = comma === -1 ? '' : resolveInternalRefs(value.slice(comma, end), unresolved)
      out += `var(${name}${inner})`
    }
    i = end + 1
  }
  return out
}

const THEME_CLASS = /p-partial-theme-([a-z0-9-]+)/g

/** Excluded from tokens: internal media-condition flags, not design tokens. */
export function isTokenName(name) {
  return name.startsWith('--p-') && !name.startsWith('--p-when-')
}

/**
 * @typedef {{ selector: string, conditions: string[], name: string, value: string }} ConditionalDecl
 * @typedef {{
 *   tokens: Record<string, string>,
 *   themes: Record<string, Record<string, string>>,
 *   themeAliases: Record<string, string[]>,
 *   conditional: ConditionalDecl[],
 *   hash: string | null,
 *   parseErrors: string[],
 *   unresolved: string[],
 * }} Extraction
 */

/**
 * Extracts base tokens and theme overrides from the runtime's JS source.
 *
 * - Base: declarations in rules whose selector list contains `:root` and no partial theme
 *   class, outside any at-rule.
 * - Themes: rules whose selectors name `p-partial-theme-*` classes. The theme is keyed by
 *   its longest class name (e.g. `admin-next-light`, which also covers `admin-next`); only
 *   values that differ from base are kept.
 * - `var(--s-…, fallback)` / `var(--p-when-…, fallback)` refs to the runtime's internal
 *   condition flags (mobile, prefers-contrast, …) are replaced by their fallback, the
 *   default value; those flags aren't public and don't exist outside the runtime.
 * - Anything inside @media / @supports is reported in `conditional`, not merged; a token
 *   defined only conditionally is added to base with its conditional value.
 *
 * @param {string} js
 * @returns {Extraction}
 */
export function extractTokens(js) {
  const cssStrings = extractStringLiterals(js)
    .filter((literal) => literal.raw.includes('--p-'))
    .map((literal) => decodeJsString(literal.raw))
    // Only stylesheets that define custom properties inside a rule.
    .filter((css) => /\{[^{}]*--p-[\w-]+\s*:/.test(css))

  const hash = detectHash(cssStrings)

  /** @type {Record<string, string>} */
  const base = {}
  /** @type {Record<string, Record<string, string>>} */
  const themeRaw = {}
  /** @type {Record<string, Set<string>>} */
  const aliases = {}
  /** @type {ConditionalDecl[]} */
  const conditional = []
  /** @type {string[]} */
  const parseErrors = []
  /** @type {Set<string>} */
  const unresolved = new Set()

  for (const css of cssStrings) {
    let root
    try {
      root = parseCss(stripHash(css, hash))
    } catch (error) {
      parseErrors.push(`${error.message} in: ${css.slice(0, 120)}…`)
      continue
    }
    root.walkRules((rule) => {
      const conditions = []
      for (let parent = rule.parent; parent && parent.type !== 'root'; parent = parent.parent) {
        if (parent.type === 'atrule') conditions.unshift(`@${parent.name} ${parent.params}`)
        else conditions.unshift(parent.type)
      }
      const selector = rule.selectors.join(',')
      const themeNames = [...new Set([...selector.matchAll(THEME_CLASS)].map((m) => m[1]))]
      const isRoot = rule.selectors.some((s) => s.trim() === ':root')

      rule.each((node) => {
        if (node.type !== 'decl' || !isTokenName(node.prop)) return
        const value = normalizeValue(resolveInternalRefs(node.value, unresolved))
        if (conditions.length > 0) {
          conditional.push({ selector, conditions, name: node.prop, value })
        } else if (themeNames.length > 0) {
          const key = themeNames.toSorted((a, b) => a.length - b.length || a.localeCompare(b))[0]
          themeRaw[key] ??= {}
          themeRaw[key][node.prop] = value
          aliases[key] ??= new Set()
          for (const name of themeNames) if (name !== key) aliases[key].add(name)
        } else if (isRoot) {
          base[node.prop] = value
        }
      })
    })
  }

  for (const decl of conditional) {
    const isRootRule = decl.selector.split(',').some((s) => s.trim() === ':root')
    if (isRootRule && !decl.selector.includes('p-partial-theme-') && !(decl.name in base)) {
      base[decl.name] = decl.value
    }
  }

  /** @type {Record<string, Record<string, string>>} */
  const themes = {}
  for (const [name, decls] of Object.entries(themeRaw)) {
    const diff = {}
    for (const [prop, value] of Object.entries(decls)) {
      if (base[prop] !== value) diff[prop] = value
    }
    themes[name] = sortObject(diff)
  }

  return {
    tokens: sortObject(base),
    themes: sortObject(themes),
    themeAliases: Object.fromEntries(
      Object.entries(aliases)
        .map(([key, set]) => [key, [...set].toSorted()])
        .toSorted(([a], [b]) => a.localeCompare(b)),
    ),
    conditional,
    hash,
    parseErrors,
    unresolved: [...unresolved].toSorted(),
  }
}

/**
 * @template T
 * @param {Record<string, T>} obj
 * @returns {Record<string, T>}
 */
export function sortObject(obj) {
  return Object.fromEntries(Object.entries(obj).toSorted(([a], [b]) => compareNames(a, b)))
}

/** Natural sort so `--p-space-100` comes before `--p-space-1000`, `-z-index-2` before `-12`. */
export function compareNames(a, b) {
  return a.localeCompare(b, 'en', { numeric: true })
}

/**
 * Throws when the extraction looks broken: too few base tokens, or a large drop versus
 * the previously committed tokens.json. Never silently wipe tokens.
 *
 * @param {Record<string, string>} tokens
 * @param {Record<string, string> | undefined} previousTokens
 */
export function guardTokens(tokens, previousTokens) {
  const count = Object.keys(tokens).length
  if (count < MIN_BASE_TOKENS) {
    throw new Error(
      `only ${count} base tokens extracted (minimum ${MIN_BASE_TOKENS}); the runtime's CSS format probably changed`,
    )
  }
  if (previousTokens) {
    const previous = Object.keys(previousTokens).length
    if (previous > 0 && count < previous * (1 - MAX_DROP_RATIO)) {
      throw new Error(
        `base token count dropped from ${previous} to ${count} (more than ${MAX_DROP_RATIO * 100}%); refusing to overwrite tokens.json`,
      )
    }
  }
}

/**
 * @param {Record<string, string>} before
 * @param {Record<string, string>} after
 */
function diffMaps(before, after) {
  const added = []
  const removed = []
  const changed = []
  for (const name of Object.keys(after)) {
    if (!(name in before)) added.push(name)
    else if (before[name] !== after[name])
      changed.push({ name, from: before[name], to: after[name] })
  }
  for (const name of Object.keys(before)) if (!(name in after)) removed.push(name)
  return { added, removed, changed }
}

/**
 * Markdown summary of what changed between two tokens.json documents. Returns
 * `{ changed: false }` when nothing differs.
 *
 * @param {{tokens?: Record<string, string>, themes?: Record<string, Record<string, string>>} | undefined} before
 * @param {{tokens: Record<string, string>, themes: Record<string, Record<string, string>>}} after
 */
export function diffSummary(before, after) {
  const sections = [['Base tokens', diffMaps(before?.tokens ?? {}, after.tokens)]]
  const themeNames = new Set([...Object.keys(before?.themes ?? {}), ...Object.keys(after.themes)])
  for (const theme of [...themeNames].toSorted()) {
    sections.push([
      `Theme \`${theme}\``,
      diffMaps(before?.themes?.[theme] ?? {}, after.themes[theme] ?? {}),
    ])
  }

  const lines = []
  let any = false
  for (const [title, { added, removed, changed }] of sections) {
    if (added.length + removed.length + changed.length === 0) continue
    any = true
    lines.push(
      `#### ${title}: ${added.length} added, ${removed.length} removed, ${changed.length} changed`,
      '',
    )
    for (const name of added) lines.push(`- added \`${name}\``)
    for (const name of removed) lines.push(`- **removed** \`${name}\``)
    for (const { name, from, to } of changed) lines.push(`- changed \`${name}\`: \`${from}\` → \`${to}\``)
    lines.push('')
  }
  return { changed: any, markdown: any ? lines.join('\n') : 'No token changes.\n' }
}

// ---------------------------------------------------------------------------
// tokens.css generation
// ---------------------------------------------------------------------------

// Themes rendered into tokens.css, keyed by tokens.json theme name. The runtime itself
// toggles `p-partial-theme-admin-next` on <html> (its default theme; Shopify admin can switch
// it to the classic `admin` theme, which is the plain :root values), so keying the block on
// that same class makes tokens.css follow whichever theme the runtime applies. The
// `admin-next-dark` theme is only applied to parts inside specific components, never to the
// document, so it stays in tokens.json only.
export const CSS_THEME_SELECTORS = {
  'admin-next': ':root.p-partial-theme-admin-next',
}

/**
 * @param {string[]} lines
 * @param {Record<string, string>} tokens
 */
function pushGrouped(lines, tokens) {
  groupTokens(tokens).forEach(([group, entries], index) => {
    if (index > 0) lines.push('')
    lines.push(`  /* ${GROUP_TITLES[group]} */`)
    for (const [name, value] of entries) lines.push(`  ${name}: ${value};`)
  })
}

/**
 * @param {{source: string, tokens: Record<string, string>, themes?: Record<string, Record<string, string>>}} doc
 */
export function renderTokensCss(doc) {
  const lines = [
    '/*',
    ' * Polaris CSS variables (design tokens) for apps built with polaris-vue-elements.',
    ' *',
    ' * GENERATED FILE - do not edit. `node scripts/extract-tokens.mjs` extracts tokens.json',
    ` * from ${doc.source}`,
    ' * and `npm run generate` renders this file from it.',
    ' *',
    ' * Unofficial: Shopify publishes no CSS variable list for Polaris web components. These',
    ' * are the values the runtime defines for itself; they follow the CDN, and names may',
    ' * change if Shopify renames them. Use them for your own layout around Polaris',
    ' * components; they cannot style the inside of a component.',
    ' */',
    '',
    ':root {',
  ]
  pushGrouped(lines, doc.tokens)
  lines.push('}')
  for (const [theme, selector] of Object.entries(CSS_THEME_SELECTORS)) {
    const overrides = doc.themes?.[theme]
    if (!overrides || Object.keys(overrides).length === 0) continue
    lines.push(
      '',
      `/* Theme "${theme}": the Polaris runtime adds this class to <html> when the theme is active. */`,
      `${selector} {`,
    )
    pushGrouped(lines, overrides)
    lines.push('}')
  }
  lines.push('')
  return lines.join('\n')
}
