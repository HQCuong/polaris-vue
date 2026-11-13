---
title: useAppBridge()
description: useAppBridge() gibt das globale Objekt shopify zurück, typisiert als ShopifyGlobal.
---

# useAppBridge() {#use-app-bridge}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install).

`useAppBridge()` gibt das globale Objekt `shopify` zurück, typisiert als `ShopifyGlobal`:

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

Wie in `@shopify/app-bridge-react`:

- Auf dem Server gibt es ein Objekt zurück, das beim Lesen jeder Eigenschaft einen Fehler wirft. Rufen Sie die
  APIs aus `onMounted()` oder einem Event-Handler auf.
- Im Browser wirft es einen Fehler, wenn `shopify` nicht definiert ist, was "likely means the App
  Bridge script tag was not added correctly to this page".

Das globale `shopify` direkt zu verwenden, wie es die Anleitung zu eingebetteten Apps tut, funktioniert ebenfalls.
