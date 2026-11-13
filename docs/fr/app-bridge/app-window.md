---
title: AppWindow
description: "AppWindow génère s-app-window, que la documentation de @shopify/app-bridge-types décrit comme \"a fullscreen modal window in the Shopify admin\"."
---

# AppWindow {#app-window}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install) ; pour `open`, consultez [Modal](/fr/app-bridge/modal).

`AppWindow` génère `s-app-window`, que la documentation de `@shopify/app-bridge-types` décrit comme
"a fullscreen modal window in the Shopify admin". `src` est obligatoire : "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` et le masquage au démontage fonctionnent comme pour `Modal`. Il n'a
pas de slot.
