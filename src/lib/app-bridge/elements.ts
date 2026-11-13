// Opt-in template types for raw App Bridge tags, published as the types-only
// `polaris-vue-elements/app-bridge/elements` subpath (same pattern as
// `polaris-vue-elements/elements`). Add it to `compilerOptions.types` to type-check
// `<ui-modal>`, `<ui-save-bar>`, `<ui-title-bar>`, `<ui-nav-menu>`, `<s-app-window>` and
// `<s-app-nav>` in Vue templates. `s-page` is not declared here: it is already typed by
// `polaris-vue-elements/elements`.
import type {
  SAppNavAttributes,
  SAppWindowAttributes,
  UIModalAttributes,
  UINavMenuAttributes,
  UISaveBarAttributes,
  UITitleBarAttributes,
} from '@shopify/app-bridge-types'
import type { AppBridgeElementTag, OverlayEvents } from './types'

type NoChildren<T> = Omit<T, 'children'>

/** The raw App Bridge tags this file types (every `AppBridgeElements` key except `s-page`). */
export type AppBridgeElementTagName =
  | 'ui-modal'
  | 'ui-save-bar'
  | 's-app-window'
  | 'ui-title-bar'
  | 'ui-nav-menu'
  | 's-app-nav'

declare module 'vue' {
  interface GlobalComponents {
    'ui-modal': AppBridgeElementTag<NoChildren<UIModalAttributes>, OverlayEvents, UIModalElement>
    'ui-save-bar': AppBridgeElementTag<
      NoChildren<UISaveBarAttributes>,
      OverlayEvents,
      UISaveBarElement
    >
    's-app-window': AppBridgeElementTag<SAppWindowAttributes, OverlayEvents, SAppWindowElement>
    'ui-title-bar': AppBridgeElementTag<
      NoChildren<UITitleBarAttributes>,
      Record<string, never>,
      UITitleBarElement
    >
    'ui-nav-menu': AppBridgeElementTag<
      NoChildren<UINavMenuAttributes>,
      Record<string, never>,
      UINavMenuElement
    >
    's-app-nav': AppBridgeElementTag<
      NoChildren<SAppNavAttributes>,
      Record<string, never>,
      SAppNavElement
    >
  }

  // Mirrors the `React.ButtonHTMLAttributes` / `AnchorHTMLAttributes` augmentation in
  // `@shopify/app-bridge-types`: buttons and links inside `ui-title-bar` and
  // `ui-save-bar` take `variant`, `tone` and `loading`.
  interface ButtonHTMLAttributes {
    variant?: HTMLButtonElement['variant']
    tone?: HTMLButtonElement['tone']
    loading?: HTMLButtonElement['loading']
  }
  interface AnchorHTMLAttributes {
    variant?: HTMLAnchorElement['variant']
    tone?: HTMLAnchorElement['tone']
    loading?: HTMLAnchorElement['loading']
  }
}
