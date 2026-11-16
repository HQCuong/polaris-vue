---
title: "AppWindow (s-app-window) – App Bridge cho Vue 3"
description: "AppWindow render s-app-window của Shopify App Bridge, một cửa sổ modal toàn màn hình trong Shopify admin, trong Vue 3: src là bắt buộc, mở bằng v-model:open."
---

# AppWindow {#app-window}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install); về `open`, xem [Modal](/vi/app-bridge/modal).

[Tài liệu s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) của Shopify mô tả nó là một cửa sổ modal toàn màn hình cho các quy trình phức tạp cần không gian màn hình riêng.

`AppWindow` render `s-app-window`, mà tài liệu `@shopify/app-bridge-types` mô tả là
"a fullscreen modal window in the Shopify admin". `src` là bắt buộc: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` và việc ẩn khi unmount hoạt động giống như với `Modal`. Nó
không có slot.

## Props và sự kiện {#reference}

### Props {#props}

| Prop | Kiểu | Mô tả |
| --- | --- | --- |
| `open` | `boolean` | Cửa sổ có đang hiện hay không. Dùng `v-model:open` để giữ đồng bộ khi App Bridge đóng cửa sổ. Mặc định: `false`. |
| `id` | `string` | Định danh duy nhất của element app window, dùng để kết nối các nút bằng `commandFor` hoặc lấy element bằng `document.getElementById()`. |
| `src` | `string` (bắt buộc) | URL của nội dung hiển thị trong cửa sổ. Nó phải trỏ tới một route của app render nội dung cửa sổ, và được tải trong một iframe khi cửa sổ mở. |

### Events {#events}

| Event | Kiểu | Mô tả |
| --- | --- | --- |
| `show` | `Event` | Cửa sổ đã mở. |
| `hide` | `Event` | Cửa sổ đã đóng. |
| `update:open` | `boolean` | Phát ra sau `show` hoặc `hide` khi trạng thái mới khác với `open`, dùng cho `v-model:open`. |

### Slots {#slots}

`AppWindow` không có slot: `SAppWindowAttributes` không định nghĩa con nào.
