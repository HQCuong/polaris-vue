---
title: "AppWindow (s-app-window) – Vue 3 向け App Bridge"
description: "AppWindow は Vue 3 で、Shopify 管理画面のフルスクリーンのモーダルウィンドウである Shopify App Bridge の s-app-window をレンダリングします。src は必須で、v-model:open で開きます。"
---

# AppWindow {#app-window}

Shopify の [s-app-window リファレンス](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window)では、専用の画面スペースを必要とする複雑なワークフローのための、フルスクリーンのモーダルウィンドウとして説明されています。

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

`open`、`v-model:open`、`show`/`hide`、およびアンマウント時の非表示は、[`Modal`](/ja/app-bridge/modal) と同様に動作します。
slot はありません。

## Props とイベント {#reference}

### Props {#props}

| Prop | 型 | 説明 |
| --- | --- | --- |
| `open` | `boolean` | ウィンドウが表示されているかどうか。App Bridge がウィンドウを閉じたときに同期を保つには `v-model:open` を使います。デフォルト：`false`。 |
| `id` | `string` | アプリウィンドウ要素の一意の識別子。`commandFor` でボタンを結び付けたり、`document.getElementById()` で要素を取得したりするときに使います。 |
| `src` | `string` (必須) | ウィンドウに表示するコンテンツの URL。ウィンドウのコンテンツをレンダリングするアプリのルートを指す必要があり、ウィンドウが開くと iframe に読み込まれます。 |

### Events {#events}

| Event | 型 | 説明 |
| --- | --- | --- |
| `show` | `Event` | ウィンドウが開きました。 |
| `hide` | `Event` | ウィンドウが閉じました。 |
| `update:open` | `boolean` | 新しい状態が `open` と異なるとき、`show` または `hide` の後に emit されます。`v-model:open` 用です。 |

### Slots {#slots}

`AppWindow` には slot がありません。`SAppWindowAttributes` は子を定義していません。
