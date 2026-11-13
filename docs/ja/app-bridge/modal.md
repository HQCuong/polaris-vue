---
title: Modal
description: "Modal は ui-modal をレンダリングします。v-model:open をバインドして開閉します。"
---

# Modal {#modal}

始める前に[インストール](/ja/app-bridge/#install)を参照してください。

`Modal` は `ui-modal` をレンダリングします。`v-model:open` をバインドして開閉します。

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

`@shopify/app-bridge-react` の `Modal` に倣った、コンポーネントの動作は次のとおりです。

- `open` は要素の `show()` または `hide()` を呼び出します。管理画面でモーダルが開閉すると、
  `show` と `hide` が emit され、`open` は `v-model:open` を通じて更新されます。
  コンポーネントがアンマウントされると、モーダルは非表示になります。
- デフォルト slot 内の `TitleBar`（または `<ui-title-bar>`）と `SaveBar`（または `<ui-save-bar>`）は、
  `ui-modal` の直接の子のままになります。それ以外はすべて、1 つの `<div>` の中で、要素の
  `content` にレンダリングされます。
- `id`、`variant`、`src` は要素に渡されます。

Shopify の[Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
では、これらのモーダルの仕組みを説明しています。

- モーダルは Shopify 管理画面によって、アプリと同一オリジンの iframe 内にレンダリングされます。
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." カスタム JavaScript はコピーされず、
  `document` に直接アクセスすることもできません。
- `src` を指定すると、モーダルは代わりにアプリのルートを読み込みます。`ui-modal` の型には、その場合
  "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored" と記載されています。ルートは、そのページに示されているとおり、`postMessage` を通じてアプリと通信します。

上記のページでは、これらの制限で対応できない用途には `src` モーダルを推奨しています。移動された
コンテンツ内での Vue のイベント処理と Polaris `s-*` 要素は、管理画面ではまだ検証されていません。

## 要素のメソッドを呼び出す {#modal-methods}

コンポーネントの `$el` は `ui-modal` 要素で、型は `UIModalElement` です。

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

`shopify.modal.show(id)` と `shopify.modal.hide(id)` も `id` を使って動作します。
