// Generates the App Bridge types reference: the pages in docs/app-bridge/types/ and their
// translations in docs/<code>/app-bridge/types/, plus docs/.vitepress/app-bridge-types.json
// (type name -> page and anchor), which the markdown-it plugin in docs/.vitepress/config.ts
// uses to link inline code such as `ToastApi` on the App Bridge pages to its entry. Called
// by scripts/generate-docs.mjs.
//
// Source: @shopify/app-bridge-types' dist/index.d.ts, parsed with the TypeScript compiler
// API. Every member, type and description printed comes from that file, so the pages cannot
// say anything the types don't. Descriptions stay in Shopify's English in every locale; only
// the page chrome (docs/locales/<code>/generator.mjs, `appBridgeTypes`) is translated.
//
// Scope: `ShopifyGlobal`, every type name used as inline code on the English App Bridge
// pages (docs/app-bridge/*.md), and everything those reference, transitively. Global
// augmentations (`declare global`) are left out, except the element interfaces declared
// there as `interface X extends X$1 {}`, which are shown under their global name.
//
// Pages: the overview (index.md: ShopifyGlobal and an A–Z index), one page per category
// Shopify files the `shopify` APIs under on shopify.dev, one for the element interfaces,
// and one for the types several of those share. See "Pages" below for how a type's page is
// chosen.
//
// Deterministic: running it twice gives no diff.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import ts from 'typescript'

const PACKAGE = '@shopify/app-bridge-types'
const NPM_URL = `https://www.npmjs.com/package/${PACKAGE}`

// Order of the App Bridge pages in the sidebar (docs/.vitepress/config.ts) and the
// `sidebarAppBridge` label each one uses in "Used in" lines.
const PAGES = [
  ['index', 'overview'],
  ['use-app-bridge', 'useAppBridge'],
  ['modal', 'modal'],
  ['title-bar', 'titleBar'],
  ['save-bar', 'saveBar'],
  ['app-window', 'appWindow'],
  ['nav-menu', 'navMenu'],
]

// The categories in shopify.dev's App Bridge API URLs (`/docs/api/app-home/apis/<category>/…`).
const CATEGORIES = ['authentication-and-data', 'user-interface-and-interactions', 'device-and-platform-integration']

// The generated pages in docs/app-bridge/types/, in sidebar order, and the anchor of each H1.
// `other` holds the APIs without a shopify.dev category and the types used across categories.
const TYPE_PAGES = ['index', ...CATEGORIES, 'elements', 'other']
const PAGE_ANCHORS = {
  index: 'app-bridge-types',
  'authentication-and-data': 'authentication-and-data',
  'user-interface-and-interactions': 'user-interface-and-interactions',
  'device-and-platform-integration': 'device-and-platform-integration',
  elements: 'elements-and-attributes',
  other: 'other-apis-and-types',
}
const SECTION_ANCHORS = { pages: 'type-pages', azIndex: 'a-z-index', otherApis: 'other-apis', acrossCategories: 'used-across-categories' }

// `shopify` members that use-app-bridge.md shows without a shopify.dev link, because
// shopify.dev has no page for them. Their types go to "Other APIs" on the other page
// without a warning; any other member without a category gets one.
const UNCATEGORIZED_MEMBERS = new Set(['origin', 'ready', 'setSignals', 'shopifyQL'])

// Element interfaces and their attribute types (`UIModalElement`, `SAppWindowAttributes`).
const ELEMENT_NAME = /(Element|Elements|Attributes|Children)$/

/**
 * @param {object} options
 * @param {string} options.repoRoot
 * @param {string} options.packageName  the published name of this library
 * @param {{ code: string, linkPrefix: string, t: { appBridgeTypes: Record<string, any> } }[]} options.locales
 * @param {(message: string) => never} options.fail
 */
