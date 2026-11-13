/// <reference types="@shopify/app-bridge-types" />
import { defineComponent, h, nextTick, shallowRef, Teleport } from 'vue'
import { SaveBar } from './SaveBar'
import { splitModalChildren } from './splitModalChildren'
import { TitleBar } from './TitleBar'
import type { ModalProps, OverlayComponent } from './types'
import { useOverlaySync } from './useOverlaySync'

/**
 * Wrapper around the App Bridge `ui-modal` element. Mirrors `Modal` in
 * `@shopify/app-bridge-react` 4.3.0:
 *
 * - `open` calls `show()`/`hide()`, `show`/`hide` events are emitted, and `hide()`
 *   runs on unmount.
 * - A `TitleBar` (or `<ui-title-bar>`) and a `SaveBar` (or `<ui-save-bar>`) in the
 *   default slot stay as direct children of `ui-modal`.
 * - Everything else is teleported into the element's `content`, inside an empty
 *   `<div>` child. Until `ui-modal` is defined (and during SSR) the content is not
 *   rendered, as in React, where the portal is `null` until `modal.content` exists.
 *
 * @see https://shopify.dev/docs/api/app-bridge-library/react-components/modal
 */
export const Modal = /*@__PURE__*/ defineComponent({
  name: 'ui-modal',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['show', 'hide', 'update:open'],
  setup(props, { attrs, slots, emit }) {
    const elRef = shallowRef<UIModalElement | null>(null)
    const target = shallowRef<HTMLElement | null>(null)

    const resolveTarget = (): void => {
      const content = elRef.value?.content
      if (content && content !== target.value) target.value = content
    }

    useOverlaySync('ui-modal', elRef, props, emit, {
      // Place the content before the first show(), which copies it into the modal.
      beforeFirstSync: async () => {
        resolveTarget()
        await nextTick()
      },
      // Re-read in case App Bridge replaced `content` (UNVERIFIED whether it does).
      onShow: resolveTarget,
    })

    return () => {
      const { titleBar, saveBar, content } = splitModalChildren(
        slots.default?.() ?? [],
        (type) => type === TitleBar,
        (type) => type === SaveBar,
      )
      return h('ui-modal', { ...attrs, ref: elRef }, [
        titleBar,
        saveBar,
        h('div', null, target.value ? [h(Teleport, { to: target.value }, content)] : []),
      ])
    }
  },
}) as unknown as OverlayComponent<ModalProps, UIModalElement>
