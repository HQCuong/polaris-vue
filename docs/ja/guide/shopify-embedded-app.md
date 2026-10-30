---
title: Vue 3 で Shopify 埋め込みアプリを作る
description: Vue 3 と Vite で Shopify アプリを作ります。App Bridge と Polaris web components を読み込み、バックエンドへの fetch 呼び出しを認証し、App Home で型付きの s-* コンポーネントを使います。
---

# Vue 3 で Shopify 埋め込みアプリを作る {#build-a-shopify-embedded-app-with-vue-3}

埋め込みアプリ（Shopify はその UI を
[App Home](https://shopify.dev/docs/apps/build/app-home) と呼びます）は、自分でホストする
web アプリで、Shopify が管理画面内の iframe に表示します。Vue 3 を含め、どの web
フレームワークでも作れます。

runtime では、Shopify の CDN から次の 2 つが提供されます。

- **App Bridge**（`app-bridge.js`）は iframe を管理画面と接続し、グローバルな
  `shopify` オブジェクト（トースト、モーダル、ナビゲーション、セッショントークンなど）を公開します。
- **Polaris web components**（`polaris-2.js`）は `<s-*>` カスタム要素を登録します。

`polaris-vue-elements` は、それらの要素の上に型付きの Vue 3 コンポーネント（`SPage`、`STextField`、`SModal` など）を
追加します。これはコミュニティプロジェクトであり、Shopify が作ったものではありません。

Shopify 自身のドキュメントやテンプレートは React を対象としているため、このガイドでは Vue 固有の
部分を扱います。[はじめに](/ja/guide/getting-started)を読んでいることを前提としています。

## アーキテクチャ {#architecture}

- **フロントエンド:** 自分で管理する URL から配信される Vue 3 + Vite のシングルページアプリ。
  Shopify はこれを管理画面の iframe 内に読み込みます。
- **バックエンド:** Shopify の ID トークンを検証し、Admin API を呼び出せるサーバーであれば何でも構いません。
  認証には
  [トークン交換](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization)
  を使います。フロントエンドが ID トークンを送信し、バックエンドがそれを検証してアクセストークンと
  交換します。

`shopify app init` は React Router アプリを生成します。Shopify は Vue やその他の
React 以外のテンプレートを提供していません。他のスタックについては、Shopify は認証のドキュメントと
各言語の公式 API ライブラリ（フレームワークに依存しない Node.js 版もあります）を案内しています。
実用的な構成の一つは、バックエンドを好きな方法で生成し、Vue アプリは以下の説明に従って
別途ビルドすることです。

`shopify.app.toml` では、`embedded = true` でアプリを埋め込みにし、`application_url` で
アプリの配信先を指定します。

## 1. App Bridge と Polaris を読み込む {#_1-load-app-bridge-and-polaris}

`index.html` の `<head>` に、`shopify-api-key` meta タグ（アプリのクライアント ID）と
両方のスクリプトを追加します。

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Vite は `index.html` 内の `%VITE_*%` 変数を環境の値（たとえば `.env` の
`VITE_SHOPIFY_API_KEY`）で置き換えます。キーをサーバー側から埋め込むこともできます。

App Bridge は Polaris とは別にバージョン管理されています。URL にバージョンはなく、常に最新の
App Bridge が読み込まれます。Polaris のチャンネル（`polaris-2.js`、固定リリース）については
[既知の注意点](/ja/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version)を参照してください。

アプリは Shopify 管理画面から開いてください（たとえば `shopify app dev` が出力するプレビュー URL）。
ブラウザのタブで直接開くと、周囲に管理画面がないため App Bridge の機能は動作しません。

`shopify` グローバルに型付きでアクセスするには、Shopify の型パッケージをインストールして
参照します（Shopify はこの用途に `@shopify/app-bridge-types` を案内しています）。

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. Vite を設定する {#_2-configure-vite}

`s-*` タグをカスタム要素として扱います。[はじめに](/ja/guide/getting-started#_3-configure-vite)
と同じ設定です。

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('s-'),
        },
      },
    }),
  ],
})
```

## 3. ページを作る {#_3-build-a-page}

このページには、`v-model` を使ったフォーム、バックエンドを呼び出す保存ボタン、リセットを
確認するモーダルがあります。`SModal` は `commandFor`/`command` で宣言的に開きます。
[`SModal`](/ja/components/s-modal) と
[modal のアクション slot に関する注意点](/ja/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants)も参照してください。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SCheckbox, SModal, SPage, SSection, SStack, SText, STextField } from 'polaris-vue-elements'

const title = ref('')
const enabled = ref(true)
const saving = ref(false)

async function save(): Promise<void> {
  saving.value = true
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, enabled: enabled.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  title.value = ''
  enabled.value = true
}
</script>

<template>
  <SPage heading="Settings">
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="title" label="Title" placeholder="Welcome" />
        <SCheckbox v-model="enabled" label="Enabled" />
        <SStack direction="inline" gap="base">
          <SButton variant="primary" :loading="saving" @click="save">Save</SButton>
          <SButton commandFor="reset-modal" command="--show">Reset</SButton>
        </SStack>
      </SStack>
    </SSection>

    <SModal id="reset-modal" heading="Reset settings?">
      <SText>This restores the default values.</SText>
      <template #primary-action>
        <SButton variant="primary" commandFor="reset-modal" command="--hide" @click="reset">Reset</SButton>
      </template>
      <template #secondary-actions>
        <SButton variant="secondary" commandFor="reset-modal" command="--hide">Cancel</SButton>
      </template>
    </SModal>
  </SPage>
</template>
```

