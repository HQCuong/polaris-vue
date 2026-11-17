---
title: AI コーディングエージェントで使う Vue 3 の Shopify Polaris — llms.txt と AGENTS.md
description: polaris-vue-elements のドキュメントを Markdown として AI コーディングエージェントに渡す方法 — llms.txt、llms-full.txt、全ページの .md コピー、npm パッケージに同梱された AGENTS.md ガイド。
---

# polaris-vue-elements を AI エージェントで使う {#using-polaris-vue-elements-with-ai-agents}

コーディングエージェントは、React のサンプルや素の `<s-*>` タグから推測するよりも、
このライブラリのドキュメントを読んだほうが、より良い Vue コードを書けます。
ドキュメントは、エージェントが読める 3 つの形式で提供されており、npm パッケージには
エージェント向けに書かれた短いガイドも同梱されています。

## llms.txt と llms-full.txt {#llms-txt-and-llms-full-txt}

[llms.txt](https://llmstxt.org/) の規約に従い、このサイトは次のものを公開しています。

| URL | 内容 |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | 英語版ドキュメントの索引。ガイド、カテゴリ別の全コンポーネント、App Bridge、CSS variables が、それぞれ 1 行の説明と Markdown コピーへのリンク付きで並びます。 |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | 英語版の全ページを 1 つの Markdown ファイルにまとめたもの。 |

`llms.txt` は十分に小さいので、エージェントの出発点として渡せます。エージェントは
リンクをたどって必要なページを読みます。`llms-full.txt` は大きいため、リファレンス全体を
一度にコンテキストへ入れたいときに使ってください。

## 全ページの Markdown コピー {#a-markdown-copy-of-every-page}

英語版のすべてのページには、同じパスに `.md` を付けた Markdown 版もあります。

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

コンポーネントページのコピーには、ライブデモを除き、import、`v-model` バインディング、
props、events、methods、slots が含まれます。各 HTML ページは、
`<link rel="alternate" type="text/markdown">` でそのコピーにリンクしています。

## npm パッケージ内の AGENTS.md {#agents-md-in-the-npm-package}

`polaris-vue-elements` には `AGENTS.md` が同梱されています。これは、このライブラリで
Vue 3 アプリを書くエージェント向けの簡潔なガイドで、セットアップ、import、`v-model`、
App Bridge、既知の注意点、そして全コンポーネントとそのタグの一覧を収めています。
パッケージの中にあるため、インストールしているバージョンといつも一致します。

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## エージェントに読ませる {#point-your-agent-at-it}

多くのコーディングエージェントは、`AGENTS.md`、`CLAUDE.md`、Cursor のルールなどの
プロジェクト用の指示ファイルを読みます。お使いのエージェントが使うファイルに数行を追加して、
UI コードを書く前にライブラリのガイドを読ませましょう。

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

エージェントが `node_modules` 内のファイルを読めない場合は、代わりに
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt) の URL を渡してください。

## 次のステップ {#next-steps}

- [はじめに](/ja/guide/getting-started): インストール、Polaris の runtime、`v-model`。
- [既知の注意点](/ja/guide/quirks): エージェントにも伝えておく価値のある挙動。
- [すべてのコンポーネント](/ja/components/): Markdown コピーの元になっているリファレンス。
