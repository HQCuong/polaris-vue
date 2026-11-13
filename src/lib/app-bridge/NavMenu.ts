/// <reference types="@shopify/app-bridge-types" />
import { defineComponent, h } from 'vue'
import type { NavMenuProps, PassThroughComponent } from './types'

/**
 * Renders the App Bridge `ui-nav-menu` element. `@shopify/app-bridge-react` 4.3.0
 * exports `NavMenu` as the bare tag name; this component adds typing.
 *
 * Shopify now documents `<s-app-nav>` for app navigation.
 *
 * @see https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu
 */
export const NavMenu = /*@__PURE__*/ defineComponent({
  name: 'ui-nav-menu',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('ui-nav-menu', attrs, slots.default?.())
  },
}) as unknown as PassThroughComponent<NavMenuProps, UINavMenuElement>
