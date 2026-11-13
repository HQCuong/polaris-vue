/// <reference types="@shopify/app-bridge-types" />
import { defineComponent, h, shallowRef } from 'vue'
import type { AppWindowProps, OverlayComponent } from './types'
import { useOverlaySync } from './useOverlaySync'

/**
 * Wrapper around the App Bridge `s-app-window` element, a fullscreen window that loads
 * `src` in an iframe. Mirrors `AppWindow` in `@shopify/app-bridge-react` 4.3.0: `open`
 * calls `show()`/`hide()`, `show`/`hide` events are emitted, and `hide()` runs on
 * unmount. It has no slot: `SAppWindowAttributes` defines no children.
 */
export const AppWindow = /*@__PURE__*/ defineComponent({
  name: 's-app-window',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['show', 'hide', 'update:open'],
  setup(props, { attrs, emit }) {
    const elRef = shallowRef<SAppWindowElement | null>(null)
    useOverlaySync('s-app-window', elRef, props, emit)
    return () => h('s-app-window', { ...attrs, ref: elRef })
  },
}) as unknown as OverlayComponent<AppWindowProps, SAppWindowElement, Record<never, never>>
