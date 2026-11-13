---
title: useAppBridge()
description: useAppBridge() 返回全局 shopify，类型为 ShopifyGlobal。
---

# useAppBridge() {#use-app-bridge}

开始之前，请参阅[安装](/zh/app-bridge/#install)。

`useAppBridge()` 返回全局 `shopify`，类型为 `ShopifyGlobal`：

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

与 `@shopify/app-bridge-react` 一样：

- 在服务器端，它返回一个对象，读取其任何属性都会抛出错误。请在 `onMounted()` 或事件处理函数中
  调用这些 API。
- 在浏览器中，如果 `shopify` 未定义，它会抛出错误，这"likely means the App
  Bridge script tag was not added correctly to this page"。

像嵌入式应用指南那样直接使用全局 `shopify` 也可以。
