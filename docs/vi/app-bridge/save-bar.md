---
title: "SaveBar (ui-save-bar) – App Bridge cho Vue 3"
description: "SaveBar render ui-save-bar của Shopify App Bridge trong Vue 3, với v-model:open, các event show và hide, và discardConfirmation. Dành cho Shopify embedded app."
---

# SaveBar {#save-bar}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install); về `open`, xem [Modal](/vi/app-bridge/modal).

Save bar cho biết một form trên trang hiện tại có thông tin chưa được lưu, như [tài liệu SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) của Shopify mô tả.

`SaveBar` render `ui-save-bar`. Như type của `ui-save-bar` mô tả, "the button with
variant `primary` is the Save button and the button without a variant is the Discard
button":

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

`open`, `v-model:open`, `show`/`hide` và việc ẩn khi unmount hoạt động giống như với `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") được đặt làm property `discardConfirmation` của element.

Với một form, attribute `data-save-bar` trong
[hướng dẫn embedded app](/vi/guide/shopify-embedded-app#save-bar) không cần component nào.

## Props và sự kiện {#reference}

### Props {#props}

| Prop | Kiểu | Mô tả |
| --- | --- | --- |
| `open` | `boolean` | Save bar có đang hiện hay không. Dùng `v-model:open` để giữ đồng bộ khi App Bridge ẩn save bar. Mặc định: `false`. |
| `id` | `string` | Định danh duy nhất của save bar. |
| `discardConfirmation` | `boolean` | Có hiện hộp thoại xác nhận khi nhấn nút discard hay không. `SaveBar` đặt nó làm property `discardConfirmation` của element. |

### Events {#events}

| Event | Kiểu | Mô tả |
| --- | --- | --- |
| `show` | `Event` | Save bar đã hiện. |
| `hide` | `Event` | Save bar đã ẩn. |
| `update:open` | `boolean` | Phát ra sau `show` hoặc `hide` khi trạng thái mới khác với `open`, dùng cho `v-model:open`. |

### Slots {#slots}

| Slot | Mô tả |
| --- | --- |
| `default` | Một `<button variant="primary">` là nút Save, và một `<button>` không có variant là nút Discard. Type cũng liệt kê `disabled` và `loading` cho các nút này. |
