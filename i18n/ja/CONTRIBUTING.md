<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | [简体中文](../zh/CONTRIBUTING.md) | **日本語** | [Deutsch](../de/CONTRIBUTING.md) | [Français](../fr/CONTRIBUTING.md)</sub>

# コントリビューションガイド

> この翻訳は英語版より更新が遅れている場合があります。内容に相違がある場合は、[英語版](../../CONTRIBUTING.md)が正式なものです。

ご協力ありがとうございます。バグ報告、ドキュメントの修正、プルリクエストのいずれも歓迎します。

参加するすべての人は[行動規範](./CODE_OF_CONDUCT.md)に従うことが求められます。

## 始める前に

- **バグや小さな修正の場合は？** 直接プルリクエストを作成してください。バグかどうか確信がない場合は issue を作成してください。
- **新機能や公開 API の変更の場合は？** コードを書く前に、まず issue を作成して方向性をすり合わせてください。

## セットアップ

[`.nvmrc`](../../.nvmrc) の Node バージョンを使い（`nvm use`）、次を実行します。

```sh
npm install            # `npm run check` を実行する pre-push フックもインストールされます
npm run dev            # 実際の Polaris コンポーネントで動くプレイグラウンド (src/App.vue)
npm run docs:dev       # ドキュメントサイト
```

## 基本ルール

1. **`src/lib/generated/` と `docs/components/` は決して手で編集しないでください。** これらはジェネレーターによって上書きされます。代わりに `scripts/generate.mjs` / `scripts/generate-docs.mjs` を変更し、`npm run generate && npm run docs:generate` を実行して出力をコミットしてください。
2. **新しいフォームコンポーネントに v-model が必要な場合は？** `src/lib/overrides.ts` に 1 行追加してください（`overrides.spec.ts` のドリフト検知が、足りない箇所を正確に指摘します）。
3. **手書きのドキュメント例を追加する場合は？** `docs/examples/<tag>.md` を追加してください（複雑なライブデモは `docs/examples/demos/*.vue` に置きます。SFC は markdown-it による崩れの影響を受けないためです）。ドキュメントジェネレーターが自動的にページへ埋め込みます。手書きのベストプラクティスは `docs/best-practices/<tag>.md` に置きます。
4. **Polaris の挙動は実際のブラウザで検証してください。** Polaris コンポーネントに関する主張（slot のルール、レンダリングの癖）は、jsdom だけでなく実際の CDN の runtime（`polaris-2.js`）で確認する必要があります。これまでに検証済みの結果は [`docs/guide/quirks.md`](../../docs/guide/quirks.md) を参照してください。
5. `src/lib/runtime/` やジェネレーターの挙動を変更する場合は、必ず**テストを追加してください**。

## プルリクエストを作成する前に

CI と同じチェックを実行してください。

```sh
npm run generate && npm run docs:generate   # 生成コードが最新であること
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # ドキュメントやドキュメントジェネレーターを変更した場合
```

その後:

- パッケージの利用者が気づく変更については、**`CHANGELOG.md` の `## [Unreleased]` に 1 行追加してください**（`Added`、`Changed`、`Fixed`、`Removed` のいずれか）。ドキュメントのみの変更や内部的な変更には不要です。CHANGELOG は英語で書きます。
- **PR のタイトルは [Conventional Commits](https://www.conventionalcommits.org/) 形式にしてください**: `fix: ...`、`feat: ...`、`docs: ...`、`chore: ...`、`test: ...`。破壊的変更には `!` を付けます（`feat!: ...`）。
- 1 つのプルリクエストには 1 つの変更だけを含めてください。

## プルリクエスト作成後の流れ

- 初めてのコントリビュートの場合、GitHub Actions はメンテナーが CI の実行を承認するまで待機します。これはフォークからのプルリクエストに対する GitHub の安全策であり、変更内容に対する評価ではありません。
- メンテナーがレビューしてマージし、次のリリースで公開します。リリースはメンテナーが作成します（[リリース](./README.md#リリース)を参照）。

## セキュリティ

脆弱性を見つけた場合は、issue を作成せず、[セキュリティポリシー](./SECURITY.md)を参照してください。

## ライセンス

コントリビュートすることにより、あなたの貢献が [MIT ライセンス](../../LICENSE)のもとで提供されることに同意したものとみなされます。
