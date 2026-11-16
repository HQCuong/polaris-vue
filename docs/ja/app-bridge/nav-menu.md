---
title: "NavMenu (ui-nav-menu) – Vue 3 向け App Bridge"
description: "Vue 3 で作る Shopify 埋め込みアプリのアプリナビゲーション。Shopify は s-app-nav を文書化しており、そのままのタグで使えます。NavMenu は旧来の App Bridge ui-nav-menu をレンダリングします。"
---

# アプリナビゲーション {#app-nav}

Shopify の [NavMenu リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu)によると、アプリナビは Shopify 管理画面でアプリのナビゲーション項目を構成します。

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

## Props とイベント {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` には prop がなく、イベントも emit しません。`UINavMenuAttributes` は子だけを定義しており、`NavMenu` はそれをデフォルト slot からレンダリングします。型はこれらの子を説明していません。

| Slot | 説明 |
| --- | --- |
| `default` | 上の例の `<a href="/" rel="home">` のようなナビゲーションリンク。 |

### `s-app-nav` {#reference-app-nav}

型では `s-app-nav` に属性はありません。子はリンク要素として指定するナビゲーション項目です。各リンクがアプリのナビゲーションメニューに項目を 1 つ作り、`rel="home"` を持つリンク 1 つがデフォルトのランディングページを設定します。

型はこれらのリンクの属性を次のように説明しています。

| 属性 | 型 | 説明 |
| --- | --- | --- |
| `href` | `string` (必須) | ナビゲーション項目のパスで、`/products` や `/settings` のようなアプリ内の相対パスです。クリックするとページ全体を再読み込みせずにアプリがこのルートに移動します。アプリのルーティングにあるルートと一致させる必要があります。 |
| `rel` | `"home"` | リンクをアプリのデフォルトのランディングページとして指定します。そのリンクはナビゲーションメニューに表示されず、`rel="home"` を持つリンクは 1 つだけにします。 |
| `children` | `string` | 項目に表示されるラベル。型は、"Products" や "Settings" のように行き先を示す短いラベル（1〜2 語）を勧めています。 |
