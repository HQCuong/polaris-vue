---
title: "NavMenu (ui-nav-menu) – App Bridge for Vue 3"
description: "App navigation for a Shopify embedded app in Vue 3: Shopify documents s-app-nav, which works as a raw tag, and NavMenu renders the older App Bridge ui-nav-menu."
---

# App navigation {#app-nav}

The app nav configures the navigation items of your app in the Shopify admin, as Shopify's [NavMenu reference](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) describes it.

Shopify documents `<s-app-nav>` with `<s-link>` children for app navigation; see the
[embedded-app guide](/guide/shopify-embedded-app#app-navigation) and Shopify's
[app nav reference](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav).
It has no React component either; Shopify's
[React migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
says to render it directly. So this library has no component for it, and the raw tag
works with the existing `s-` `isCustomElement` rule.

`NavMenu` renders the older `ui-nav-menu`, for apps that still use it:

```vue
<script setup lang="ts">
import { NavMenu } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <NavMenu>
    <a href="/" rel="home">Home</a>
    <a href="/templates">Templates</a>
  </NavMenu>
</template>
```

How either element works together with Vue Router has not been verified yet.

## Examples {#examples}

These examples follow Shopify's documentation and have not yet been tested in a live admin.

### App nav from your Vue Router routes {#example-app-nav-routes}

Use this to keep the admin's app nav and your routes in one place: the links are rendered
from the route table.

::: code-group

```ts [router.ts]
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** The label of the route in the app nav. Routes without one are not in the nav. */
    navLabel?: string
  }
}

export const HOME_PATH = '/app'

export const routes: RouteRecordRaw[] = [
  { path: HOME_PATH, component: () => import('./pages/HomePage.vue') },
  {
    path: '/app/templates',
    component: () => import('./pages/TemplatesPage.vue'),
    meta: { navLabel: 'Templates' },
  },
  {
    path: '/app/settings',
    component: () => import('./pages/SettingsPage.vue'),
    meta: { navLabel: 'Settings' },
  },
  // Not in the nav: reached from the templates list.
  { path: '/app/templates/:id', component: () => import('./pages/TemplatePage.vue') },
]

export const router = createRouter({ history: createWebHistory(), routes })
```

```vue [App.vue]
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { HOME_PATH, routes } from './router'

const navLinks = routes.flatMap((route) =>
  route.meta?.navLabel ? [{ href: route.path, label: route.meta.navLabel }] : [],
)
</script>

<template>
  <s-app-nav>
    <s-link :href="HOME_PATH" rel="home">Home</s-link>
    <s-link v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

:::

- The app name in the sidebar already links to `/`. Shopify adds a `rel="home"` link only
  when the home page is elsewhere, such as `/app`; that link is hidden from the menu
  ([App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)).
- Links can't be nested, and labels should be short nouns, such as "Templates" or
  "Settings" (same page).
- With `createWebHistory()`, Vue Router changes routes with `history.pushState()`, and
  App Bridge sends each new path to the admin's address bar
  ([Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)).
- Shopify's [navigation migration guide](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation)
  asks you to check direct loads, back and forward, and that the active item follows route
  changes.

### NavMenu from the same routes {#example-nav-menu-routes}

Use this if your app still uses `ui-nav-menu`.

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NavMenu } from 'polaris-vue-elements/app-bridge'
import { HOME_PATH, routes } from './router'

const navLinks = routes.flatMap((route) =>
  route.meta?.navLabel ? [{ href: route.path, label: route.meta.navLabel }] : [],
)
</script>

<template>
  <NavMenu>
    <a :href="HOME_PATH" rel="home">Home</a>
    <a v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
  </NavMenu>
  <RouterView />
</template>
```

- This uses the `router.ts` of the previous example. `ui-nav-menu` children are `<a>`
  elements; the types do not describe them further.

### Link to pages of the Shopify admin {#example-admin-links}

Use this to send the merchant from your app to a product, order or customer in the admin.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { SStack } from 'polaris-vue-elements'

const props = defineProps<{ productGid: string }>()

// 'gid://shopify/Product/123' → '123'
const productId = computed(() => props.productGid.split('/').pop() ?? '')
</script>

<template>
  <SStack direction="inline" gap="base">
    <a :href="`shopify://admin/products/${productId}`" target="_top">View in Shopify admin</a>
    <a href="shopify://admin/orders" target="_top">Orders</a>
    <a href="https://help.example.com" target="_blank">Help center</a>
  </SStack>
</template>
```

- The `shopify:` protocol with `target="_top"` opens admin pages: index pages such as
  `shopify://admin/orders`, or a resource "by appending the resource ID"
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- `target="_blank"` opens an external URL in a new tab, and the admin stays open (same page).

### Navigate from code {#example-navigate-from-code}

Use this to go to a page after an action, such as opening a record you just created.

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const router = useRouter()

async function createTemplate(): Promise<void> {
  const res = await fetch('/api/templates', { method: 'POST' })
  if (!res.ok) {
    useAppBridge().toast.show('Could not create the template', { isError: true })
    return
  }
  const { id } = (await res.json()) as { id: string }
  await router.push(`/app/templates/${encodeURIComponent(id)}`)
}
</script>

<template>
  <SButton variant="primary" @click="createTemplate">Create template</SButton>
</template>
```

- `router.push()` uses `history.pushState()`, which App Bridge follows. Shopify also
  documents `open('/settings', '_self')` for a relative path
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- If a save bar may be showing, hide it or ask first; see
  [Ask before leaving with Vue Router](/app-bridge/save-bar#example-leave-confirmation).

## Props and events {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` has no props and emits no events: `UINavMenuAttributes` defines only children, which `NavMenu` renders from its default slot. The types do not describe these children.

| Slot | Description |
| --- | --- |
| `default` | The navigation links, such as `<a href="/" rel="home">` in the example above. |

### `s-app-nav` {#reference-app-nav}

`s-app-nav` has no attributes in the types. Its children are the navigation items, given as link elements: each link creates an item in the app's navigation menu, and one link with `rel="home"` sets the default landing page.

The types describe the attributes of these links:

| Attribute | Type | Description |
| --- | --- | --- |
| `href` | `string` (required) | The path of the navigation item, relative to your app, such as `/products` or `/settings`. Clicking it navigates the app to this route without a full page reload; it should match a route in your app's routing. |
| `rel` | `"home"` | Marks the link as the app's default landing page. That link is hidden from the navigation menu, and only one link should have `rel="home"`. |
| `children` | `string` | The visible label of the item. The types advise short labels (one or two words) that name the destination, such as "Products" or "Settings". |
