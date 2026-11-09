---
title: Shopify Polaris CSS 変数とデザイントークン（web components）
description: Shopify web components の runtime が定義するすべての Polaris デザイントークンを、ライブプレビュー、検索、コピー付きで掲載。アプリ独自の CSS 用に tokens.css としてインポートできます。
schema: TechArticle
---

# Polaris CSS 変数（デザイントークン） {#css-variables}

Polaris web components は自分自身のスタイルを持っていますが、アプリには通常、独自の CSS も
あります。ページのグリッド、カスタムカード、チャートの凡例、2 つのコンポーネントの間の
余白などです。Polaris CSS 変数を使えば、その CSS でも周囲のコンポーネントと同じ色、
余白、角丸、フォントを使えるため、値を推測でハードコードするのではなく、管理画面の
デザインに合わせられます。

`polaris-vue-elements` は、アプリが読み込む Polaris runtime から抽出した変数を、1 つの
スタイルシート `tokens.css` として提供しています。

::: warning 非公式
Shopify は Polaris web components の CSS 変数一覧を公開していません。これらの名前と値は
Shopify の runtime（`polaris-2.js`）から抽出したものです。そのため値は CDN に追従し、
Shopify が名前を変更すると、名前が変わったりなくなったりすることがあります。一覧は毎日
チェックされています（[最新の状態を保つ仕組み](#how-it-stays-up-to-date)を参照）。
:::

## 使うべき場面 {#when-to-use}

- **使ってよい場面**: アプリ自身が所有する要素。ラッパー、レイアウト用コンテナ、
  カスタムウィジェット、Polaris コンポーネントの外で描画するテキストなどです。
- **使うべきでない場面**: Polaris コンポーネントのスタイルを変えようとすること。各コンポーネントは
  自身の shadow root の中で描画されるため、ページで `--p-color-bg-fill-brand` を設定しても
  `<SButton>` の色は変わりません。代わりにコンポーネントの props（`tone`、`variant`、
  `padding` など）を使ってください。
- **まずはレイアウトコンポーネントを優先してください。** `<SStack>`、`<SGrid>`、`<SBox>` は、
  Polaris の余白、パディング、ボーダーの値をすでに props として受け取ります。それらで
  足りない場合に CSS 変数を使ってください。

## インストール {#install}

スタイルシートを一度だけインポートします。たとえば `main.ts` で:

```ts
import 'polaris-vue-elements/tokens.css'
```

あとは任意の CSS で変数を使えます:

```vue
<template>
  <div class="summary">
    <SText type="strong">Orders today</SText>
    <SText>42</SText>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  gap: var(--p-space-300);
  padding: var(--p-space-400);
  border: var(--p-border-width-025) solid var(--p-color-border);
  border-radius: var(--p-border-radius-300);
  background: var(--p-color-bg-surface);
  box-shadow: var(--p-shadow-100);
}
</style>
```

生の名前と値は、ツールや CSS-in-JS 向けに JSON でも利用できます:

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## テーマ {#themes}

runtime には 2 つの見た目があります。以前の管理画面デザインのストアでは、ベースの値
（`tokens.css` の `:root` ブロック）が使われます。新しい管理画面デザインのストアと、
Shopify 管理画面の外のページでは、`admin-next` テーマが使われます。最初の Polaris
コンポーネントが描画されると、runtime が `<html>` にクラス `p-partial-theme-admin-next` を
追加し、`tokens.css` は同じクラスの下で異なる値を上書きします。追加の作業なしで、
アプリの CSS は runtime が選んだテーマに従います。下で **ベース** と **admin-next** を
切り替えると、それぞれの値を確認できます。半分塗りつぶされた点は、2 つのテーマで値が
異なる変数を示します。

runtime が追加の条件下でのみ適用する値（広色域の P3 カラー、モバイル向けの文字サイズ、
ハイコントラストモード、`corner-shape` のサポート）は含まれていません。`tokens.css` には
それぞれのデフォルト値が入っています。

## 最新の状態を保つ仕組み {#how-it-stays-up-to-date}

スケジュールされたジョブが毎日 Shopify の CDN から `polaris-2.js` を読み込み、変数を抽出して、
追加・削除・変更があれば pull request を作成します。`polaris-vue-elements` の各リリースには、
そのリリース時点の一覧が含まれます。

<div class="css-variables-list">

## すべての変数 {#all-variables}

<CssVariablesSpecimen />

<CssVariablesToolbar />

### 色: 背景 {#color-bg}

<CssVariables group="color-bg" />

### 色: テキスト {#color-text}

<CssVariables group="color-text" />

### 色: ボーダー {#color-border}

<CssVariables group="color-border" />

### 色: アイコン {#color-icon}

<CssVariables group="color-icon" />

### 色: その他 {#color-other}

<CssVariables group="color-other" />

### 余白 {#space}

<CssVariables group="space" />

### 角丸 {#border-radius}

<CssVariables group="border-radius" />

### ボーダー幅 {#border-width}

<CssVariables group="border-width" />

### フォント {#font}

<CssVariables group="font" />

### 影 {#shadow}

<CssVariables group="shadow" />

### モーション {#motion}

<CssVariables group="motion" />

### Z-index {#z-index}

<CssVariables group="z-index" />

### 幅 {#width}

<CssVariables group="width" />

### 高さ {#height}

<CssVariables group="height" />

### ブレークポイント {#breakpoints}

ブレークポイント変数は幅を保持していますが、CSS ではメディアクエリの中で `var()` を
使えないため、値を直接書いてください: `@media (min-width: 48rem)`。

<CssVariables group="breakpoints" />

### その他 {#other}

<CssVariables group="other" />

</div>

## `@shopify/polaris-tokens` からの移行 {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` は Polaris React のトークンパッケージです。Polaris web components
はこれを使いません。runtime が独自の変数を定義しており、ほとんどの名前はそのまま引き継がれて
います。アプリの CSS が Polaris React アプリから持ってきたものなら、下の一覧と照らし合わせて
ください。旧パッケージにしかない名前は web components アプリでは値を持たないため、それを使う
CSS には自分で書いた `var()` のフォールバック値が使われるか、何も適用されません。

<CssVariablesMigration />

## よくある質問 {#faq}

### Polaris web components に CSS 変数はありますか？

はい。Polaris の runtime（`polaris-2.js`）は `:root` に約 700 個の `--p-*` カスタムプロパティを
定義し、コンポーネントの内部で使っています。Shopify はこれらをドキュメント化しておらず、
runtime 上の名前にはビルドハッシュが付いています。`tokens.css` を使えば、同じ値を安定した
名前で利用できます。

### これらの変数で Polaris コンポーネントのスタイルを変えられますか？

いいえ。各コンポーネントは自身の shadow root の中で描画され、runtime 独自のハッシュ付き変数を
読み込むため、ページで `--p-color-bg-fill-brand` を設定しても `<SButton>` は変わりません。
`tone` や `variant` などのコンポーネントの props を使ってください。これらの変数は、
コンポーネントの周りにあるアプリ自身の要素のためのものです。

### DevTools に表示される変数名の末尾に `-6e076` のようなハッシュが付くのはなぜですか？

runtime はすべての名前にビルドごとのサフィックスを付けます（`--p-color-bg-surface-6e076`）。
このサフィックスはビルドごとに変わります。これらの名前を CSS にコピーしないでください。
`tokens.css` はサフィックスを取り除いているため、Shopify が新しいビルドを公開した後も
`var(--p-color-bg-surface)` はそのまま動作します。

### `@shopify/polaris-tokens` とは何が違いますか？

`@shopify/polaris-tokens` は Polaris React 向けのトークンパッケージです。この一覧は web
components の runtime そのものから取得しているため、新しい管理画面デザイン（`admin-next`）の
値も含め、コンポーネントが実際に使っているトークンが揃っています。ほとんどの名前は共通です。
違いについては [`@shopify/polaris-tokens` からの移行](#migrating-from-polaris-tokens)を
参照してください。

### 変数はダークモードに対応していますか？

ページのテーマとしては対応していません。runtime にはダーク用の値のセット（`admin-next-dark`）
がありますが、一部のコンポーネント内部の要素にのみ適用され、ページには適用されないため、
`tokens.css` にダークテーマはありません。自分で作りたい場合は、値が `tokens.json` の
`themes["admin-next-dark"]` にあります。
