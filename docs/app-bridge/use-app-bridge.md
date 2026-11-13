---
title: useAppBridge()
description: useAppBridge() returns the shopify global, typed as ShopifyGlobal.
---

# useAppBridge() {#use-app-bridge}

Before you start, see [Install](/app-bridge/#install).

`useAppBridge()` returns the `shopify` global, typed as `ShopifyGlobal`:

```vue
<script setup lang="ts">
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const shopify = useAppBridge()

function generate(): void {
  shopify.toast.show('Blog post template generated')
}
</script>

<template>
  <button @click="generate">Generate blog post</button>
</template>
```

As in `@shopify/app-bridge-react`:

- On the server it returns an object that throws when you read any property. Call the
  APIs from `onMounted()` or an event handler.
- In the browser it throws if `shopify` is not defined, which "likely means the App
  Bridge script tag was not added correctly to this page".

Using the `shopify` global directly, as the embedded-app guide does, works too.
