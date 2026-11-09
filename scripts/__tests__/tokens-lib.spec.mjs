import { describe, expect, it } from 'vitest'

import {
  MIN_BASE_TOKENS,
  detectHash,
  diffSummary,
  extractStringLiterals,
  extractTokens,
  guardTokens,
  normalizeValue,
  renderTokensCss,
  resolveInternalRefs,
} from '../tokens-lib.mjs'

// A tiny stand-in for polaris-N.js: token CSS inside JS string literals, next to code with
// a regex literal and a comment that contain quote characters.
const css = [
  ':root{--p-space-100-ab12c:.25rem;--p-space-200-ab12c:  .5rem ;',
  '--p-color-bg-ab12c:#F1F1F1;',
  '--p-color-text-accent-ab12c:var(--p-color-text-ab12c);',
  '--p-color-text-ab12c:#303030;',
  '--p-font-size-body-ab12c:var(--s-token-font-size-body-when-mobile-ab12c, var(--p-font-size-350-ab12c));',
  '--p-font-size-350-ab12c:.875rem;',
  '--p-when-mobile-ab12c:var(--p-when-off-ab12c);',
  '--s-condition-true-ab12c: }',
  '@supports (border-radius:round(2px,2px)){:root{--p-border-radius-avatar-ab12c:round(25%, .125rem)}}',
  '.p-partial-theme-admin-next,.p-partial-theme-admin-next-light,:root.p-partial-theme-admin-next{',
  '--csstools-color-scheme--light-ab12c:initial;color-scheme:light;',
  '--p-color-bg-ab12c:#fff;--p-space-100-ab12c:.25rem}',
  '.p-partial-theme-admin-next-dark{--p-color-bg-ab12c:#1a1a1a;--p-color-text-ab12c:#e3e3e3}',
].join('')

const fixture = `/*! "banner" */!function(e){var f=/it's|"q"/i;const s='it\\'s';lt(e,${JSON.stringify(css)});x(\`a\${"b"}c\`)}()`

describe('extractStringLiterals', () => {
  it('skips regex literals and comments and handles templates', () => {
    const raws = extractStringLiterals(fixture).map((l) => l.raw)
    expect(raws).toContain("it\\'s")
    expect(raws).toContain('b')
    expect(raws).toContain('a')
    expect(raws.some((r) => r.includes(':root{--p-space-100-ab12c'))).toBe(true)
    expect(raws).not.toContain('q')
  })
})

describe('detectHash', () => {
  it('finds the suffix shared by every --p-* name', () => {
    expect(detectHash([css])).toBe('ab12c')
  })
  it('returns null when names carry no hash', () => {
    expect(detectHash([':root{--p-space-100:1px;--p-color-bg:#fff}'])).toBeNull()
  })
  it('throws when most but not all names share a suffix', () => {
    expect(() => detectHash([':root{--p-a-ab12c:1;--p-b-ab12c:2;--p-c:3}'])).toThrow(/inconsistent/)
  })
})

describe('extractTokens', () => {
  const result = extractTokens(fixture)

  it('strips the hash from names and var() refs', () => {
    expect(result.hash).toBe('ab12c')
    expect(result.tokens['--p-space-100']).toBe('.25rem')
    expect(result.tokens['--p-color-text-accent']).toBe('var(--p-color-text)')
  })

  it('normalizes values', () => {
    expect(result.tokens['--p-space-200']).toBe('.5rem')
    expect(result.tokens['--p-color-bg']).toBe('#f1f1f1')
  })

  it('replaces internal --s-* refs by their fallback', () => {
    expect(result.tokens['--p-font-size-body']).toBe('var(--p-font-size-350)')
  })

  it('excludes --p-when-* flags and non --p-* properties', () => {
    expect(Object.keys(result.tokens).some((n) => n.startsWith('--p-when-'))).toBe(false)
    expect(Object.keys(result.tokens).every((n) => n.startsWith('--p-'))).toBe(true)
  })

  it('adds tokens defined only inside @supports and reports them', () => {
    expect(result.tokens['--p-border-radius-avatar']).toBe('round(25%, .125rem)')
    expect(result.conditional).toHaveLength(1)
  })

  it('keeps only theme values that differ from base, keyed by the shortest class name', () => {
    expect(result.themes).toEqual({
      'admin-next': { '--p-color-bg': '#fff' },
      'admin-next-dark': { '--p-color-bg': '#1a1a1a', '--p-color-text': '#e3e3e3' },
    })
    expect(result.themeAliases['admin-next']).toEqual(['admin-next-light'])
  })

  it('sorts names naturally', () => {
    expect(Object.keys(result.tokens)).toEqual([
      '--p-border-radius-avatar',
      '--p-color-bg',
      '--p-color-text',
      '--p-color-text-accent',
      '--p-font-size-350',
      '--p-font-size-body',
      '--p-space-100',
      '--p-space-200',
    ])
  })
})

describe('helpers', () => {
  it('normalizeValue collapses formatting', () => {
    expect(normalizeValue(' calc( 1px  +  2px )')).toBe('calc(1px + 2px)')
    expect(normalizeValue('rgba(0,0,0 , .5)')).toBe('rgba(0, 0, 0, .5)')
  })

  it('resolveInternalRefs keeps public refs and reports internal ones without fallback', () => {
    const unresolved = new Set()
    expect(resolveInternalRefs('var(--p-a, var(--s-b, 1px))', unresolved)).toBe('var(--p-a, 1px)')
    expect(resolveInternalRefs('var(--s-c)', unresolved)).toBe('var(--s-c)')
    expect([...unresolved]).toEqual(['--s-c'])
  })

  it('renderTokensCss groups base tokens and renders the admin-next theme', () => {
    const out = renderTokensCss({
      source: 'https://example.test/polaris-2.js',
      tokens: { '--p-space-100': '.25rem', '--p-color-bg': '#fff' },
      themes: { 'admin-next': { '--p-color-bg': '#000' }, 'admin-next-dark': { '--p-color-bg': '#111' } },
    })
    expect(out).toContain('/* Color: background */\n  --p-color-bg: #fff;')
    expect(out).toContain('/* Space */\n  --p-space-100: .25rem;')
    expect(out).toContain(':root.p-partial-theme-admin-next {')
    expect(out).not.toContain('#111')
  })
})

const many = (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`--p-t-${i}`, '1px']))

describe('guardTokens', () => {
  it('rejects too few base tokens', () => {
    expect(() => guardTokens(many(MIN_BASE_TOKENS - 1), undefined)).toThrow(/minimum/)
  })

  it('rejects a drop of more than 20% versus the previous tokens', () => {
    expect(() => guardTokens(many(700), many(1000))).toThrow(/dropped/)
    expect(() => guardTokens(many(800), many(1000))).not.toThrow()
  })
})

describe('diffSummary', () => {
  it('lists added, removed and changed tokens', () => {
    const before = { tokens: { '--p-a': '1px', '--p-b': '2px' }, themes: {} }
    const after = { tokens: { '--p-a': '3px', '--p-c': '4px' }, themes: {} }
    const { changed, markdown } = diffSummary(before, after)
    expect(changed).toBe(true)
    expect(markdown).toContain('1 added, 1 removed, 1 changed')
    expect(markdown).toContain('`--p-a`: `1px` → `3px`')
  })

  it('reports no change for identical documents', () => {
    const doc = { tokens: { '--p-a': '1px' }, themes: {} }
    expect(diffSummary(doc, doc)).toEqual({ changed: false, markdown: 'No token changes.\n' })
  })
})
