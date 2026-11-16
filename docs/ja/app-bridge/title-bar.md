---
title: "TitleBar (ui-title-bar) – Vue 3 向け App Bridge"
description: "TitleBar は Vue 3 で Shopify App Bridge の ui-title-bar をレンダリングし、title は属性として設定されます。Modal 内ではヘッダーとフッターを設定します。Shopify 埋め込みアプリ向けです。"
---

# TitleBar {#title-bar}

始める前に[インストール](/ja/app-bridge/#install)を参照してください。

`TitleBar` は `ui-title-bar` をレンダリングし、`title` は属性として設定されます。`Modal` 内では、
モーダルのヘッダーとフッターを設定します。子要素は `<button>` と `<a>` 要素です。
`ui-title-bar` の型では `variant="primary"` または `variant="breadcrumb"`、
`tone="critical"`、`<section label="...">` によるグループが使えます。ページのタイトルバーについては、
Shopify は現在 [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)
を文書化しており、これは [`SPage`](/ja/components/s-page) です。
