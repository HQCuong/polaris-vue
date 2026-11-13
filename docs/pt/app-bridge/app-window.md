---
title: AppWindow
description: "AppWindow renderiza s-app-window, que a documentação de @shopify/app-bridge-types descreve como \"a fullscreen modal window in the Shopify admin\"."
---

# AppWindow {#app-window}

Antes de começar, veja [Instalação](/pt/app-bridge/#install); para `open`, veja [Modal](/pt/app-bridge/modal).

`AppWindow` renderiza `s-app-window`, que a documentação de `@shopify/app-bridge-types` descreve como
"a fullscreen modal window in the Shopify admin". `src` é obrigatório: "the URL is loaded
in an iframe when the window opens".

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Edit in bulk</button>
  <AppWindow id="bulk-editor" src="/bulk-editor" v-model:open="open" />
</template>
```

`open`, `v-model:open`, `show`/`hide` e o ocultamento ao desmontar funcionam como no `Modal`.
Ele não tem slot.
