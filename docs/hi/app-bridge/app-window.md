---
title: AppWindow
description: "AppWindow s-app-window को render करता है, जिसे @shopify/app-bridge-types docs \"a fullscreen modal window in the Shopify admin\" बताते हैं।"
---

# AppWindow {#app-window}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें; `open` के लिए [Modal](/hi/app-bridge/modal) देखें।

`AppWindow` `s-app-window` को render करता है, जिसे `@shopify/app-bridge-types` docs
"a fullscreen modal window in the Shopify admin" बताते हैं। `src` ज़रूरी है: "the URL is loaded
in an iframe when the window opens"।

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

`open`, `v-model:open`, `show`/`hide` और unmount पर छिपना `Modal` की तरह ही काम करते हैं। इसमें
कोई slot नहीं है।
