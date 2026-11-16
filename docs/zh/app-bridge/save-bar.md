---
title: "SaveBar (ui-save-bar) – 适用于 Vue 3 的 App Bridge"
description: "SaveBar 在 Vue 3 中渲染 Shopify App Bridge 的 ui-save-bar，支持 v-model:open、show 和 hide 事件以及 discardConfirmation。适用于 Shopify 嵌入式应用。"
---

# SaveBar {#save-bar}

开始之前，请参阅[安装](/zh/app-bridge/#install)；关于 `open`，请参阅 [Modal](/zh/app-bridge/modal)。

`SaveBar` 渲染 `ui-save-bar`。正如 `ui-save-bar` 的类型说明所述，"the button with
variant `primary` is the Save button and the button without a variant is the Discard
button"：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SaveBar } from 'polaris-vue-elements/app-bridge'

const dirty = ref(false)

function save(): void {
  dirty.value = false
}
function discard(): void {
  dirty.value = false
}
</script>

<template>
  <SaveBar id="settings-save-bar" v-model:open="dirty" discard-confirmation>
    <button variant="primary" @click="save">Save</button>
    <button @click="discard">Discard</button>
  </SaveBar>
</template>
```

`open`、`v-model:open`、`show`/`hide` 以及卸载时隐藏的行为与 `Modal` 相同。
`discardConfirmation`（"whether to show a confirmation dialog when the discard button is
clicked"）会设为元素的 `discardConfirmation` property。

对于表单，[嵌入式应用指南](/zh/guide/shopify-embedded-app#save-bar)中的
`data-save-bar` attribute 不需要组件。
