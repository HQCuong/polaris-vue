/// <reference types="@shopify/app-bridge-types" />
import { onBeforeUnmount, onMounted, watch, type ShallowRef } from 'vue'

/** The App Bridge elements whose open state the wrappers sync. */
export type OverlayElement = UIModalElement | UISaveBarElement | SAppWindowElement

export type OverlayEmit = (event: 'show' | 'hide' | 'update:open', ...args: unknown[]) => void

export interface OverlaySyncHooks {
  /** Runs once the tag is defined, before the first `show()`/`hide()`. */
  beforeFirstSync?: () => void | Promise<void>
  /** Runs on every native `show` event, before `show` is emitted. */
  onShow?: () => void
}

export interface OverlaySync {
  /** True once the tag is defined and the first sync has run. */
  isReady: () => boolean
}

// Declared locally so the library needs no Node types. Bundlers replace
// `process.env.NODE_ENV` in the consumer's build; the `typeof` guard covers the rest.
declare const process: { env: { NODE_ENV?: string } } | undefined

const MISSING_TAG_WARNING_DELAY = 3000

/**
 * Syncs the `open` prop of an App Bridge overlay element with its `show()`/`hide()`
 * methods, and its native `show`/`hide` events with Vue emits.
 *
 * Mirrors the effects of `Modal`, `SaveBar` and `AppWindow` in
 * `@shopify/app-bridge-react` 4.3.0: `open ? show() : hide()` whenever the element or
 * `open` changes (so `hide()` also runs on mount when `open` is false), `onShow`/`onHide`
 * listeners, and `hide()` on unmount. Differences:
 *
 * - The first sync waits for `customElements.whenDefined(tag)`, so a late App Bridge
 *   script still gets the initial state.
 * - `update:open` is emitted only when the element's state differs from `open`.
 * - `hide()` on unmount runs in `onBeforeUnmount`, while the element is still in the
 *   document; React's cleanup runs after the element is removed.
 */
export function useOverlaySync(
  tag: string,
  elRef: Readonly<ShallowRef<OverlayElement | null>>,
  props: { readonly open: boolean },
  emit: OverlayEmit,
  hooks: OverlaySyncHooks = {},
): OverlaySync {
  let ready = false
  let disposed = false
  let warnTimer: ReturnType<typeof setTimeout> | undefined

  const sync = (): void => {
    const el = elRef.value
    if (!el || !ready) return
    if (props.open) void el.show()
    else void el.hide()
  }

  const onShow = (event: Event): void => {
    hooks.onShow?.()
    emit('show', event)
    if (!props.open) emit('update:open', true)
  }
  const onHide = (event: Event): void => {
    emit('hide', event)
    if (props.open) emit('update:open', false)
  }

  const firstSync = async (): Promise<void> => {
    await customElements.whenDefined(tag)
    if (disposed) return
    await hooks.beforeFirstSync?.()
    if (disposed) return
    ready = true
    sync()
  }

  onMounted(() => {
    const el = elRef.value
    if (!el || typeof customElements === 'undefined') return
    el.addEventListener('show', onShow)
    el.addEventListener('hide', onHide)

    if (
      typeof process !== 'undefined' &&
      process.env.NODE_ENV !== 'production' &&
      !customElements.get(tag)
    ) {
      warnTimer = setTimeout(() => {
        if (!disposed && !customElements.get(tag)) {
          console.warn(
            `[polaris-vue-elements] <${tag}> is still not defined ${MISSING_TAG_WARNING_DELAY / 1000} s after mount. This likely means the App Bridge script tag was not added correctly to this page.`,
          )
        }
      }, MISSING_TAG_WARNING_DELAY)
    }

    void firstSync()
  })

  watch(() => props.open, sync)

  onBeforeUnmount(() => {
    disposed = true
    if (warnTimer !== undefined) clearTimeout(warnTimer)
    const el = elRef.value
    if (!el) return
    el.removeEventListener('show', onShow)
    el.removeEventListener('hide', onHide)
    if (ready) void el.hide()
  })

  return { isReady: () => ready }
}
