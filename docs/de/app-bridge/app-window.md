---
title: AppWindow
description: "AppWindow rendert s-app-window, das die Dokumentation von @shopify/app-bridge-types beschreibt als \"a fullscreen modal window in the Shopify admin\"."
---

# AppWindow {#app-window}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install); zu `open` siehe [Modal](/de/app-bridge/modal).

`AppWindow` rendert `s-app-window`, das die Dokumentation von `@shopify/app-bridge-types` beschreibt als
"a fullscreen modal window in the Shopify admin". `src` ist erforderlich: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` und das Ausblenden beim Unmount funktionieren wie bei `Modal`. Es hat
keinen Slot.
