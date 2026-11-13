import type { VNode } from 'vue'
import type {
  SAppWindowAttributes,
  UIModalAttributes,
  UINavMenuAttributes,
  UISaveBarAttributes,
  UITitleBarAttributes,
} from '@shopify/app-bridge-types'
import type { EventListenerProps } from '../runtime/createWrapper'

/**
 * Events that `ui-modal`, `ui-save-bar` and `s-app-window` dispatch
 * (`addEventListener(type: "show" | "hide", ...)` in `@shopify/app-bridge-types`).
 */
export interface OverlayEvents {
  show: Event
  hide: Event
}

export interface OverlayOpenProps {
  /**
   * Whether the element is shown. Mirrors `open` in `@shopify/app-bridge-react`.
   * Use `v-model:open` to keep it in sync when App Bridge closes the element.
   * @defaultValue false
   */
  open?: boolean
}

/**
 * Props of the `Modal` component (`ui-modal`). Note: the main `polaris-vue-elements`
 * entry also exports a `ModalProps`, for `SModal` (`s-modal`).
 */
export type ModalProps = Omit<UIModalAttributes, 'children'> & OverlayOpenProps
/** Props of the `SaveBar` component (`ui-save-bar`). */
export type SaveBarProps = Omit<UISaveBarAttributes, 'children'> & OverlayOpenProps
/** Props of the `AppWindow` component (`s-app-window`). `src` is required. */
export type AppWindowProps = SAppWindowAttributes & OverlayOpenProps
/** Props of the `TitleBar` component (`ui-title-bar`). */
export type TitleBarProps = Omit<UITitleBarAttributes, 'children'>
/** Props of the `NavMenu` component (`ui-nav-menu`). */
export type NavMenuProps = Omit<UINavMenuAttributes, 'children'>

/** Default slot of a component that renders children. */
export interface DefaultSlot {
  default?: () => VNode[]
}

/**
 * Constructor-shaped component type, in the style of `WrapperComponent` in
 * `runtime/createWrapper.ts`, for `Modal`, `SaveBar` and `AppWindow`. `El` is not
 * constrained to `HTMLElement`: App Bridge's element interfaces omit some
 * `HTMLElement` members (for example `UITitleBarElement` omits `title`).
 */
export type OverlayComponent<P, El, S = DefaultSlot> = {
  new (): {
    $props: P &
      EventListenerProps<OverlayEvents> & {
        'onUpdate:open'?: (open: boolean) => void
      }
    $slots: S
    $el: El
  }
}

/** Constructor-shaped component type for `TitleBar` and `NavMenu`. */
export type PassThroughComponent<P, El> = {
  new (): {
    $props: P
    $slots: DefaultSlot
    $el: El
  }
}

/**
 * The type of a raw App Bridge tag in a Vue template, used by the opt-in
 * `polaris-vue-elements/app-bridge/elements` augmentation of `GlobalComponents`.
 */
export type AppBridgeElementTag<P, E = Record<string, never>, El = HTMLElement> = {
  new (): {
    $props: P & EventListenerProps<E>
    $el: El
  }
}
