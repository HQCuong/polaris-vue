/// <reference types="@shopify/app-bridge-types" />
import { defineComponent, h } from 'vue'
import type { PassThroughComponent, TitleBarProps } from './types'

/**
 * Renders the App Bridge `ui-title-bar` element. `@shopify/app-bridge-react` 4.3.0
 * exports `TitleBar` as the bare tag name; this component adds prop typing and lets
 * `Modal` recognise it. `title` is always set as an attribute, as in Shopify's
 * examples (`UITitleBarElement` omits the `HTMLElement` `title` property).
 *
 * Shopify now documents `s-page` (`SPage`) for the page title bar; a `TitleBar` in a
 * `Modal` sets the modal's header and footer.
 *
 * @see https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar
 */
export const TitleBar = /*@__PURE__*/ defineComponent({
  name: 'ui-title-bar',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      const { title, ...rest } = attrs
      const data = title === undefined ? rest : { ...rest, '^title': title }
      return h('ui-title-bar', data, slots.default?.())
    }
  },
}) as unknown as PassThroughComponent<TitleBarProps, UITitleBarElement>
