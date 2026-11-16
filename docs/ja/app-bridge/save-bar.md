---
title: "SaveBar (ui-save-bar) – Vue 3 向け App Bridge"
description: "SaveBar は Vue 3 で Shopify App Bridge の ui-save-bar をレンダリングします。v-model:open、show と hide イベント、discardConfirmation に対応。Shopify 埋め込みアプリ向けです。"
---

# SaveBar {#save-bar}

始める前に[インストール](/ja/app-bridge/#install)を、`open` については [Modal](/ja/app-bridge/modal) を参照してください。

`SaveBar` は `ui-save-bar` をレンダリングします。`ui-save-bar` の型の説明にあるとおり、"the button with
variant `primary` is the Save button and the button without a variant is the Discard
button" です。

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

`open`、`v-model:open`、`show`/`hide`、およびアンマウント時の非表示は、`Modal` と同様に動作します。
`discardConfirmation`（"whether to show a confirmation dialog when the discard button is
clicked"）は、要素の `discardConfirmation` プロパティとして設定されます。

フォームの場合は、[埋め込みアプリガイド](/ja/guide/shopify-embedded-app#save-bar)にある
`data-save-bar` 属性を使えば、コンポーネントは不要です。
