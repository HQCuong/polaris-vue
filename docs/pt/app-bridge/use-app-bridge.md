---
title: useAppBridge()
description: useAppBridge() retorna o global shopify, tipado como ShopifyGlobal.
---

# useAppBridge() {#use-app-bridge}

Antes de começar, veja [Instalação](/pt/app-bridge/#install).

`useAppBridge()` retorna o global `shopify`, tipado como `ShopifyGlobal`:

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

Como no `@shopify/app-bridge-react`:

- No servidor, ele retorna um objeto que lança um erro quando você lê qualquer propriedade.
  Chame as APIs a partir de `onMounted()` ou de um manipulador de evento.
- No navegador, ele lança um erro se `shopify` não estiver definido, o que "likely means the App
  Bridge script tag was not added correctly to this page".

Usar diretamente o global `shopify`, como faz o guia de apps incorporados, também funciona.
