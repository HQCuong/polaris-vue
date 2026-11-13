import type { ShopifyGlobal } from '@shopify/app-bridge-types'

let serverProxy: ShopifyGlobal | undefined

/**
 * Returns the `shopify` global, to use App Bridge APIs such as `toast` and
 * `resourcePicker`. Mirrors `useAppBridge` in `@shopify/app-bridge-react` 4.3.0.
 *
 * - On the server (no `window`), it returns a proxy that throws when you read any
 *   property, so call the APIs from `onMounted()` or an event handler.
 * - In the browser, it throws when the App Bridge script has not defined `shopify`.
 *
 * @see https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge
 */
export function useAppBridge(): ShopifyGlobal {
  if (typeof window === 'undefined') {
    // Created lazily, so importing this module has no side effect.
    serverProxy ??= new Proxy({} as ShopifyGlobal, {
      get(_, prop) {
        throw new Error(
          `shopify.${String(prop)} can't be used in a server environment. You likely need to move this code into onMounted().`,
        )
      },
    })
    return serverProxy
  }
  if (!window.shopify) {
    throw new Error(
      'The shopify global is not defined. This likely means the App Bridge script tag was not added correctly to this page',
    )
  }
  return window.shopify
}
