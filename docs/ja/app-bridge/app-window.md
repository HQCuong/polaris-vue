---
title: AppWindow
description: "AppWindow は s-app-window をレンダリングします。@shopify/app-bridge-types のドキュメントでは、これを \"a fullscreen modal window in the Shopify admin\" と説明しています。"
---

# AppWindow {#app-window}

始める前に[インストール](/ja/app-bridge/#install)を、`open` については [Modal](/ja/app-bridge/modal) を参照してください。

`AppWindow` は `s-app-window` をレンダリングします。`@shopify/app-bridge-types` のドキュメントでは、これを
"a fullscreen modal window in the Shopify admin" と説明しています。`src` は必須です。"the URL is loaded
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

`open`、`v-model:open`、`show`/`hide`、およびアンマウント時の非表示は、`Modal` と同様に動作します。
slot はありません。
