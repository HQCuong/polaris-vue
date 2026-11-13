---
title: App navigation
description: "Shopify documents <s-app-nav> with <s-link> children for app navigation; see the embedded-app guide and Shopify's app nav reference."
---

# App navigation {#app-nav}

Before you start, see [Install](/app-bridge/#install).

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