export function generateAppBridgeTypes({ repoRoot, packageName, locales, fail }) {
  const assert = (condition, message) => {
    if (!condition) fail(`app-bridge types: ${message}`)
  }

  const pkgDir = path.join(repoRoot, 'node_modules', '@shopify', 'app-bridge-types')
  const dtsPath = path.join(pkgDir, 'dist', 'index.d.ts')
  assert(existsSync(dtsPath), `${dtsPath} not found. Is ${PACKAGE} installed?`)
  const version = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8')).version
  assert(typeof version === 'string' && version !== '', `${PACKAGE} package.json has no version`)

  const sf = ts.createSourceFile(dtsPath, readFileSync(dtsPath, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed })
  const subpath = `${packageName}/app-bridge`

  // -------------------------------------------------------------------------
  // Declarations
  // -------------------------------------------------------------------------

  /** @type {Map<string, { raw: string, name: string, node: ts.Node, jsDocHost: ts.Node, kind: string, exported: boolean, global: boolean }>} */
  const byRaw = new Map()
  const globalFolds = new Map() // global name -> raw name of the interface it extends

  for (const stmt of sf.statements) {
    const exported = !!stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    if (ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt) || ts.isEnumDeclaration(stmt)) {
      const raw = stmt.name.text
      assert(!byRaw.has(raw), `"${raw}" is declared more than once; merged declarations are not supported`)
      const kind = ts.isInterfaceDeclaration(stmt) ? 'interface' : ts.isEnumDeclaration(stmt) ? 'enum' : 'type'
      byRaw.set(raw, { raw, name: displayOf(raw), node: stmt, jsDocHost: stmt, kind, exported, global: false })
    } else if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        assert(ts.isIdentifier(decl.name), 'destructured variable declarations are not supported')
        const raw = decl.name.text
        assert(!byRaw.has(raw), `"${raw}" is declared more than once`)
        byRaw.set(raw, { raw, name: displayOf(raw), node: stmt, jsDocHost: decl, kind: 'const', exported, global: false })
      }
    } else if (ts.isModuleDeclaration(stmt) && stmt.flags & ts.NodeFlags.GlobalAugmentation) {
      for (const inner of stmt.body?.statements ?? []) {
        if (!ts.isInterfaceDeclaration(inner) || inner.members.length > 0) continue
        const heritage = inner.heritageClauses?.flatMap((c) => c.types) ?? []
        if (heritage.length !== 1 || !ts.isIdentifier(heritage[0].expression)) continue
        const base = heritage[0].expression.text
        if (base !== `${inner.name.text}$1` && displayOf(base) !== inner.name.text) continue
        globalFolds.set(inner.name.text, base)
      }
    } else if (!ts.isImportDeclaration(stmt) && !ts.isExportDeclaration(stmt)) {
      fail(`app-bridge types: unexpected top-level ${ts.SyntaxKind[stmt.kind]} in ${dtsPath}`)
    }
  }
  assert(byRaw.size > 100, `only ${byRaw.size} declarations found in ${dtsPath}`)
  assert(byRaw.has('ShopifyGlobal'), 'ShopifyGlobal is not declared')

  for (const [globalName, base] of globalFolds) {
    assert(byRaw.has(base), `global ${globalName} extends unknown ${base}`)
    byRaw.get(base).global = true
  }

  // Display name -> declaration. Each display name must be unique.
  const byName = new Map()
  for (const d of byRaw.values()) {
    assert(!byName.has(d.name), `"${d.raw}" and "${byName.get(d.name)?.raw}" would both be shown as "${d.name}"`)
    byName.set(d.name, d)
  }

  /** Raw identifier in a type position -> declaration, or undefined for external types. */
  const resolve = (raw) => byRaw.get(raw) ?? (globalFolds.has(raw) ? byRaw.get(globalFolds.get(raw)) : undefined)

  // -------------------------------------------------------------------------
  // References (type positions only; type parameters are scoped out)
  // -------------------------------------------------------------------------

  // A bare `Location` or `Image` would be the DOM type; showing `Location$1` as `Location`
  // is only safe while nothing references the DOM one.
  walkRefs(sf, (id) => {
    const d = byName.get(id.text)
    assert(!d || d.raw === id.text || globalFolds.has(id.text), `"${id.text}" is referenced but "${d?.raw}" would be shown under that name`)
  })

  for (const d of byRaw.values()) {
    d.refs = new Set()
    walkRefs(d.node, (id) => {
      const target = resolve(id.text)
      if (target && target !== d) d.refs.add(target.name)
    })
  }

  // -------------------------------------------------------------------------
  // Scope: roots and transitive closure
  // -------------------------------------------------------------------------

  const enDir = path.join(repoRoot, 'docs', 'app-bridge')
  const docNames = new Set()
  for (const file of readdirSync(enDir).filter((f) => f.endsWith('.md')).toSorted()) {
    for (const code of inlineCode(readFileSync(path.join(enDir, file), 'utf8'))) {
      const d = resolve(code) ?? byName.get(code)
      if (d) docNames.add(d.name)
    }
  }
  const roots = ['ShopifyGlobal', ...[...docNames].filter((n) => n !== 'ShopifyGlobal').toSorted(compareNames)]

  const onPage = new Set()
  const queue = [...roots]
  while (queue.length > 0) {
    const name = queue.shift()
    if (onPage.has(name)) continue
    onPage.add(name)
    queue.push(...[...byName.get(name).refs].toSorted(compareNames))
  }
  const types = [...onPage].map((n) => byName.get(n))

  // Types on the pages that reference each type.
  const referencedBy = new Map(types.map((d) => [d.name, []]))
  for (const d of types) for (const r of d.refs) referencedBy.get(r)?.push(d.name)

  // -------------------------------------------------------------------------
  // Pages: where each type is shown
  //
  // Roots are the types of the `shopify` members (the APIs, in the category of their
  // shopify.dev page; "other" without one) and the element interfaces. A root gets its
  // own heading on its page. Every other type belongs to the roots that reach it without
  // passing through another root:
  // - reached from one kind of root only (one category, "other" or elements): it is shown
  //   under the first of those roots, alphabetically;
  // - reached from two or more kinds, or from none: it goes to the other page.
  // -------------------------------------------------------------------------

  // Category of each `shopify` member, from the shopify.dev links in the API table of
  // use-app-bridge.md (`[`toast`](https://shopify.dev/docs/api/app-home/latest/apis/<category>/toast-api)`).
  const categoryOfMember = new Map()
  const useAppBridgeMd = readFileSync(path.join(enDir, 'use-app-bridge.md'), 'utf8')
  for (const [, member, category] of useAppBridgeMd.matchAll(
    /\[`(\w+)`\]\(https:\/\/shopify\.dev\/docs\/api\/app-home\/(?:[^)\s]*\/)?apis\/([a-z-]+)\/[^)\s]*\)/g,
  )) {
    if (!CATEGORIES.includes(category)) {
      console.warn(`[generate-docs] app-bridge types: shopify.${member} links to unknown category "${category}"; listed under Other APIs`)
      continue
    }
    if (!categoryOfMember.has(member)) categoryOfMember.set(member, category)
  }

  const shopifyGlobal = byName.get('ShopifyGlobal')
  /** @type {Map<string, string>} root type name -> category, 'other' or 'elements' */
  const rootKind = new Map()
  for (const member of shopifyGlobal.node.members) {
    const memberName = member.name ? member.name.getText(sf) : ''
    const targets = new Set()
    walkRefs(member, (id) => {
      const d = resolve(id.text)
      if (d && d !== shopifyGlobal) targets.add(d.name)
    })
    if (targets.size === 0) continue
    const category = categoryOfMember.get(memberName)
    if (!category && !UNCATEGORIZED_MEMBERS.has(memberName)) {
      console.warn(
        `[generate-docs] app-bridge types: shopify.${memberName} has no shopify.dev category link in docs/app-bridge/use-app-bridge.md; listed under Other APIs`,
      )
    }
    for (const name of [...targets].toSorted(compareNames)) if (!rootKind.has(name)) rootKind.set(name, category ?? 'other')
  }

  // Element roots: the element interfaces the App Bridge pages name, and those no other
  // element interface references (`_UIModalElement` stays under `UIModalElement`).
  const elementNames = new Set(types.map((d) => d.name).filter((n) => ELEMENT_NAME.test(n) && !rootKind.has(n) && n !== 'ShopifyGlobal'))
  for (const name of [...elementNames].toSorted(compareNames)) {
    if (docNames.has(name) || !referencedBy.get(name).some((r) => r !== name && elementNames.has(r))) rootKind.set(name, 'elements')
  }

  const rootNames = [...rootKind.keys()].toSorted(compareNames)
  const reachedBy = new Map() // type -> the roots that reach it, alphabetically
  const reachOrder = new Map() // root -> the types it reaches, breadth-first
  for (const root of rootNames) {
    const seen = new Set([root])
    const order = []
    const bfs = [root]
    while (bfs.length > 0) {
      for (const r of [...byName.get(bfs.shift()).refs].toSorted(compareNames)) {
        if (seen.has(r) || rootKind.has(r) || r === 'ShopifyGlobal') continue
        seen.add(r)
        order.push(r)
        bfs.push(r)
        if (!reachedBy.has(r)) reachedBy.set(r, [])
        reachedBy.get(r).push(root)
      }
    }
    reachOrder.set(root, order)
  }

  /** @type {Map<string, { page: string, owner: string | null }>} owner: the root it is shown under */
  const placement = new Map([['ShopifyGlobal', { page: 'index', owner: null }]])
  for (const name of rootNames) placement.set(name, { page: pageOfKind(rootKind.get(name)), owner: name })
  for (const d of types) {
    if (placement.has(d.name)) continue
    const by = reachedBy.get(d.name) ?? []
    const kinds = new Set(by.map((r) => rootKind.get(r)))
    placement.set(d.name, kinds.size === 1 ? { page: pageOfKind(rootKind.get(by[0])), owner: by[0] } : { page: 'other', owner: null })
  }

  const anchors = new Set([...Object.values(PAGE_ANCHORS), ...Object.values(SECTION_ANCHORS)])
  assert(anchors.size === Object.keys(PAGE_ANCHORS).length + Object.keys(SECTION_ANCHORS).length, 'page and section anchors are not unique')
  for (const d of types) {
    assert(!anchors.has(anchorOf(d.name)), `anchor "#${anchorOf(d.name)}" for ${d.name} is not unique`)
    anchors.add(anchorOf(d.name))
  }

  // Headings in page order: [name, level] per page.
  const isRootOf = (page) => (name) => placement.get(name).page === page && rootKind.has(name)
  const owned = (root) => reachOrder.get(root).filter((n) => placement.get(n).owner === root)
  const layout = Object.fromEntries(TYPE_PAGES.map((p) => [p, []]))
  layout.index.push(['ShopifyGlobal', 2])
  for (const page of [...CATEGORIES, 'elements']) {
    for (const root of rootNames.filter(isRootOf(page))) {
      layout[page].push([root, 2], ...owned(root).map((n) => [n, 3]))
    }
  }
  const otherApis = rootNames.filter(isRootOf('other'))
  for (const root of otherApis) layout.other.push([root, 3], ...owned(root).map((n) => [n, 3]))
  const sharedTypes = types
    .map((d) => d.name)
    .filter((n) => placement.get(n).page === 'other' && placement.get(n).owner === null)
    .toSorted(compareNames)
  for (const name of sharedTypes) layout.other.push([name, 3])

  // The root types each page shows as headings (its APIs or elements), for the page leads.
  const rootsOn = (page) => rootNames.filter(isRootOf(page))

  const shown = Object.values(layout).flat().map(([n]) => n)
  assert(shown.length === types.length && new Set(shown).size === types.length, `${shown.length} headings for ${types.length} types`)
  for (const [page, entries] of Object.entries(layout)) {
    for (const [name] of entries) assert(placement.get(name).page === page, `${name} is laid out on ${page} but placed on ${placement.get(name).page}`)
  }

  // -------------------------------------------------------------------------
  // Printing
  // -------------------------------------------------------------------------

  // Prints a node without comments, with `Name$1` shown as `Name`.
  const rename = (ctx) => {
    const visit = (n) =>
      ts.isIdentifier(n) && byRaw.has(n.text) && displayOf(n.text) !== n.text
        ? ts.factory.createIdentifier(displayOf(n.text))
        : ts.visitEachChild(n, visit, ctx)
    return (root) => ts.visitNode(root, visit)
  }
  function print(node) {
    const result = ts.transform(node, [rename])
    const text = printer.printNode(ts.EmitHint.Unspecified, result.transformed[0], sf)
    result.dispose()
    return text
  }

  // The page being written: its locale's strings, "Used in" mentions and link prefix.
  // `href(name)` is `#anchor` for a type on the same page, else the other page's URL.
  // `llm` is set for the English pages, the only ones the docs build copies to Markdown for
  // LLMs (vitepress-plugin-llms in docs/.vitepress/config.ts).
  /** @typedef {{ t: Record<string, any>, mentions: Map<string, string[]>, page: string, href: (name: string) => string, llm: boolean }} Ctx */

  // Printed type text as `<code>` HTML, with each type on the pages linked to its heading.
  // The text is parsed again so that only identifiers in type positions are linked.
  function codeHtml(text, ctx, { prefix = 'type __T = ', suffix = ';', scope = new Set() } = {}) {
    const flat = text.replace(/\n\s*/g, ' ')
    const src = ts.createSourceFile('__t.ts', prefix + flat + suffix, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    const links = []
    walkRefs(
      src,
      (id) => {
        if (onPage.has(id.text)) links.push({ start: id.getStart(src) - prefix.length, end: id.getEnd() - prefix.length, name: id.text })
      },
      scope,
    )
    links.sort((a, b) => a.start - b.start)
    let html = ''
    let at = 0
    for (const link of links) {
      if (link.start < at) continue
      html += escapeHtml(flat.slice(at, link.start)) + `<a href="${ctx.href(link.name)}">${escapeHtml(link.name)}</a>`
      at = link.end
    }
    html += escapeHtml(flat.slice(at))
    return `<code v-pre>${html}</code>`
  }

  // One member as a row of the member list: its declaration as TypeScript prints it
  // (`readonly action: string`, `invoke?(query: IntentQuery): Promise<IntentActivity>`), with
  // its name and `?` marked for styling, then its description.
  function memberRow(member, outerScope, ctx) {
    if (
      !ts.isPropertySignature(member) &&
      !ts.isMethodSignature(member) &&
      !ts.isCallSignatureDeclaration(member) &&
      !ts.isConstructSignatureDeclaration(member) &&
      !ts.isIndexSignatureDeclaration(member)
    ) {
      fail(`app-bridge types: unsupported member ${ts.SyntaxKind[member.kind]} at ${sf.getLineAndCharacterOfPosition(member.getStart(sf)).line + 1}`)
    }
    const printed = print(member).replace(/;\s*$/, '')
    // A property without a type annotation is `any`, as the old table said.
    const text = ts.isPropertySignature(member) && !member.type ? `${printed}: any` : printed
    let html = codeHtml(text, ctx, { prefix: 'interface __T { ', suffix: ' }', scope: outerScope })
    if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
      const name = escapeHtml(member.name.getText(sf))
      const head = `<code v-pre>${text.startsWith('readonly ') ? 'readonly ' : ''}`
      assert(html.startsWith(head + name), `member ${name} is not printed name first: ${html}`)
      const optional = member.questionToken ? '<span class="ab-opt">?</span>' : ''
      html = `${head}<span class="ab-name">${name}</span>${optional}${html.slice(head.length + name.length + (member.questionToken ? 1 : 0))}`
    }
    const description = describe(member, ctx)
    return [
      '<div class="ab-member">',
      '',
      `<p class="ab-sig">${html}</p>`,
      '',
      // The Markdown copy drops HTML, so it gets the signature as plain inline code.
      ...(ctx.llm ? ['<llm-only>', '', codeSpan(text), '', '</llm-only>', ''] : []),
      description || `<p class="ab-none">${escapeHtml(ctx.t.notDescribed)}</p>`,
      '',
      '</div>',
      '',
    ]
  }

  // -------------------------------------------------------------------------
  // JSDoc -> markdown
  // -------------------------------------------------------------------------

  function commentText(comment, ctx) {
    if (comment === undefined) return ''
    if (typeof comment === 'string') return shopifyLinks(comment)
    return comment
      .map((part) => {
        if (ts.isJSDocLink(part) || ts.isJSDocLinkCode(part) || ts.isJSDocLinkPlain(part)) {
          const name = part.name ? part.name.getText(sf) : ''
          const target = resolve(name)
          const label = (part.text ?? '').trim()
          if (target && onPage.has(target.name)) return typeLink(target.name, ctx)
          return label !== '' && name === '' ? label : `\`${name}${part.text ?? ''}\``
        }
        return shopifyLinks(part.text)
      })
      .join('')
  }

  // Markdown for a run of JSDoc text: paragraphs and list items kept apart, `<` and `>`
  // escaped outside code spans so VitePress never reads them as HTML, and `{` so it never
  // reads `{ type: 'x' }` at the end of a block as attributes.
  function markdown(text) {
    const lines = text.split('\n').map((l) => l.trim())
    let out = ''
    let blank = false
    for (const line of lines) {
      if (line === '') {
        blank = out !== ''
        continue
      }
      const sep = out === '' ? '' : blank ? '\n\n' : /^[-*] /.test(line) ? '\n' : ' '
      out += sep + line
      blank = false
    }
    return escapeOutsideCode(out)
  }

  function escapeOutsideCode(text) {
    let out = ''
    let i = 0
    while (i < text.length) {
      if (text[i] === '`') {
        let run = 1
        while (text[i + run] === '`') run++
        const close = text.indexOf('`'.repeat(run), i + run)
        if (close !== -1) {
          const span = text.slice(i, close + run)
          if (span.includes('{{')) fail(`app-bridge types: "{{" in a code span would be read by Vue: ${span}`)
          out += span
          i = close + run
          continue
        }
      }
      if (text.startsWith('<br>', i)) {
        out += '<br>'
        i += 4
        continue
      }
      const ch = text[i]
      out += ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '{' ? '&#123;' : ch
      i++
    }
    return out
  }

  // Summary plus @deprecated, @default/@defaultValue and @see, as markdown.
  function describe(node, ctx) {
    const { t } = ctx
    const docs = (node.jsDoc ?? []).filter((d) => ts.isJSDoc(d))
    const doc = docs.at(-1)
    if (!doc) return ''
    const parts = []
    const summary = commentText(doc.comment, ctx).trim()
    if (summary) parts.push(markdown(summary))
    for (const tag of doc.tags ?? []) {
      const name = tag.tagName.text
      const text = commentText(tag.comment, ctx).trim()
      if (name === 'deprecated') {
        parts.push(text ? `**${t.deprecated}** ${markdown(text)}` : `**${t.deprecated}**`)
      } else if (name === 'default' || name === 'defaultValue') {
        if (text) parts.push(`${t.default} ${/`/.test(text) ? markdown(text) : `\`${text}\``}`)
      } else if (name === 'see') {
        const target = `${tag.name ? tag.name.getText(sf) : ''}${text}`.trim()
        if (target) parts.push(`${t.see} ${/^https?:\/\/\S+$/.test(target) ? `[${target}](${target})` : markdown(target)}`)
      }
    }
    return parts.join('\n\n')
  }

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  // Each type's "Used in" pages, per locale: the locale's App Bridge pages that use the type
  // name as inline code.
  function pageMentions(loc, theme) {
    const dir = path.join(repoRoot, 'docs', loc.code === 'en' ? '' : loc.code, 'app-bridge')
    const files = readdirSync(dir).filter((f) => f.endsWith('.md'))
    const known = new Set(PAGES.map(([file]) => `${file}.md`))
    for (const file of files) {
      assert(known.has(file), `${path.relative(repoRoot, path.join(dir, file))} is not listed in PAGES`)
    }
    const mentions = new Map()
    for (const [file, key] of PAGES) {
      const full = path.join(dir, `${file}.md`)
      if (!existsSync(full)) continue
      const label = theme.sidebarAppBridge?.[key]
      assert(typeof label === 'string', `docs/locales/${loc.code}/theme.json has no sidebarAppBridge.${key}`)
      const link = `${loc.linkPrefix}/app-bridge/${file === 'index' ? '' : file}`
      for (const code of new Set(inlineCode(readFileSync(full, 'utf8')))) {
        const d = resolve(code) ?? byName.get(code)
        if (!d || !onPage.has(d.name)) continue
        if (!mentions.has(d.name)) mentions.set(d.name, [])
        mentions.get(d.name).push(`[${label}](${link})`)
      }
    }
    return mentions
  }

  // A type as one block: a header (its heading and kind), its description, import and
  // heritage lines, its members or declaration, and a footer with what it references and
  // where it is used. An H2 (an API or element on its page, or `ShopifyGlobal`) is a section;
  // an H3 is an entry under it.
  function renderType(d, level, ctx) {
    const { t, mentions } = ctx
    const node = d.node
    const scope = ts.isVariableStatement(node) ? new Set() : typeParamsOf(node)
    const isObjectAlias = ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type)
    const kind = ts.isTypeAliasDeclaration(node) && ts.isFunctionTypeNode(node.type) ? 'function' : d.kind

    const lines = [
      `<div class="ab-type ${level === 2 ? 'ab-section' : 'ab-entry'}">`,
      '',
      '<div class="ab-head">',
      '',
      `${'#'.repeat(level)} \`${d.name}\` {#${anchorOf(d.name)}}`,
      '',
      `<div class="ab-kind">${kind}</div>`,
      '',
      '</div>',
      '',
    ]
    const description = describe(d.jsDocHost, ctx)
    if (description) lines.push(description, '')

    const meta = []
    if (d.exported) meta.push(`${t.exported} \`import type { ${d.name} } from '${subpath}'\``)
    if (d.global) meta.push(t.global)
    const footer = []

    if (ts.isInterfaceDeclaration(node) || isObjectAlias) {
      if (node.typeParameters?.length) {
        const text = node.typeParameters.map((p) => print(p)).join(', ')
        meta.push(`${t.typeParameters} ${llmAlternative(codeHtml(text, ctx, { prefix: 'type __T<', suffix: '> = 0;' }), codeSpan(text), ctx)}`)
      }
      const heritage = ts.isInterfaceDeclaration(node) ? (node.heritageClauses?.flatMap((c) => c.types) ?? []) : []
      if (heritage.length > 0) {
        const html = heritage.map((h) => codeHtml(print(h), ctx, { scope })).join(', ')
        meta.push(`${t.extends} ${llmAlternative(html, heritage.map((h) => codeSpan(print(h))).join(', '), ctx)}`)
      }
    }
    if (meta.length > 0) lines.push('<div class="ab-meta">', '', ...meta.flatMap((m) => [m, '']), '</div>', '')

    if (ts.isInterfaceDeclaration(node) || isObjectAlias) {
      const members = ts.isInterfaceDeclaration(node) ? node.members : node.type.members
      if (members.length > 0) {
        lines.push('<div class="ab-members">', '')
        for (const m of members) lines.push(...memberRow(m, scope, ctx))
        lines.push('</div>', '')
      }
    } else {
      lines.push('<div class="ab-decl">', '', '```ts', print(node), '```', '', '</div>', '')
      const refs = [...d.refs].filter((r) => onPage.has(r)).toSorted(compareNames)
      if (refs.length > 0) footer.push(`<span class="ab-foot-part">${t.references} ${refs.map((r) => typeLink(r, ctx)).join(', ')}</span>`)
    }

    const usedIn = [
      ...(mentions.get(d.name) ?? []),
      ...referencedBy.get(d.name).toSorted(compareNames).map((r) => typeLink(r, ctx)),
    ]
    if (usedIn.length > 0) footer.push(`<span class="ab-foot-part">${t.usedIn} ${usedIn.join(', ')}</span>`)
    if (footer.length > 0) lines.push('<div class="ab-foot">', '', footer.join('\n'), '', '</div>', '')
    lines.push('</div>', '')
    return lines.join('\n')
  }

  // The page's APIs or elements, linked, joined with the locale's list separator.
  const rootList = (page, ctx) => rootsOn(page).map((n) => typeLink(n, ctx)).join(ctx.t.listSeparator)

  // The A–Z index on the overview: one group per initial letter, `_` prefixes ignored, laid
  // out in columns by the theme CSS.
  function azIndex(ctx) {
    const byLetter = new Map()
    for (const name of types.map((d) => d.name).toSorted(compareNames)) {
      const letter = name.replace(/^_+/, '')[0].toUpperCase()
      if (!byLetter.has(letter)) byLetter.set(letter, [])
      byLetter.get(letter).push(typeLink(name, ctx))
    }
    const groups = [...byLetter].map(([letter, links]) =>
      ['<div class="ab-az-group">', '', `<p class="ab-az-letter">${letter}</p>`, '', ...links.map((l) => `- ${l}`), '', '</div>'].join('\n'),
    )
    return ['<div class="ab-az">', '', ...groups.flatMap((g) => [g, '']), '</div>'].join('\n')
  }

  const jsonTypes = Object.fromEntries(
    types
      .map((d) => d.name)
      .toSorted(compareNames)
      .map((n) => [n, { page: placement.get(n).page, anchor: anchorOf(n) }]),
  )
  const jsonPath = path.join(repoRoot, 'docs', '.vitepress', 'app-bridge-types.json')
  writeFileSync(jsonPath, JSON.stringify({ package: PACKAGE, version, types: jsonTypes }, null, 2) + '\n')

  const stats = {}
  for (const loc of locales) {
    const t = loc.t.appBridgeTypes
    assert(t && typeof t === 'object', `locale "${loc.code}" has no appBridgeTypes strings in its generator.mjs`)
    const theme = JSON.parse(readFileSync(path.join(repoRoot, 'docs', 'locales', loc.code, 'theme.json'), 'utf8'))
    const labels = theme.sidebarAppBridge?.typesPages
    assert(typeof t.listSeparator === 'string' && typeof t.onThisPage === 'function', `locale "${loc.code}" has no appBridgeTypes.listSeparator or onThisPage`)
    for (const page of TYPE_PAGES.slice(1)) {
      assert(typeof labels?.[page] === 'string', `docs/locales/${loc.code}/theme.json has no sidebarAppBridge.typesPages["${page}"]`)
      for (const key of ['title', 'description', 'lead']) {
        assert(typeof t.pages?.[page]?.[key] === 'string', `locale "${loc.code}" has no appBridgeTypes.pages["${page}"].${key}`)
      }
    }
    const mentions = pageMentions(loc, theme)
    const dir = path.join(repoRoot, 'docs', loc.code === 'en' ? '' : loc.code, 'app-bridge', 'types')
    mkdirSync(dir, { recursive: true })
    const expected = new Set(TYPE_PAGES.map((p) => `${p}.md`))
    for (const file of readdirSync(dir)) if (file.endsWith('.md') && !expected.has(file)) rmSync(path.join(dir, file))

    for (const page of TYPE_PAGES) {
      /** @type {Ctx} */
      const ctx = {
        t,
        mentions,
        page,
        llm: loc.code === 'en',
        href: (name) => {
          const target = placement.get(name).page
          return `${target === page ? '' : pageUrl(loc, target)}#${anchorOf(name)}`
        },
      }
      const strings = page === 'index' ? t : t.pages[page]
      const out = [
        '---',
        `title: ${JSON.stringify(strings.title)}`,
        `description: ${JSON.stringify(strings.description)}`,
        // Scopes the types-page styles in docs/.vitepress/theme/custom.css ("App Bridge types").
        'pageClass: ab-types',
        '---',
        `<!-- Generated by scripts/generate-app-bridge-types.mjs from ${PACKAGE}@${version} — DO NOT EDIT. -->`,
        '',
        `# ${page === 'index' ? t.heading : labels[page]} {#${PAGE_ANCHORS[page]}}`,
        '',
      ]
      if (page === 'index') {
        out.push(t.intro(`[\`${PACKAGE}\`](${NPM_URL})`, version, `\`${subpath}\``), '')
        out.push(`## ${t.pagesHeading} {#${SECTION_ANCHORS.pages}}`, '')
        for (const p of TYPE_PAGES.slice(1)) {
          const list = rootList(p, ctx)
          out.push(`- [${labels[p]}](${pageUrl(loc, p)})${list ? `: ${list}` : ''}`)
        }
        out.push('')
        for (const [name, level] of layout.index) out.push(renderType(byName.get(name), level, ctx))
        out.push(`## ${t.azIndex} {#${SECTION_ANCHORS.azIndex}}`, '', azIndex(ctx), '')
      } else {
        const list = rootList(page, ctx)
        // No space after a CJK full stop (ja, zh).
        out.push(list ? `${strings.lead}${strings.lead.endsWith('。') ? '' : ' '}${t.onThisPage(list)}` : strings.lead, '')
        for (const [name, level] of layout[page]) {
          if (page === 'other' && name === otherApis[0]) out.push(`## ${t.otherApis} {#${SECTION_ANCHORS.otherApis}}`, '')
          if (page === 'other' && name === sharedTypes[0]) out.push(`## ${t.sharedTypes} {#${SECTION_ANCHORS.acrossCategories}}`, '')
          out.push(renderType(byName.get(name), level, ctx))
        }
      }
      const text = out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
      writeFileSync(path.join(dir, `${page}.md`), text)
      stats[page] ??= { types: layout[page].length, lines: {} }
      stats[page].lines[loc.code] = text.split('\n').length - 1
    }
  }

  // Ownership, for the generate-docs log: kind -> root -> number of types shown under it.
  const ownership = {}
  for (const root of rootNames) {
    const kind = rootKind.get(root)
    ownership[kind] ??= {}
    ownership[kind][root] = owned(root).length
  }

  return {
    version,
    count: types.length,
    roots,
    jsonPath,
    pages: stats,
    ownership,
    acrossCategories: sharedTypes.length,
  }
}

