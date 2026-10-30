---
title: Vue 3 で Shopify Polaris を使い始める
description: polaris-vue-elements をインストールし、Shopify Polaris web components の runtime を読み込んで、SButton や STextField などの型付き Vue 3 wrapper を v-model とともに Vue アプリや Shopify アプリで使います。
---

# はじめに {#getting-started}

`polaris-vue-elements` は、Shopify の Polaris web components（`<s-button>`、`<s-text-field>`、`<s-modal>` など）を
ラップする型付きの Vue 3 コンポーネント集です。web components 本体は Shopify の CDN から
runtime で読み込まれます。このライブラリは、それらを型付きで Vue らしく扱えるインターフェース
（props、events、v-model）を提供するだけです。

## 1. インストール {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Polaris runtime を読み込む {#_2-load-the-polaris-runtime}

wrapper コンポーネントは表示のためだけのもので、実際のカスタム要素の定義は含んでいません。
ホストアプリで Shopify の Polaris runtime スクリプトを読み込む必要があります。このスクリプトが
`<s-*>` 要素をグローバルに登録します。

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

これは Shopify 管理画面の中だけでなく、どの Vue アプリでも動作します。コンポーネントは
ただのカスタム要素なので、スクリプトが読み込まれていればどこでも描画されます。

`polaris-2.js` は Shopify の stable チャンネルで、本番環境での利用を推奨します。
特定のリリースに固定したい場合や、runtime のバージョンとこのライブラリのバージョンの関係を
知りたい場合は、
[既知の注意点](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version)
を参照してください。

### Polaris 2.0 と新しい管理画面デザイン {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0 では、Shopify 管理画面の新しいビジュアルデザイン（色、タイポグラフィ、
余白、アイコン）が導入されます。2026 年 10 月 22 日に stable になりました
（[告知](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)）。
1.x からの移行はオプトインです。`polaris-1.js` を `polaris-2.js` に置き換えてください。

- **コードの変更は不要です。** 2.0 はビジュアルの更新です。コンポーネント、props、
  events、slots は 1.1 と同じで、いくつかの追加（`SThumbnail` の `loading` prop など）が
  あるだけです。`polaris-1.js` のままのアプリもこれらの wrapper で引き続き動作します。
  runtime で 2.x が必要になるのは追加分だけです。
- **各ストアのデザインに従います。** Shopify 管理画面の中では、新しい管理画面デザインの
  ストアでは新しい見た目になり、以前のデザインのストアでは 1.x の見た目のままです。
  管理画面の外ではデフォルトで新しい見た目が使われるため、ローカルで簡単にプレビューできます。
- **ビューポート下部付近の固定（fixed）またはスティッキー（sticky）なコンテンツ**は、
  `--shopify-safe-area-inset-bottom` CSS 変数でスペースを確保してください
  （[environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)）。
  これにより、フローティング表示の Sidekick バーに隠れなくなります。
- **Built for Shopify アプリ**は、**2027 年 5 月 1 日**までに管理画面の新しい
  ビジュアルスタイルに合わせる必要があります。

## 3. Vite を設定する {#_3-configure-vite}

`s-*` タグを Vue コンポーネントとして解決しようとせず、カスタム要素として扱うよう
Vue のコンパイラに指示します。

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

## 4. 最初のコンポーネント {#_4-your-first-component}

`polaris-vue-elements` からコンポーネントをインポートし、他の Vue コンポーネントと同じように
使います。props と events はすべて型付けされています。

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'

function handleClick(): void {
  console.log('clicked')
}
</script>

<template>
  <SButton variant="primary" @click="handleClick">Save</SButton>
</template>
```

## 5. フォームコンポーネントでの v-model {#_5-v-model-on-form-components}

フォーム系のコンポーネントは `v-model` に対応しており、要素ごとに正しい prop/event の
組み合わせに対応付けられます（完全な対応表は `src/lib/overrides.ts` を参照してください。
テキスト系は `value`/`input`、`SCheckbox`/`SSwitch` は `checked`/`change`、
`SChoiceList` は `values`/`change` などを使います）。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" placeholder="Your name" />
</template>
```

## 6. オーバーレイの制御（modal、popover、tooltip） {#_6-controlling-overlays-modal-popover-tooltip}

`SModal` などのオーバーレイコンポーネントは、2 通りの方法で制御できます。

**宣言的に**制御する場合は、トリガーボタンに標準 HTML の `commandFor`/`command` 属性を
指定します。スクリプトは不要です。

```vue
<template>
  <SButton commandFor="demo-modal" command="--show">Open modal</SButton>

  <SModal id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
    <template #primary-action>
      <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
    </template>
  </SModal>
</template>
```

**命令的に**制御する場合は、型付きのテンプレート ref を取得し、`$el` を通じて
内部要素のメソッドを呼び出します。

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SModal } from 'polaris-vue-elements'

const modalRef = useTemplateRef<InstanceType<typeof SModal>>('modal')

function openModal(): void {
  modalRef.value?.$el.showOverlay()
}
</script>

<template>
  <SModal ref="modal" id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
  </SModal>
</template>
```

## 7. 生の `<s-*>` タグに型を付ける（任意） {#_7-typing-raw-s-tags-optional}

wrapper に切り替えず、Polaris 本来のタグ（`<s-button>`、`<s-text-field>` など）を
書き続けたい場合でも、このパッケージでそれらに型を付けられます。`tsconfig.json` で
一度だけ有効にしてください。

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

または、`env.d.ts` などの `.d.ts` ファイルで参照を追加します。

```ts
/// <reference types="polaris-vue-elements/elements" />
```

これにより、すべての Polaris タグが Vue の `GlobalComponents` に追加され、Volar と `vue-tsc` が
wrapper と同じように生のタグをチェックします。union 型の props、型付きの `@click` /
`@aftershow` リスナー、命令的なメソッド呼び出しのための型付き要素が得られます。

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

これは型のみの機能です。runtime では何も登録されないため、手順 3 の `isCustomElement`
設定はそのまま残してください。wrapper との違いは 2 つあります。

- **生のタグでは `v-model` を使えません。** `:value` をバインドし、`@input` / `@change` を
  自分でリッスンするか、各フォームフィールドのプロパティとイベントを対応付けてくれる
  wrapper コンポーネントを使ってください。
- **同じタグに対する手書きの shim と併用しないでください。** 異なる型を持つ
  `GlobalComponents['s-button']` の宣言が 2 つあると競合します。有効にする際は shim を
  削除してください。

## 次のステップ {#next-steps}

各 wrapper の prop/event の一覧は[コンポーネントリファレンス](/ja/components/)で確認できます。
また、実際に遭遇する前に[既知の注意点](/ja/guide/quirks)を読んでおくことをおすすめします。

Shopify アプリを作る場合は、[Vue 3 で Shopify 埋め込みアプリを作る](/ja/guide/shopify-embedded-app)を参照してください。
Vue から App Bridge を読み込む方法、認証付きリクエスト、App Bridge API について説明しています。
