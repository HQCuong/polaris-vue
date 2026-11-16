---
title: "AppWindow (s-app-window) – Vue 3용 App Bridge"
description: "AppWindow는 Vue 3에서 Shopify 관리자의 전체 화면 모달 창인 Shopify App Bridge의 s-app-window를 렌더링합니다. src는 필수이며 v-model:open으로 엽니다."
---

# AppWindow {#app-window}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하고, `open`에 대해서는 [Modal](/ko/app-bridge/modal)을 참고하세요.

Shopify의 [s-app-window 레퍼런스](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window)는 이를 전용 화면 공간이 필요한 복잡한 워크플로를 위한 전체 화면 모달 창으로 설명합니다.

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

## Props와 이벤트 {#reference}

### Props {#props}

| Prop | 타입 | 설명 |
| --- | --- | --- |
| `open` | `boolean` | 창이 표시되는지 여부입니다. App Bridge가 창을 닫을 때 동기화를 유지하려면 `v-model:open`을 사용하세요. 기본값: `false`. |
| `id` | `string` | 앱 창 요소의 고유 식별자로, `commandFor`로 버튼을 연결하거나 `document.getElementById()`로 요소를 가져올 때 사용합니다. |
| `src` | `string` (필수) | 창에 표시할 콘텐츠의 URL입니다. 창 콘텐츠를 렌더링하는 앱의 라우트를 가리켜야 하며, 창이 열릴 때 iframe에 로드됩니다. |

### Events {#events}

| Event | 타입 | 설명 |
| --- | --- | --- |
| `show` | `Event` | 창이 열렸습니다. |
| `hide` | `Event` | 창이 닫혔습니다. |
| `update:open` | `boolean` | 새 상태가 `open`과 다를 때 `show` 또는 `hide` 다음에 emit되며, `v-model:open`에 사용됩니다. |

### Slots {#slots}

`AppWindow`에는 slot이 없습니다. `SAppWindowAttributes`는 자식을 정의하지 않습니다.
