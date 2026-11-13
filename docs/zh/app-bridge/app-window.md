---
title: AppWindow
description: "AppWindow 渲染 s-app-window，@shopify/app-bridge-types 的文档将其描述为 \"a fullscreen modal window in the Shopify admin\"。"
---

# AppWindow {#app-window}

开始之前，请参阅[安装](/zh/app-bridge/#install)；关于 `open`，请参阅 [Modal](/zh/app-bridge/modal)。

`AppWindow` 渲染 `s-app-window`，`@shopify/app-bridge-types` 的文档将其描述为
"a fullscreen modal window in the Shopify admin"。`src` 是必需的："the URL is loaded
in an iframe when the window opens"。

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

`open`、`v-model:open`、`show`/`hide` 以及卸载时隐藏的行为与 `Modal` 相同。它
没有 slot。