## 4. バックエンドと通信する {#_4-talk-to-your-backend}

通常、トークンを自分で付与する必要はありません。App Bridge は `fetch()` をインターセプトし、
アプリのドメインとそのサブドメインへのリクエストに対して、`Authorization` ヘッダーに ID トークンを
（さらに `Accept-Language` にショップのロケールを）追加します。通常の相対パスでの呼び出しで動作します。

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

サーバー側では次のことを行います。

- すべてのリクエストで ID トークンを検証します。クライアントシークレットによる HS256 署名、`exp`
  と `nbf`、`aud` がクライアント ID と一致すること、`iss` と `dest` のホスト名が一致することを確認し、
  失敗した場合は `401` を返します。
- ID トークンの有効期限は 1 分で、ベアラー認証情報です。自分のバックエンドにだけ送信してください。
- Admin API を呼び出すために ID トークンをアクセストークンと交換し、そのトークンはサーバー上で
  保持してください。

`shopify.idToken()` を自分で呼び出すのは、WebSocket 接続のようにインターセプターが対象としない
リクエストの場合だけです。

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

アプリが GraphQL Admin API だけを必要とする場合、アプリの設定で Direct API access を有効にすると、
App Bridge が `fetch('shopify:admin/api/graphql.json', ...)` を管理画面経由でルーティングできるため、
独自のバックエンドは不要です。
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api)
を参照してください。

## 5. Vue から App Bridge API を使う {#_5-use-app-bridge-apis-from-vue}

すべて `shopify` グローバル上にあり、Vue プラグインは不要です。

### トースト {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` は `duration`（ミリ秒）、`isError`、`action`、`onAction`、
`onDismiss` を受け取り、`shopify.toast.hide(id)` に渡せる id を返します。

### id によるモーダル操作 {#modals-by-id}

`commandFor` のほかに、`shopify.modal` でも `id` を指定して `SModal` を制御できます。

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### アプリのナビゲーション {#app-navigation}

`<s-app-nav>` は管理画面のサイドバーにアプリのナビゲーションを表示します。アプリのルート付近、
たとえば `App.vue` でマウントしたままにしてください。

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

アクティブな項目は現在の URL から決まります。コードからナビゲートする方法として、Shopify の
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)
はアンカー、`open('/settings', '_self')`、History API（`history.pushState`）を説明しています。

### 保存バー {#save-bar}

`<form>` に `data-save-bar` を追加すると、フォームに未保存の変更があるときに管理画面が保存バーを
表示します。保存（Save）で `submit` が、破棄（Discard）で `reset` が発火します。同じフォームで
プログラムによる `shopify.saveBar` メソッドと併用しないでください。
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)
を参照してください。

## 次のステップ {#next-steps}

- [すべてのコンポーネント](/ja/components/)を見て、[既知の注意点](/ja/guide/quirks)を読んでください。
- `v-model`、オーバーレイ、生のタグへの型付けについては[はじめに](/ja/guide/getting-started)を読み返してください。
- Shopify の [App Home ドキュメント](https://shopify.dev/docs/apps/build/app-home)と
  [App Bridge API](https://shopify.dev/docs/api/app-home/apis) を読んでください。
