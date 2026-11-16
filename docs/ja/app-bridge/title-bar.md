---
title: "TitleBar (ui-title-bar) – Vue 3 向け App Bridge"
description: "TitleBar は Vue 3 で Shopify App Bridge の ui-title-bar をレンダリングし、title は属性として設定されます。Modal 内ではヘッダーとフッターを設定します。Shopify 埋め込みアプリ向けです。"
---

# TitleBar {#title-bar}

タイトルバーは Shopify 管理画面でアプリの上部に表示されます。カスタマイズ方法は Shopify の [TitleBar リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar)で説明されています。

`TitleBar` は `ui-title-bar` をレンダリングし、`title` は属性として設定されます。`Modal` 内では、
モーダルのヘッダーとフッターを設定します。子要素は `<button>` と `<a>` 要素です。
`ui-title-bar` の型では `variant="primary"` または `variant="breadcrumb"`、
`tone="critical"`、`<section label="...">` によるグループが使えます。ページのタイトルバーについては、
Shopify は現在 [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)
を文書化しており、これは [`SPage`](/ja/components/s-page) です。

## Props とイベント {#reference}

### Props {#props}

| Prop | 型 | 説明 |
| --- | --- | --- |
| `title` | `string` | タイトルバーのタイトル。`document.title` でも設定できます。`TitleBar` は常にこれを属性として設定します。 |

`TitleBar` はイベントを emit しません。

### Slots {#slots}

| Slot | 説明 |
| --- | --- |
| `default` | 下表の `<button>` と `<a>` 要素、およびそれらをまとめる `<section>` グループ。 |

`ui-title-bar` の型は次の子要素を説明しています。

| 子要素 | 属性 |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. 型の注記によると、Remix では anchor 要素はサポートされず、代わりに Remix の `<Link>` コンポーネントを使えます。 |
| `<section>` | `label`: `string`. 子は `<a>` と `<button>` 要素です。 |

これらの型では、`<button>` と `<a>` は `id`、`name`、`class`、`href`、`rel`、`target`、`onclick` も受け取ります。
