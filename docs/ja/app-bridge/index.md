---
title: Vue 向け App Bridge コンポーネント
description: Shopify の @shopify/app-bridge-react コンポーネントに対応する Vue 3 版 — polaris-vue-elements/app-bridge の Modal、SaveBar、AppWindow、TitleBar、NavMenu、useAppBridge。
---

# Vue 向け App Bridge コンポーネント {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge` は、Shopify の
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
（バージョン 4.3.0）にあるコンポーネントとフックに対応する Vue 3 版を提供します。これらは、
App Bridge スクリプトが定義する App Bridge 要素をラップします。
`polaris-vue-elements` の他の部分と同様に、これはコミュニティプロジェクトであり、Shopify が作ったものではありません。

| Vue のエクスポート | 要素 | Shopify のリファレンス |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | `shopify` グローバル | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

これらの要素は Shopify 管理画面の中でしか動作しないため、このページにはコード例のみがあり、
ライブデモはありません。先に、[Shopify 埋め込みアプリを作る](/ja/guide/shopify-embedded-app)の手順でアプリをセットアップしてください。

- [useAppBridge()](/ja/app-bridge/use-app-bridge)
- [Modal](/ja/app-bridge/modal)
- [TitleBar](/ja/app-bridge/title-bar)
- [SaveBar](/ja/app-bridge/save-bar)
- [AppWindow](/ja/app-bridge/app-window)
- [アプリナビゲーション](/ja/app-bridge/nav-menu)

## インストール {#install}

App Bridge スクリプトがページに読み込まれている必要があります
（[埋め込みアプリガイドのステップ 1](/ja/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)を参照）。
型については、Shopify の型パッケージをインストールします。これは `polaris-vue-elements` の
オプションの peer dependency です。

```sh
npm install -D @shopify/app-bridge-types
```

Shopify の
[App Bridge web components](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
ページには、CDN スクリプトは常に最新の App Bridge を読み込むと記載されており、次のように述べています: "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

その後、サブパスからインポートします。

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

メインの `polaris-vue-elements` エントリはこのコードをインポートしないため、これを使わないアプリには
読み込まれません。

コンポーネントは render 関数から要素をレンダリングするので、使うために `isCustomElement` を
変更する必要はありません。

## 現在の App Bridge 要素 {#current-elements}

Shopify の[移行ガイド](https://shopify.dev/docs/api/app-bridge/migration-guide)では、
現在の web components を次のように説明しています。

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` は Polaris のモーダルで、
  このライブラリでは [`SModal`](/ja/components/s-modal) です。
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." これは [`SPage`](/ja/components/s-page) とその slot のことです。
- "The navigation now uses the `<s-app-nav>` web component."
  [アプリナビゲーション](/ja/app-bridge/nav-menu)を参照してください。

`ui-modal`、`ui-save-bar`、`ui-title-bar`、`ui-nav-menu` は、`@shopify/app-bridge-types` と
`@shopify/app-bridge-react` にまだ含まれており、このページのコンポーネントはそれらに対応しています。

## 生のタグ {#raw-tags}

要素（`<ui-modal>`、`<ui-title-bar>`、`<ui-save-bar>`、`<ui-nav-menu>`）をテンプレートに直接書くには、
`ui-` タグもカスタム要素として扱います。

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-') || tag.startsWith('ui-'),
    },
  },
})
```

`s-app-window` と `s-app-nav` は、すでに `s-` でカバーされています。

これらのタグの型チェックには、`polaris-vue-elements/elements` の型を使っている場合はその隣に、
オプトインの型を `tsconfig.app.json` に追加します。

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

これは `ui-modal`、`ui-save-bar`、`ui-title-bar`、`ui-nav-menu`、`s-app-window`、`s-app-nav`、
および `<button>` と `<a>` の `variant`、`tone`、`loading` 属性に型を付けます。
`s-page` には `polaris-vue-elements/elements` が型を付けます。

## 型 {#types}

このサブパスは、`@shopify/app-bridge-react` と同様に `@shopify/app-bridge-types` のすべての型を再エクスポートし、
さらに `ModalProps`、`SaveBarProps`、`AppWindowProps`、`TitleBarProps`、`NavMenuProps` を提供します。

`polaris-vue-elements/app-bridge` の `ModalProps` は `Modal`（`ui-modal`）用です。メインエントリも
`SModal`（`s-modal`）用の `ModalProps` をエクスポートしています。両方をインポートする場合は、
どちらかの名前を変えてください。

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## React からの対応表 {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"`（または `:open`） |
| `onShow`, `onHide` | `@show`, `@hide` |
| 要素への `ref` | テンプレートの `ref`、続けて `.$el` |
| `children` | デフォルト slot |
| `useAppBridge()` | `useAppBridge()` |

## FAQ {#faq}

### @shopify/app-bridge-react は必要ですか？

いいえ。`polaris-vue-elements/app-bridge` は React を使いません。必要なのはページ上の App Bridge
スクリプトと、型のための `@shopify/app-bridge-types` だけです。

### Shopify 管理画面の外でも動作しますか？

いいえ。App Bridge スクリプトがアプリを管理画面に接続し、モーダル、保存バー、タイトルバーは管理画面が
レンダリングします。[埋め込みアプリガイド](/ja/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)
の説明のとおり、アプリは管理画面から開いてください。

### Modal と SModal のどちらを使うべきですか？

Shopify の[移行ガイド](https://shopify.dev/docs/api/app-bridge/migration-guide)では、App Bridge は
"now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes" と述べています。`Modal` は、
`@shopify/app-bridge-react` がまだ提供している `ui-modal` 要素に対応しています。
