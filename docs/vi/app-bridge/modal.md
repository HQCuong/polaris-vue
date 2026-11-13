---
title: Modal
description: "Modal render ui-modal. Hãy bind v-model:open để mở và đóng nó."
---

# Modal {#modal}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install).

`Modal` render `ui-modal`. Hãy bind `v-model:open` để mở và đóng nó:

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

Component làm những gì, theo `Modal` trong `@shopify/app-bridge-react`:

- `open` gọi `show()` hoặc `hide()` của element. Khi modal mở hoặc đóng trong
  trang admin, các sự kiện `show` và `hide` được phát ra và `open` được cập nhật qua `v-model:open`.
  Modal sẽ được ẩn khi component bị unmount.
- `TitleBar` (hoặc `<ui-title-bar>`) và `SaveBar` (hoặc `<ui-save-bar>`) trong default
  slot vẫn là con trực tiếp của `ui-modal`. Mọi thứ khác được render vào `content` của
  element, bên trong một thẻ `<div>`.
- `id`, `variant` và `src` được truyền cho element.

Trang [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
của Shopify giải thích cách các modal này hoạt động:

- Modal được render bởi trang admin Shopify, trong một iframe cùng origin với app của bạn.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." JavaScript tùy chỉnh không được
  sao chép, và bạn không có quyền truy cập trực tiếp vào `document`.
- Với `src`, modal sẽ tải một route của app bạn thay vào đó. Type của `ui-modal` nói rằng
  khi đó "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". Route giao tiếp với app của bạn qua `postMessage`, như được minh họa trên
  trang đó.

Trang trên khuyên dùng modal `src` cho mọi trường hợp vượt quá các giới hạn của nó. Việc xử lý
sự kiện Vue và các element `s-*` của Polaris bên trong nội dung đã được di chuyển vẫn chưa được
xác minh trong trang admin.

## Gọi các method của element {#modal-methods}

`$el` của component là element `ui-modal`, có type là `UIModalElement`:

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

`shopify.modal.show(id)` và `shopify.modal.hide(id)` cũng hoạt động với `id`.
