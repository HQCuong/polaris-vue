---
title: AppWindow
description: "AppWindow render s-app-window, mà tài liệu @shopify/app-bridge-types mô tả là \"a fullscreen modal window in the Shopify admin\"."
---

# AppWindow {#app-window}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install); về `open`, xem [Modal](/vi/app-bridge/modal).

`AppWindow` render `s-app-window`, mà tài liệu `@shopify/app-bridge-types` mô tả là
"a fullscreen modal window in the Shopify admin". `src` là bắt buộc: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` và việc ẩn khi unmount hoạt động giống như với `Modal`. Nó
không có slot.
