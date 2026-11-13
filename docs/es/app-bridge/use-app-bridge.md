---
title: useAppBridge()
description: useAppBridge() devuelve el global shopify, tipado como ShopifyGlobal.
---

# useAppBridge() {#use-app-bridge}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install).

`useAppBridge()` devuelve el global `shopify`, tipado como `ShopifyGlobal`:

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

Igual que en `@shopify/app-bridge-react`:

- En el servidor devuelve un objeto que lanza un error al leer cualquier propiedad. Llama a las
  API desde `onMounted()` o desde un manejador de eventos.
- En el navegador lanza un error si `shopify` no está definido, lo que "likely means the App
  Bridge script tag was not added correctly to this page".

También funciona usar directamente el global `shopify`, como hace la guía de apps integradas.