// The page a root of this kind (a category, 'elements' or 'other') is shown on.
const pageOfKind = (kind) => (CATEGORIES.includes(kind) ? kind : kind === 'elements' ? 'elements' : 'other')

/** @param {{ href: (name: string) => string }} ctx */
const typeLink = (name, ctx) => `[\`${name}\`](${ctx.href(name)})`

const pageUrl = (loc, page) => `${loc.linkPrefix}/app-bridge/types/${page === 'index' ? '' : page}`

// Shopify's links are written for shopify.dev: root-relative ones get its origin back, and
// in-page ones (`#rate-limits-restrictions`) point at headings this site doesn't have, so
// only their text is kept. (`{@link Type}` becomes a link to the type's heading.)
const shopifyLinks = (text) =>
  text.replace(/\]\(\/(?!\/)/g, '](https://shopify.dev/').replace(/\[([^\]]+)\]\(#[^)]*\)/g, '$1')

// The bundler renames a declaration that clashes with a global (`Location`, `Image`) or
// with the global interface that extends it (`UIModalElement`) to `Name$1`. The page uses
// the name without the suffix.
const displayOf = (raw) => raw.replace(/\$\d+$/, '')

const anchorOf = (name) => name.toLowerCase()

// Type text as one Markdown code span, with a backtick run longer than any inside it.
function codeSpan(text) {
  const flat = text.replace(/\n\s*/g, ' ')
  const fence = '`'.repeat(Math.max(0, ...(flat.match(/`+/g) ?? []).map((run) => run.length)) + 1)
  const pad = flat.startsWith('`') || flat.endsWith('`') ? ' ' : ''
  return `${fence}${pad}${flat}${pad}${fence}`
}

// Inline HTML for the page and its Markdown equivalent for the LLM copy (English only):
// the plugin removes `<llm-exclude>` content from the copy and `<llm-only>` from the page.
const llmAlternative = (html, markdown, ctx) =>
  ctx.llm ? `<llm-exclude>${html}</llm-exclude><llm-only>${markdown}</llm-only>` : html

const typeParamsOf = (node) => new Set((node.typeParameters ?? []).map((p) => p.name.text))

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '&#124;')

function leftmost(name) {
  let n = name
  while (ts.isQualifiedName(n) || ts.isPropertyAccessExpression(n)) n = ts.isQualifiedName(n) ? n.left : n.expression
  return ts.isIdentifier(n) ? n : undefined
}

/** Calls `onRef(identifier)` for every type reference under `root`. */
function walkRefs(root, onRef, outerScope = new Set()) {
  const visit = (node, scope) => {
    const params = [
      ...(node.typeParameters ?? []),
      ...(ts.isMappedTypeNode(node) || ts.isInferTypeNode(node) ? [node.typeParameter] : []),
    ]
    if (params.length > 0) scope = new Set([...scope, ...params.map((p) => p.name.text)])
    let id
    if (ts.isTypeReferenceNode(node)) id = leftmost(node.typeName)
    else if (ts.isExpressionWithTypeArguments(node)) id = leftmost(node.expression)
    else if (ts.isTypeQueryNode(node)) id = leftmost(node.exprName)
    if (id && !scope.has(id.text)) onRef(id)
    ts.forEachChild(node, (child) => visit(child, scope))
  }
  visit(root, outerScope)
}

// Sorts `_UIModalAttributes` next to `UIModalAttributes`; plain code-unit comparison, so the
// order never depends on the ICU data of the machine running the script.
function compareNames(a, b) {
  const ka = a.replace(/^_+/, '').toLowerCase()
  const kb = b.replace(/^_+/, '').toLowerCase()
  if (ka !== kb) return ka < kb ? -1 : 1
  return a < b ? -1 : a > b ? 1 : 0
}

// The contents of every inline code span in a markdown page, outside front matter and
// fenced code blocks (CommonMark backtick runs: a span closes on a run of the same length).
export function inlineCode(source) {
  const spans = []
  let text = source.replace(/^---\n[\s\S]*?\n---\n/, '')
  const kept = []
  let fence = null
  for (const line of text.split('\n')) {
    // Fences may be indented under a list item.
    const fenceLine = /^\s*(`{3,}|~{3,})/.exec(line)
    if (fence) {
      if (fenceLine && fenceLine[1][0] === fence[0] && fenceLine[1].length >= fence.length && line.trim() === fenceLine[1]) fence = null
      continue
    }
    if (fenceLine) {
      fence = fenceLine[1]
      continue
    }
    kept.push(line)
  }
  text = kept.join('\n')
  let i = 0
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2
      continue
    }
    if (text[i] !== '`') {
      i++
      continue
    }
    let run = 1
    while (text[i + run] === '`') run++
    const close = findRun(text, i + run, run)
    if (close === -1) {
      i += run
      continue
    }
    let content = text.slice(i + run, close).replace(/\n/g, ' ')
    if (content.startsWith(' ') && content.endsWith(' ') && content.trim() !== '') content = content.slice(1, -1)
    spans.push(content)
    i = close + run
  }
  return spans
}

function findRun(text, from, length) {
  let i = from
  while (i < text.length) {
    if (text[i] !== '`') {
      i++
      continue
    }
    let run = 1
    while (text[i + run] === '`') run++
    if (run === length) return i
    i += run
  }
  return -1
}
