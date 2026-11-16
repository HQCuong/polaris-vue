---
title: "SaveBar (ui-save-bar) – 适用于 Vue 3 的 App Bridge"
description: "SaveBar 在 Vue 3 中渲染 Shopify App Bridge 的 ui-save-bar，支持 v-model:open、show 和 hide 事件以及 discardConfirmation。适用于 Shopify 嵌入式应用。"
---

# SaveBar {#save-bar}

按照 Shopify 的 [SaveBar 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar)的描述，保存栏表示当前页面上的表单有未保存的信息。

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

`open`、`v-model:open`、`show`/`hide` 以及卸载时隐藏的行为与 [`Modal`](/zh/app-bridge/modal) 相同。
`discardConfirmation`（"whether to show a confirmation dialog when the discard button is
clicked"）会设为元素的 `discardConfirmation` property。

对于表单，[嵌入式应用指南](/zh/guide/shopify-embedded-app#save-bar)中的
`data-save-bar` attribute 不需要组件。

## Props 和事件 {#reference}

### Props {#props}

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `open` | `boolean` | 保存栏是否显示。使用 `v-model:open` 在 App Bridge 隐藏保存栏时保持同步。默认值：`false`。 |
| `id` | `string` | 保存栏的唯一标识符。 |
| `discardConfirmation` | `boolean` | 点击放弃（discard）按钮时是否显示确认对话框。`SaveBar` 将它设为元素的 `discardConfirmation` 属性（property）。 |

### Events {#events}

| Event | 类型 | 说明 |
| --- | --- | --- |
| `show` | `Event` | 保存栏已显示。 |
| `hide` | `Event` | 保存栏已隐藏。 |
| `update:open` | `boolean` | 当新状态与 `open` 不同时，在 `show` 或 `hide` 之后触发，供 `v-model:open` 使用。 |

### Slots {#slots}

| Slot | 说明 |
| --- | --- |
| `default` | 一个作为保存按钮的 `<button variant="primary">`，以及一个作为放弃按钮、没有 variant 的 `<button>`。类型还为这些按钮列出了 `disabled` 和 `loading`。 |
