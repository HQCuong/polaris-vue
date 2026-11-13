/// <reference types="@shopify/app-bridge-types" />
import { defineComponent, h, shallowRef, watch } from 'vue'
import type { OverlayComponent, SaveBarProps } from './types'
import { useOverlaySync } from './useOverlaySync'

/**
 * A boolean prop is on for `true` and for the empty string (a bare attribute). Copied
 * from `runtime/createWrapper.ts` on purpose: sharing a module with the main entry
 * would make Rollup emit a shared chunk that `dist/index.js` imports.
 */
function isBooleanOn(value: unknown): boolean {
  return value === '' || Boolean(value)
}

/**
 * Wrapper around the App Bridge `ui-save-bar` element. Mirrors `SaveBar` in
 * `@shopify/app-bridge-react` 4.3.0: `open` calls `show()`/`hide()`, `show`/`hide`
 * events are emitted, and `hide()` runs on unmount. Put a `<button variant="primary">`
 * (Save) and a `<button>` (Discard) in the default slot.
 *
 * @see https://shopify.dev/docs/api/app-bridge-library/react-components/savebar
 */
export const SaveBar = /*@__PURE__*/ defineComponent({
  name: 'ui-save-bar',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: false },
    // Assigned as a DOM property: `@shopify/app-bridge-types` documents only the
    // `discardConfirmation` getter/setter, not an attribute name.
    discardConfirmation: { type: null, default: undefined },
  },
  emits: ['show', 'hide', 'update:open'],
  setup(props, { attrs, slots, emit }) {
    const elRef = shallowRef<UISaveBarElement | null>(null)

    const applyDiscardConfirmation = (): void => {
      const el = elRef.value
      if (!el || props.discardConfirmation === undefined) return
      el.discardConfirmation = isBooleanOn(props.discardConfirmation)
    }

    const sync = useOverlaySync('ui-save-bar', elRef, props, emit, {
      beforeFirstSync: applyDiscardConfirmation,
    })
    watch(
      () => props.discardConfirmation,
      () => {
        if (sync.isReady()) applyDiscardConfirmation()
      },
    )

    return () => h('ui-save-bar', { ...attrs, ref: elRef }, slots.default?.())
  },
}) as unknown as OverlayComponent<SaveBarProps, UISaveBarElement>
