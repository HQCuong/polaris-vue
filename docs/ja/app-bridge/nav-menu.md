---
title: アプリナビゲーション
description: Shopify は、アプリナビゲーションとして <s-link> を子に持つ <s-app-nav> を文書化しています。
---

# アプリナビゲーション {#app-nav}

始める前に[インストール](/ja/app-bridge/#install)を参照してください。

Shopify は、アプリナビゲーションとして `<s-link>` を子に持つ `<s-app-nav>` を文書化しています。
[埋め込みアプリガイド](/ja/guide/shopify-embedded-app#app-navigation)と、Shopify の
[app nav リファレンス](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)
を参照してください。これにも React コンポーネントはありません。Shopify の
[React 移行ガイド](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
では、直接レンダリングするよう述べています。そのためこのライブラリにはこの要素のコンポーネントがなく、
生のタグは既存の `s-` の `isCustomElement` ルールでそのまま動作します。

`NavMenu` は、まだ使っているアプリ向けに、従来の `ui-nav-menu` をレンダリングします。

```vue
<script setup lang="ts">
import { NavMenu } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <NavMenu>
    <a href="/" rel="home">Home</a>
    <a href="/templates">Templates</a>
  </NavMenu>
</template>
```

どちらの要素も Vue Router と組み合わせたときの動作は、まだ検証されていません。
