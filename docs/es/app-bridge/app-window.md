---
title: AppWindow
description: "AppWindow renderiza s-app-window, que la documentación de @shopify/app-bridge-types describe como \"a fullscreen modal window in the Shopify admin\"."
---

# AppWindow {#app-window}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install); para `open`, consulta [Modal](/es/app-bridge/modal).

`AppWindow` renderiza `s-app-window`, que la documentación de `@shopify/app-bridge-types` describe como
"a fullscreen modal window in the Shopify admin". `src` es obligatorio: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` y el ocultado al desmontar funcionan igual que en `Modal`.
No tiene slot.
