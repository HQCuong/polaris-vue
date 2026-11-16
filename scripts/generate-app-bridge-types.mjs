// Generates the App Bridge types reference, docs/app-bridge/types.md and its translations
// docs/<code>/app-bridge/types.md, plus docs/.vitepress/app-bridge-types.json (type name ->
// anchor), which the markdown-it plugin in docs/.vitepress/config.ts uses to link inline
// code such as `ToastApi` on the App Bridge pages to its entry. Called by
// scripts/generate-docs.mjs.
//
// Source: @shopify/app-bridge-types' dist/index.d.ts, parsed with the TypeScript compiler
// API. Every member, type and description printed comes from that file, so the page cannot
// say anything the types don't. Descriptions stay in Shopify's English in every locale; only
// the page chrome (docs/locales/<code>/generator.mjs, `appBridgeTypes`) is translated.
//
// Scope: `ShopifyGlobal`, every type name used as inline code on the English App Bridge
// pages (docs/app-bridge/*.md), and everything those reference, transitively. Global
// augmentations (`declare global`) are left out, except the element interfaces declared
// there as `interface X extends X$1 {}`, which are shown under their global name.
//
// Deterministic: running it twice gives no diff.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
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

const GROUPS = ['apis', 'elements', 'other']
const GROUP_ANCHORS = { apis: 'apis', elements: 'elements-and-attributes', other: 'other-types' }
const PAGE_ANCHOR = 'app-bridge-types'

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
  for (const file of readdirSync(enDir).filter((f) => f.endsWith('.md') && f !== 'types.md').toSorted()) {
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

  const anchors = new Set([PAGE_ANCHOR, ...Object.values(GROUP_ANCHORS)])
  for (const d of types) {
    assert(!anchors.has(anchorOf(d.name)), `anchor "#${anchorOf(d.name)}" for ${d.name} is not unique`)
    anchors.add(anchorOf(d.name))
  }

  // Groups: ShopifyGlobal and the declared types of its members; element interfaces,
  // their attributes and children; everything else.
  const shopifyGlobal = byName.get('ShopifyGlobal')
  const apiNames = new Set(['ShopifyGlobal'])
  for (const member of shopifyGlobal.node.members) {
    if (member.type && ts.isTypeReferenceNode(member.type)) {
      const target = resolve(leftmost(member.type.typeName)?.text ?? '')
      if (target) apiNames.add(target.name)
    }
  }
  const groupOf = (d) =>
    apiNames.has(d.name) ? 'apis' : /(Element|Elements|Attributes|Children)$/.test(d.name) ? 'elements' : 'other'

  // Types on the page that reference each type.
  const referencedBy = new Map(types.map((d) => [d.name, []]))
  for (const d of types) for (const r of d.refs) referencedBy.get(r)?.push(d.name)

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

  // Printed type text as `<code>` HTML, with each type on the page linked to its heading.
  // The text is parsed again so that only identifiers in type positions are linked.
  function codeHtml(text, { prefix = 'type __T = ', suffix = ';', scope = new Set() } = {}) {
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
      html += escapeHtml(flat.slice(at, link.start)) + `<a href="#${anchorOf(link.name)}">${escapeHtml(link.name)}</a>`
      at = link.end
    }
    html += escapeHtml(flat.slice(at))
    return `<code v-pre>${html}</code>`
  }

  function memberRow(member, outerScope, t) {
    const optional = member.questionToken ? '?' : ''
    const readonly = member.modifiers?.some((m) => m.kind === ts.SyntaxKind.ReadonlyKeyword) ? 'readonly ' : ''
    let label
    let typeText
    if (ts.isPropertySignature(member)) {
      label = `${readonly}${member.name.getText(sf)}${optional}`
      typeText = member.type ? print(member.type) : 'any'
    } else if (ts.isMethodSignature(member) || ts.isCallSignatureDeclaration(member) || ts.isConstructSignatureDeclaration(member)) {
      const fn = ts.factory.createFunctionTypeNode(member.typeParameters, member.parameters, member.type ?? ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword))
      typeText = print(fn)
      if (ts.isConstructSignatureDeclaration(member)) typeText = `new ${typeText}`
      label = ts.isMethodSignature(member) ? `${member.name.getText(sf)}${optional}()` : ts.isCallSignatureDeclaration(member) ? '()' : 'new ()'
    } else if (ts.isIndexSignatureDeclaration(member)) {
      label = `${readonly}[${member.parameters.map((p) => print(p)).join(', ')}]`
      typeText = print(member.type)
    } else {
      fail(`app-bridge types: unsupported member ${ts.SyntaxKind[member.kind]} at ${sf.getLineAndCharacterOfPosition(member.getStart(sf)).line + 1}`)
    }
    const description = describe(member, t, { inline: true })
    return [`\`${label}\``, codeHtml(typeText, { scope: outerScope }), description || t.notDescribed]
  }

  // -------------------------------------------------------------------------
  // JSDoc -> markdown
  // -------------------------------------------------------------------------

  function commentText(comment) {
    if (comment === undefined) return ''
    if (typeof comment === 'string') return comment
    return comment
      .map((part) => {
        if (ts.isJSDocLink(part) || ts.isJSDocLinkCode(part) || ts.isJSDocLinkPlain(part)) {
          const name = part.name ? part.name.getText(sf) : ''
          const target = resolve(name)
          const label = (part.text ?? '').trim()
          if (target && onPage.has(target.name)) return `[\`${target.name}\`](#${anchorOf(target.name)})`
          return label !== '' && name === '' ? label : `\`${name}${part.text ?? ''}\``
        }
        return part.text
      })
      .join('')
  }

  // Markdown for a run of JSDoc text: paragraphs and list items kept apart with `<br>` (one
  // line in a table cell), `<` and `>` escaped outside code spans so VitePress never reads
  // them as HTML, and pipes escaped for tables.
  // Shopify's links are written for shopify.dev: root-relative ones get its origin back, and
  // in-page ones (`#rate-limits-restrictions`) point at headings this site doesn't have, so
  // only their text is kept.
  function markdown(text, { inline }) {
    const linked = text
      .replace(/\]\(\/(?!\/)/g, '](https://shopify.dev/')
      .replace(/\[([^\]]+)\]\(#[^)]*\)/g, '$1')
    const lines = linked.split('\n').map((l) => l.trim())
    let out = ''
    let blank = false
    for (const line of lines) {
      if (line === '') {
        blank = out !== ''
        continue
      }
      const sep = out === '' ? '' : blank ? (inline ? '<br><br>' : '\n\n') : /^[-*] /.test(line) ? (inline ? '<br>' : '\n') : ' '
      out += sep + line
      blank = false
    }
    return escapeOutsideCode(out, inline)
  }

  function escapeOutsideCode(text, inline) {
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
          out += inline ? span.replace(/\|/g, '\\|') : span
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
      out += ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '{' && text[i + 1] === '{' ? '&#123;' : ch === '|' && inline ? '\\|' : ch
      i++
    }
    return out
  }

  // Summary plus @deprecated, @default/@defaultValue and @see, as markdown.
  function describe(node, t, { inline }) {
    const docs = (node.jsDoc ?? []).filter((d) => ts.isJSDoc(d))
    const doc = docs.at(-1)
    if (!doc) return ''
    const parts = []
    const summary = commentText(doc.comment).trim()
    if (summary) parts.push(markdown(summary, { inline }))
    for (const tag of doc.tags ?? []) {
      const name = tag.tagName.text
      const text = commentText(tag.comment).trim()
      if (name === 'deprecated') {
        parts.push(text ? `**${t.deprecated}** ${markdown(text, { inline })}` : `**${t.deprecated}**`)
      } else if (name === 'default' || name === 'defaultValue') {
        if (text) parts.push(`${t.default} ${/`/.test(text) ? markdown(text, { inline }) : `\`${inline ? text.replace(/\|/g, '\\|') : text}\``}`)
      } else if (name === 'see') {
        const target = `${tag.name ? tag.name.getText(sf) : ''}${text}`.trim()
        if (target) parts.push(`${t.see} ${/^https?:\/\/\S+$/.test(target) ? `[${target}](${target})` : markdown(target, { inline })}`)
      }
    }
    return parts.join(inline ? ' ' : '\n\n')
  }

  // -------------------------------------------------------------------------
  // Pages
  // -------------------------------------------------------------------------

  // Each type's "Used in" pages, per locale: the locale's App Bridge pages that use the type
  // name as inline code.
  function pageMentions(loc) {
    const dir = path.join(repoRoot, 'docs', loc.code === 'en' ? '' : loc.code, 'app-bridge')
    const theme = JSON.parse(readFileSync(path.join(repoRoot, 'docs', 'locales', loc.code, 'theme.json'), 'utf8'))
    const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'types.md')
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

  function renderType(d, t, mentions) {
    const lines = [`### \`${d.name}\` {#${anchorOf(d.name)}}`, '']
    const description = describe(d.jsDocHost, t, { inline: false })
    if (description) lines.push(description, '')

    if (d.exported) lines.push(`${t.exported} \`import type { ${d.name} } from '${subpath}'\``, '')
    if (d.global) lines.push(t.global, '')

    const node = d.node
    const scope = ts.isVariableStatement(node) ? new Set() : typeParamsOf(node)
    const isObjectAlias = ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type)

    if (ts.isInterfaceDeclaration(node) || isObjectAlias) {
      if (node.typeParameters?.length) {
        const text = node.typeParameters.map((p) => print(p)).join(', ')
        lines.push(`${t.typeParameters} ${codeHtml(text, { prefix: 'type __T<', suffix: '> = 0;' })}`, '')
      }
      const heritage = ts.isInterfaceDeclaration(node) ? (node.heritageClauses?.flatMap((c) => c.types) ?? []) : []
      if (heritage.length > 0) {
        lines.push(`${t.extends} ${heritage.map((h) => codeHtml(print(h), { scope })).join(', ')}`, '')
      }
      const members = ts.isInterfaceDeclaration(node) ? node.members : node.type.members
      if (members.length > 0) {
        lines.push(`| ${t.table.member} | ${t.table.type} | ${t.table.description} |`, '| --- | --- | --- |')
        for (const m of members) lines.push(`| ${memberRow(m, scope, t).join(' | ')} |`)
        lines.push('')
      }
    } else {
      lines.push('```ts', print(node), '```', '')
      const refs = [...d.refs].filter((r) => onPage.has(r)).toSorted(compareNames)
      if (refs.length > 0) lines.push(`${t.references} ${refs.map(typeLink).join(', ')}`, '')
    }

    const usedIn = [
      ...(mentions.get(d.name) ?? []),
      ...referencedBy.get(d.name).toSorted(compareNames).map(typeLink),
    ]
    if (usedIn.length > 0) lines.push(`${t.usedIn} ${usedIn.join(', ')}`, '')
    return lines.join('\n')
  }

  const names = Object.fromEntries(types.map((d) => d.name).toSorted(compareNames).map((n) => [n, anchorOf(n)]))
  const jsonPath = path.join(repoRoot, 'docs', '.vitepress', 'app-bridge-types.json')
  writeFileSync(jsonPath, JSON.stringify({ package: PACKAGE, version, anchors: names }, null, 2) + '\n')

  for (const loc of locales) {
    const t = loc.t.appBridgeTypes
    assert(t && typeof t === 'object', `locale "${loc.code}" has no appBridgeTypes strings in its generator.mjs`)
    const mentions = pageMentions(loc)
    const out = [
      '---',
      `title: ${JSON.stringify(t.title)}`,
      `description: ${JSON.stringify(t.description)}`,
      '---',
      `<!-- Generated by scripts/generate-app-bridge-types.mjs from ${PACKAGE}@${version} — DO NOT EDIT. -->`,
      '',
      `# ${t.heading} {#${PAGE_ANCHOR}}`,
      '',
      t.intro(`[\`${PACKAGE}\`](${NPM_URL})`, version, `\`${subpath}\``),
      '',
    ]
    for (const group of GROUPS) {
      const inGroup = types.filter((d) => groupOf(d) === group).toSorted((a, b) => compareNames(a.name, b.name))
      if (inGroup.length === 0) continue
      out.push(`## ${t.groups[group]} {#${GROUP_ANCHORS[group]}}`, '')
      for (const d of inGroup) out.push(renderType(d, t, mentions))
    }
    const dir = path.join(repoRoot, 'docs', loc.code === 'en' ? '' : loc.code, 'app-bridge')
    mkdirSync(dir, { recursive: true })
    writeFileSync(path.join(dir, 'types.md'), out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n')
  }

  return {
    version,
    count: types.length,
    roots,
    jsonPath,
    groups: Object.fromEntries(GROUPS.map((g) => [g, types.filter((d) => groupOf(d) === g).length])),
  }
}

// The bundler renames a declaration that clashes with a global (`Location`, `Image`) or
// with the global interface that extends it (`UIModalElement`) to `Name$1`. The page uses
// the name without the suffix.
const displayOf = (raw) => raw.replace(/\$\d+$/, '')

const anchorOf = (name) => name.toLowerCase()

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

const typeLink = (name) => `[\`${name}\`](#${anchorOf(name)})`

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
