---
title: "SaveBar (ui-save-bar) – Vue 3 向け App Bridge"
description: "SaveBar は Vue 3 で Shopify App Bridge の ui-save-bar をレンダリングします。v-model:open、show と hide イベント、discardConfirmation に対応。Shopify 埋め込みアプリ向けです。"
---

# SaveBar {#save-bar}

始める前に[インストール](/ja/app-bridge/#install)を、`open` については [Modal](/ja/app-bridge/modal) を参照してください。

Shopify の [SaveBar リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar)によると、保存バーは現在のページのフォームに未保存の情報があることを示します。

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

## Props とイベント {#reference}

### Props {#props}

| Prop | 型 | 説明 |
| --- | --- | --- |
| `open` | `boolean` | 保存バーが表示されているかどうか。App Bridge が保存バーを非表示にしたときに同期を保つには `v-model:open` を使います。デフォルト：`false`。 |
| `id` | `string` | 保存バーの一意の識別子。 |
| `discardConfirmation` | `boolean` | 破棄（discard）ボタンがクリックされたときに確認ダイアログを表示するかどうか。`SaveBar` はこれを要素の `discardConfirmation` プロパティとして設定します。 |

### Events {#events}

| Event | 型 | 説明 |
| --- | --- | --- |
| `show` | `Event` | 保存バーが表示されました。 |
| `hide` | `Event` | 保存バーが非表示になりました。 |
| `update:open` | `boolean` | 新しい状態が `open` と異なるとき、`show` または `hide` の後に emit されます。`v-model:open` 用です。 |

### Slots {#slots}

| Slot | 説明 |
| --- | --- |
| `default` | 保存ボタンとなる `<button variant="primary">` と、破棄ボタンとなる variant なしの `<button>`。型にはこれらのボタンの `disabled` と `loading` も記載されています。 |
