---
title: "useAppBridge() – Shopify App Bridge cho Vue 3"
description: "useAppBridge() cho Vue 3 trả về đối tượng toàn cục shopify của Shopify App Bridge, có type là ShopifyGlobal, giống trong @shopify/app-bridge-react. Dành cho Shopify embedded app."
---

# useAppBridge() {#use-app-bridge}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install).

`useAppBridge()` trả về đối tượng toàn cục `shopify`, có type là `ShopifyGlobal`:

```vue
<script setup lang="ts">
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const shopify = useAppBridge()

function generate(): void {
  shopify.toast.show('Blog post template generated')
}
</script>

<template>
  <button @click="generate">Generate blog post</button>
</template>
```

Giống như trong `@shopify/app-bridge-react`:

- Trên server, nó trả về một đối tượng sẽ ném lỗi khi bạn đọc bất kỳ thuộc tính nào. Hãy gọi các
  API từ `onMounted()` hoặc một event handler.
- Trong trình duyệt, nó ném lỗi nếu `shopify` chưa được định nghĩa, điều này "likely means the App
  Bridge script tag was not added correctly to this page".

Dùng trực tiếp đối tượng toàn cục `shopify`, như hướng dẫn embedded app đã làm, cũng được.
