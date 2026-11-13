import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type {
  AppWindowProps,
  ModalProps,
  NavMenuProps,
  SaveBarProps,
  ShopifyGlobal,
  TitleBarProps,
} from '../app-bridge'
import type { AppBridgeElementTagName } from '../app-bridge/elements'
import type { PageProps } from '../generated/types'

// Detects API drift in `@shopify/app-bridge-types`, which the hand-written wrappers in
// src/lib/app-bridge mirror. The sync workflow bumps the package and runs this spec.

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../../../')
const abtDir = path.join(repoRoot, 'node_modules', '@shopify', 'app-bridge-types')
const snapshotPath = path.resolve(here, '../app-bridge/abt-snapshot.json')

/** The `@shopify/app-bridge-react` version whose behaviour the wrappers mirror. */
const MIRRORED_APP_BRIDGE_REACT = '4.3.0'

/** ABT interfaces the wrappers depend on; their normalized text is hashed. */
const HASHED_INTERFACES = [
  'AppBridgeElements',
  'AugmentedElements',
  'MenuItemProperties',
  'UIModalAttributes',
  '_UIModalAttributes',
  '_UIModalElement',
  'UIModalElement$1',
  'UISaveBarAttributes',
  '_UISaveBarAttributes',
  '_UISaveBarElement',
  'UISaveBarElement$1',
  'UISaveBarChildren',
  'UITitleBarAttributes',
  '_UITitleBarAttributes',
  'UITitleBarChildren',
  'UITitleBarElement$1',
  'UINavMenuAttributes',
  'UINavMenuElement$1',
  'SAppWindowAttributes',
  '_SAppWindowElement',
  'SAppWindowElement$1',
  'SAppNavAttributes',
  'SAppNavLinkAttributes',
  'SAppNavElement$1',
  'SPageElement',
  'SPageChildren',
]

const abtSource = readFileSync(path.join(abtDir, 'dist', 'index.d.ts'), 'utf8')
const abtVersion = (
  JSON.parse(readFileSync(path.join(abtDir, 'package.json'), 'utf8')) as { version: string }
).version

/** The text of a top-level `interface Name ... {` block, up to its closing `}` at column 0. */
function interfaceBlock(name: string): string {
  const escaped = name.replace(/[$]/g, '\\$')
  const match = new RegExp(
    `^(?:export )?interface ${escaped}\\b[^\\n]*\\{\\n[\\s\\S]*?^\\}`,
    'm',
  ).exec(abtSource)
  if (!match) throw new Error(`interface ${name} not found in @shopify/app-bridge-types`)
  return match[0]
}

/** JSDoc and whitespace are stripped, so only structural changes change the hash. */
function normalizedHash(block: string): string {
  const normalized = block
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return createHash('sha256').update(normalized).digest('hex')
}

