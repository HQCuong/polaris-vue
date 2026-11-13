---
title: AppWindow
description: "AppWindow는 s-app-window를 렌더링하며, @shopify/app-bridge-types 문서는 이를 \"a fullscreen modal window in the Shopify admin\"이라고 설명합니다."
---

# AppWindow {#app-window}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하고, `open`에 대해서는 [Modal](/ko/app-bridge/modal)을 참고하세요.

`AppWindow`는 `s-app-window`를 렌더링하며, `@shopify/app-bridge-types` 문서는 이를
"a fullscreen modal window in the Shopify admin"이라고 설명합니다. `src`는 필수입니다. "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide`, 언마운트 시 숨김은 `Modal`과 같이 동작합니다. slot은
없습니다.
