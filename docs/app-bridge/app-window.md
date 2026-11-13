---
title: AppWindow
description: "AppWindow renders s-app-window, which the @shopify/app-bridge-types docs describe as \"a fullscreen modal window in the Shopify admin\"."
---

# AppWindow {#app-window}

Before you start, see [Install](/app-bridge/#install); for `open`, see [Modal](/app-bridge/modal).

`AppWindow` renders `s-app-window`, which the `@shopify/app-bridge-types` docs describe as
"a fullscreen modal window in the Shopify admin". `src` is required: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` and hiding on unmount work as for `Modal`. It has
no slot.
