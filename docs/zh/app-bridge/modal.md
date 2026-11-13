---
title: Modal
description: "Modal 渲染 ui-modal。绑定 v-model:open 即可打开和关闭它。"
---

# Modal {#modal}

开始之前，请参阅[安装](/zh/app-bridge/#install)。

`Modal` 渲染 `ui-modal`。绑定 `v-model:open` 即可打开和关闭它：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const open = ref(false)

function confirm(): void {
  open.value = false
  useAppBridge().toast.show('Reset')
}
</script>

<template>
  <button @click="open = true">Reset settings</button>
  <Modal id="reset-modal" v-model:open="open">
    <p>This restores the default values.</p>
    <TitleBar title="Reset settings?">
      <button variant="primary" @click="confirm">Reset</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

该组件的行为遵循 `@shopify/app-bridge-react` 中的 `Modal`：

- `open` 会调用元素的 `show()` 或 `hide()`。当 modal 在后台中打开或关闭时，
  会触发 `show` 和 `hide`，并通过 `v-model:open` 更新 `open`。
  组件卸载时 modal 会被隐藏。
- 默认 slot 中的 `TitleBar`（或 `<ui-title-bar>`）和 `SaveBar`（或 `<ui-save-bar>`）
  仍是 `ui-modal` 的直接子元素。其余所有内容都会渲染到元素的
  `content` 中，并包在一个 `<div>` 里。
- `id`、`variant` 和 `src` 会传递给元素。

Shopify 的 [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
解释了这些 modal 的工作方式：

- Modal 由 Shopify 后台渲染，位于与你的应用同源的 iframe 中。
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." 自定义 JavaScript 不会
  被复制，并且你无法直接访问 `document`。
- 使用 `src` 时，modal 会改为加载你应用的一个路由。`ui-modal` 的类型说明指出，
  此时 "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored"。该路由通过 `postMessage` 与你的应用通信，如该页面所示。

上述页面建议，凡是超出这些限制的场景都使用 `src` modal。被移动的内容中的 Vue
事件处理和 Polaris `s-*` 元素，尚未在后台中验证。

## 调用元素方法 {#modal-methods}

组件的 `$el` 就是 `ui-modal` 元素，类型为 `UIModalElement`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from 'polaris-vue-elements/app-bridge'

const modal = ref<InstanceType<typeof Modal> | null>(null)

async function toggle(): Promise<void> {
  await modal.value?.$el.toggle()
}
</script>

<template>
  <Modal ref="modal" id="info-modal">
    <p>Details</p>
  </Modal>
</template>
```

`shopify.modal.show(id)` 和 `shopify.modal.hide(id)` 同样可以通过 `id` 使用。
