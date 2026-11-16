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