/** Top-level member names of an interface block (`"ui-modal": ...` or `heading?: ...`). */
function memberNames(block: string): string[] {
  const body = block.replace(/\/\*[\s\S]*?\*\//g, '')
  return [...body.matchAll(/^\t"?([\w$-]+)"?\??:/gm)].map((m) => m[1]!).toSorted()
}

describe('@shopify/app-bridge-types drift', () => {
  it('declares the App Bridge elements the wrappers and raw-tag types cover', () => {
    expect(
      memberNames(interfaceBlock('AppBridgeElements')),
      'New or removed App Bridge element: add or remove a wrapper in src/lib/app-bridge and a GlobalComponents entry in src/lib/app-bridge/elements.ts',
    ).toEqual([
      's-app-nav',
      's-app-window',
      's-page',
      'ui-modal',
      'ui-nav-menu',
      'ui-save-bar',
      'ui-title-bar',
    ])
  })

  it('keeps the s-page title-bar slots that SPage forwards', () => {
    expect(
      memberNames(interfaceBlock('SPageChildren')),
      'The s-page title-bar slots changed: check SPage and the App Bridge docs page',
    ).toEqual(['accessory', 'breadcrumbActions', 'primaryAction', 'secondaryActions'])
    expect(memberNames(interfaceBlock('SPageElement'))).toEqual(['children', 'heading'])
  })

  it('matches the reviewed interface snapshot', () => {
    const interfaces = Object.fromEntries(
      HASHED_INTERFACES.map((name) => [name, normalizedHash(interfaceBlock(name))]),
    )
    if (process.env.UPDATE_APP_BRIDGE_SNAPSHOT) {
      const snapshot = {
        appBridgeTypes: abtVersion,
        appBridgeReact: MIRRORED_APP_BRIDGE_REACT,
        interfaces,
      }
      writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`)
    }
    const recorded = JSON.parse(readFileSync(snapshotPath, 'utf8')) as {
      appBridgeTypes: string
      appBridgeReact: string
      interfaces: Record<string, string>
    }
    expect(recorded.appBridgeReact).toBe(MIRRORED_APP_BRIDGE_REACT)
    expect(
      interfaces,
      `An App Bridge interface changed since @shopify/app-bridge-types ${recorded.appBridgeTypes} (now ${abtVersion}). Review the wrappers in src/lib/app-bridge against the diff, then run \`UPDATE_APP_BRIDGE_SNAPSHOT=1 npx vitest run app-bridge-drift\``,
    ).toEqual(recorded.interfaces)
  })

  it('keeps the element methods and events the wrappers call', () => {
    expectTypeOf<UIModalElement['show']>().toEqualTypeOf<() => Promise<void>>()
    expectTypeOf<UIModalElement['hide']>().toEqualTypeOf<() => Promise<void>>()
    expectTypeOf<UIModalElement['content']>().toEqualTypeOf<HTMLElement | undefined>()
    expectTypeOf<UISaveBarElement['show']>().toEqualTypeOf<() => Promise<void>>()
    expectTypeOf<UISaveBarElement['hide']>().toEqualTypeOf<() => Promise<void>>()
    expectTypeOf<UISaveBarElement['discardConfirmation']>().toEqualTypeOf<boolean>()
    expectTypeOf<SAppWindowElement['show']>().toEqualTypeOf<() => Promise<void>>()
    expectTypeOf<SAppWindowElement['hide']>().toEqualTypeOf<() => Promise<void>>()
    expectTypeOf<Parameters<UIModalElement['addEventListener']>[0]>().toEqualTypeOf<
      'show' | 'hide'
    >()
    expectTypeOf<Parameters<UISaveBarElement['addEventListener']>[0]>().toEqualTypeOf<
      'show' | 'hide'
    >()
    expectTypeOf<Parameters<SAppWindowElement['addEventListener']>[0]>().toEqualTypeOf<
      'show' | 'hide'
    >()
    expectTypeOf<typeof shopify>().toEqualTypeOf<ShopifyGlobal>()
  })

  it('keeps the wrapper prop sets', () => {
    expectTypeOf<keyof ModalProps>().toEqualTypeOf<'id' | 'variant' | 'src' | 'open'>()
    expectTypeOf<keyof SaveBarProps>().toEqualTypeOf<'id' | 'discardConfirmation' | 'open'>()
    expectTypeOf<keyof AppWindowProps>().toEqualTypeOf<'id' | 'src' | 'open'>()
    expectTypeOf<AppWindowProps['src']>().toEqualTypeOf<string>()
    expectTypeOf<keyof TitleBarProps>().toEqualTypeOf<'title'>()
    expectTypeOf<keyof NavMenuProps>().toEqualTypeOf<never>()
  })

  it('types every raw App Bridge tag except s-page, which SPage already covers', () => {
    expectTypeOf<AppBridgeElementTagName>().toEqualTypeOf<
      'ui-modal' | 'ui-save-bar' | 's-app-window' | 'ui-title-bar' | 'ui-nav-menu' | 's-app-nav'
    >()
    expectTypeOf<JSX.IntrinsicElements['s-page']['heading']>().toEqualTypeOf<PageProps['heading']>()
  })
})
