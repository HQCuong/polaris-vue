---
title: useAppBridge()
description: "useAppBridge() renvoie l'objet global shopify, typé ShopifyGlobal."
---

# useAppBridge() {#use-app-bridge}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install).

`useAppBridge()` renvoie l'objet global `shopify`, typé `ShopifyGlobal` :

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

Comme dans `@shopify/app-bridge-react` :

- Côté serveur, il renvoie un objet qui lève une erreur dès que vous lisez une propriété. Appelez les
  API depuis `onMounted()` ou un gestionnaire d'événement.
- Dans le navigateur, il lève une erreur si `shopify` n'est pas défini, ce qui "likely means the App
  Bridge script tag was not added correctly to this page".

Utiliser directement l'objet global `shopify`, comme le fait le guide de l'app intégrée, fonctionne aussi.
