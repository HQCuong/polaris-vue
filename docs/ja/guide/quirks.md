---
title: Vue で使う Shopify Polaris web components — 既知の注意点
description: Vue 3 から Shopify Polaris web components を使う際の、ブラウザで検証済みの注意点。slot の要件、イベントのタイミング、一般的な Vue コンポーネントライブラリとは異なる v-model の挙動を解説します。
---

# 既知の注意点 {#known-quirks-gotchas}

ここで紹介するのは、内部で使われている Polaris web components の、ブラウザで検証済みの
実際の挙動です。一般的な Vue コンポーネントライブラリに慣れていると、予想と異なる
場合があります。問題に遭遇する前に読んでおけば、デバッグの時間を節約できます。

## 1. `<SBanner>` には slot のコンテンツが必要 {#_1-sbanner-needs-slot-content}

`heading` 属性だけでは不十分です。`<s-banner>` はデフォルト slot にコンテンツがないと
空のまま描画されます。

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. modal のアクション slot は特定の button variant しか受け付けない {#_2-modal-action-slots-only-accept-specific-button-variants}

`SModal` の `primary-action` slot は、`variant="primary"` のボタン 1 つしか受け付けません。
Polaris は内部で slot のコンテンツを手動で割り当てており、条件に合わないノードは
**何も通知されずに破棄されます**。警告もエラーもなく、単に描画されません。
`secondary-actions` は `variant` が `secondary` または `auto` のボタンを受け付けます。

```vue
<!-- ❌ Don't: wrong variant in primary-action, vanishes silently -->
<template #primary-action>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: primary-action must be variant="primary" -->
<template #primary-action>
  <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: secondary-actions accepts secondary or auto -->
<template #secondary-actions>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Cancel</SButton>
</template>
```

## 3. 数値型の props は文字列属性ではなくバインドで渡す {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

Polaris 自身のドキュメントではプレーンな HTML 属性（例: `rows="3"`）が使われていますが、
Vue ではこれは誤解を招きます。`number` 型の props に対して、`vue-tsc` は文字列リテラルではなく
バインドされた式を期待します。

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. slot の割り当ては接続時に一度だけ行われる {#_4-slot-assignment-happens-once-at-connect-time}

親がマウントされた後に子の `slot` 属性を変更しても、再割り当てはされません。
要素を名前付き slot 間で移動させる必要がある場合は、`slot` をリアクティブに変更するのではなく、
（`v-if`/`:key` などで）再描画してください。

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. Polaris runtime は CDN 上でバージョン管理されている — このライブラリのバージョンは runtime のバージョンではない {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

2026 年 8 月以降、Polaris CDN はセマンティックバージョニングに従っています
（[changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)）。
リリースプロセスに合ったチャンネルを選んでください。

| URL | 配信内容 |
| --- | --- |
| `polaris-2.js` | 2.x の stable チャンネル。Shopify 管理画面の新しいビジュアルスタイルで、互換性のある（minor）更新を自動的に受け取ります。**推奨。** |
| `polaris-2.0.js` | 固定リリース。固定を変更するまで、機能・修正・ビジュアルの変更はありません。 |
| `polaris-1.js` | 以前の 1.x stable チャンネル。 |
| `polaris.js` | レガシー URL。現在は `polaris-1.js` と同じビルドを配信しており、自動で新しいメジャーバージョンに移行することはありません。 |

新しいメジャーバージョン（2.0 など）への移行は常にオプトインで、スクリプトの URL を変更して
行います。Polaris 2.0 はビジュアルの更新です。その Custom Elements Manifest
（`@shopify/polaris-types@2.0.0`）は 1.1 と同じタグ、props、events、slots を宣言しており、
いくつかの追加（`SThumbnail` の `loading` prop、`STextField` のアイコン追加）があるだけなので、
これらの wrapper は `polaris-1.js` でも動作します。

どのチャンネルを読み込んでも、runtime はインストール済みの `polaris-vue-elements` の
バージョンとは独立して更新されます。このライブラリのバージョンが表すのは、生成された
**型と wrapper** の新しさだけです。

- 古い wrapper が既存のコンポーネントを壊すことはありません。ただし、wrapper の最終生成後に
  Shopify が追加した機能の型付き props/events が欠けている可能性があります。
- 未知の props も動作します。型なしのまま `$attrs` 経由で内部要素に渡されます。
- 未知の新しいコンポーネントも動作します。型付きの wrapper が生成されるまでは、
  生のカスタム要素タグ（例: `<s-new-component>`）を直接使ってください。

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
