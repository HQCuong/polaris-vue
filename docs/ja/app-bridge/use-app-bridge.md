---
title: useAppBridge()
description: useAppBridge() は shopify グローバルを返します。型は ShopifyGlobal です。
---

# useAppBridge() {#use-app-bridge}

始める前に[インストール](/ja/app-bridge/#install)を参照してください。

`useAppBridge()` は `shopify` グローバルを返します。型は `ShopifyGlobal` です。

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

`@shopify/app-bridge-react` と同様です。

- サーバー上では、いずれかのプロパティを読み取ると例外を投げるオブジェクトを返します。API は
  `onMounted()` またはイベントハンドラーから呼び出してください。
- ブラウザーでは、`shopify` が定義されていない場合に例外を投げます。これは "likely means the App
  Bridge script tag was not added correctly to this page" ということです。

埋め込みアプリガイドのように `shopify` グローバルを直接使うこともできます。
