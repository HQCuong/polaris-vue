---
title: "AppWindow (s-app-window) – 适用于 Vue 3 的 App Bridge"
description: "AppWindow 在 Vue 3 中渲染 Shopify App Bridge 的 s-app-window，即 Shopify 后台中的全屏模态窗口：src 为必填项，通过 v-model:open 打开。"
---

# AppWindow {#app-window}

开始之前，请参阅[安装](/zh/app-bridge/#install)；关于 `open`，请参阅 [Modal](/zh/app-bridge/modal)。

Shopify 的 [s-app-window 参考文档](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window)将它描述为一个全屏 modal 窗口，用于需要专属屏幕空间的复杂工作流程。

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

## Props 和事件 {#reference}

### Props {#props}

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `open` | `boolean` | 窗口是否显示。使用 `v-model:open` 在 App Bridge 关闭窗口时保持同步。默认值：`false`。 |
| `id` | `string` | 应用窗口元素的唯一标识符，用于通过 `commandFor` 关联按钮，或通过 `document.getElementById()` 获取元素。 |
| `src` | `string` (必填) | 在窗口中显示的内容的 URL。它必须指向应用中渲染窗口内容的路由，并在窗口打开时加载到 iframe 中。 |

### Events {#events}

| Event | 类型 | 说明 |
| --- | --- | --- |
| `show` | `Event` | 窗口已打开。 |
| `hide` | `Event` | 窗口已关闭。 |
| `update:open` | `boolean` | 当新状态与 `open` 不同时，在 `show` 或 `hide` 之后触发，供 `v-model:open` 使用。 |

### Slots {#slots}

`AppWindow` 没有 slot：`SAppWindowAttributes` 没有定义子元素。
