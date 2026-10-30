<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | [한국어](../ko/README.md) | [简体中文](../zh/README.md) | **日本語** | [Deutsch](../de/README.md) | [Français](../fr/README.md)</sub>

<br>

<a href="https://polaris-vue-elements.dev/ja/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: Shopify Polaris web components のための型付き Vue 3 wrapper" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[ドキュメント](https://polaris-vue-elements.dev/ja/)** ·
[はじめに](https://polaris-vue-elements.dev/ja/guide/getting-started) ·
[コンポーネント](https://polaris-vue-elements.dev/ja/components/) ·
[埋め込みアプリガイド](https://polaris-vue-elements.dev/ja/guide/shopify-embedded-app) ·
[変更履歴](../../CHANGELOG.md)

</div>

---

> この翻訳は英語版より更新が遅れている場合があります。内容に相違がある場合は、[英語版](../../README.md)が正式なものです。

[Shopify Polaris web components](https://shopify.dev/docs/api/app-home/web-components) のための、型付きの Vue 3 wrapper コンポーネントです。Polaris web components とは、Shopify App Home（Shopify 管理画面に埋め込まれるアプリ）の構築に使われる `s-*` カスタム要素です。

Polaris の runtime 自体は Shopify の CDN から読み込まれます（安定版チャネルの `polaris-2.js` は互換性のある更新を自動的に受け取ります）。このライブラリは、その上に Vue らしく完全に型付けされたインターフェースを提供します。

## 特長

- **全 62 コンポーネントの props と events に型付け**。Shopify 公式の Custom Elements Manifest（`@shopify/polaris-types`）から生成されています。`variant` のようなユニオン型の props、テンプレートでの補完、型付きの `@click` / `@aftershow` リスナーが使えます。
- **17 個のフォームコンポーネントで `v-model` に対応**（`STextField`、`SCheckbox`、`SSelect`、`SChoiceList` など）。それぞれ正しいプロパティとイベントの組み合わせにマッピングされています。
- **オーバーレイを命令的に制御。** `SModal` は型付きの `$el`（`ModalElement`）を公開しているため、`modal.value?.$el.showOverlay()` が型チェックを通ります。Polaris の宣言的な `commandFor` / `command` パターンも併用できます。
- **段階的に機能が落ちるだけで、妨げにはなりません。** 未知の props は `$attrs` 経由でそのまま渡され、slots はそのまま転送されます。Polaris の新しいコンポーネントも、常に素の `s-*` タグとして使えます。wrapper が古くても新機能の型が欠けるだけで、既存の機能が壊れることはありません。

## インストール

```sh
npm install polaris-vue-elements
```

Vue `^3.5` は peer dependency です。

### Runtime のセットアップ（必須）

wrapper は表示のみを担当します。ホストアプリで Shopify の CDN から Polaris の runtime を読み込み、`s-*` タグがカスタム要素であることを Vue に伝えてください。

```html
<!-- index.html -->
<script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
```

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-'),
    },
  },
})
```

> **注:** `polaris-2.js` は Shopify の安定版チャネルで、管理画面の新しいビジュアルデザインが適用されます。`polaris-1.js` を使っているアプリも引き続き動作します。2.0 のコンポーネント API は、いくつかの追加を除いて 1.1 と同じです。詳しくは [Polaris 2.0 and the new admin design](https://polaris-vue-elements.dev/ja/guide/getting-started#polaris-2-0-and-the-new-admin-design) を参照してください。

## クイックスタート

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" />
  <SButton variant="primary" @click="console.log(name)">Save</SButton>
</template>
```

> **ヒント:** Polaris 本来の `<s-button>` タグで書きたい場合は、`tsconfig.json` に `"types": ["polaris-vue-elements/elements"]` を追加してください。Volar / `vue-tsc` が素の `<s-*>` タグも型チェックするようになります（型のみ。`v-model` は引き続き wrapper 専用です）。詳しくは [Typing raw `<s-*>` tags](https://polaris-vue-elements.dev/ja/guide/getting-started#_7-typing-raw-s-tags-optional) を参照してください。

## ドキュメント

すべてのドキュメントは **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/ja/)** にあります。

- [Getting started](https://polaris-vue-elements.dev/ja/guide/getting-started): セットアップ、`v-model`、オーバーレイ、素のタグの型付け。
- [Build a Shopify embedded app with Vue 3](https://polaris-vue-elements.dev/ja/guide/shopify-embedded-app): App Bridge、認証付きの `fetch`、ナビゲーション、保存バー。
- [Known quirks](https://polaris-vue-elements.dev/ja/guide/quirks): 実際のブラウザで検証した Polaris の挙動。
- [Component reference](https://polaris-vue-elements.dev/ja/components/): 全 62 コンポーネントの props、events、slots、ベストプラクティス、ライブサンプル。

サイトのソースは [`docs/`](../../docs) にあります。`npm run docs:dev` でローカル実行できます。

## 仕組み

Shopify のマニフェストから導出できるものはすべて機械的に生成されます。人の判断が必要な部分は、小さなファイル 1 つにまとまっています。

```
@shopify/polaris-types (custom-elements.json)   ← 信頼できる唯一の情報源
        │  npm run generate
        ▼
src/lib/generated/        ← メタデータ、Props/Events/Element 型、コンポーネント（編集禁止）
src/lib/runtime/          ← createWrapper: 全 62 コンポーネント共通の汎用ファクトリー
src/lib/overrides.ts      ← 手書き: v-model のマッピングのみ
```

ドリフト検知テストにより、更新し忘れは起こりえません。生成コードが古い場合、マニフェストのコンポーネントに wrapper がない場合、新しいフォーム系コンポーネントに v-model の override がない場合、CI が失敗します。定期実行のワークフロー（[`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)）が、新しい `@shopify/polaris-types` が公開されると同期用の PR を自動で作成します。

<details>
<summary><strong>新しい Polaris バージョンへ手動で更新する</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # wrapper と型を再生成
npm run docs:generate     # コンポーネントリファレンスのドキュメントを再生成
git diff                  # 差分を確認し、API の変更を CHANGELOG.md に記載
```

</details>

## 開発

```sh
npm install
npm run dev            # 実際の Polaris コンポーネントで動くプレイグラウンド (src/App.vue)
npm run docs:dev       # ドキュメントサイト
npm run test:unit      # vitest（ドリフト検知 + wrapper の挙動）
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # マニフェストから src/lib/generated/ を再生成
npm run docs:generate  # マニフェストから docs/components/ を再生成
npm run build:lib      # 公開用パッケージを dist/ にビルド
```

## コントリビュート

バグ報告、ドキュメントの修正、プルリクエストを歓迎します。セットアップ、基本ルール、PR 前のチェックリストについては[コントリビューションガイド](./CONTRIBUTING.md)を、あわせて[行動規範](./CODE_OF_CONDUCT.md)もご覧ください。脆弱性の報告については[セキュリティポリシー](./SECURITY.md)を参照してください。

## リリース

リリースは `main` からバージョンタグを push して作成します。残りは [`release.yml`](../../.github/workflows/release.yml) が行います。チェックの実行、npm Trusted Publishing による provenance 付きの `npm publish`、そして `CHANGELOG.md` から作成したノートを含む GitHub Release の作成です。

<details>
<summary><strong>リリース手順（メンテナー向け）</strong></summary>

1. [`CHANGELOG.md`](../../CHANGELOG.md) で、`## [Unreleased]` の項目を新しい `## [x.y.z] - YYYY-MM-DD` 見出しの下へ移動し、末尾の比較リンクを更新します。polaris-types の同期 PR は、追加・削除されたコンポーネントをそこへ自動的に記録します。prop、slot、アイコンの変更は手動で追記してください（削除は破壊的変更です）。
2. `npm version x.y.z --no-git-tag-version` を実行し、両方のファイルをコミットして `main` に push します。
3. `git tag vx.y.z && git push origin vx.y.z`。プレリリースの接尾辞が付いたタグ（例: `v0.3.0-rc.0`）は `next` dist-tag で公開されます。

</details>

## ライセンス

[MIT](../../LICENSE)。Shopify とは提携しておらず、Shopify の承認を受けたものでもありません。
