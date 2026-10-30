// Japanese strings for scripts/generate-docs.mjs. Hand-written prose per
// component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: 'アクション',
    'Feedback and status': 'フィードバックとステータス',
    Forms: 'フォーム',
    'Layout and structure': 'レイアウトと構造',
    'Media and visuals': 'メディアとビジュアル',
    Overlays: 'オーバーレイ',
    'Typography and content': 'タイポグラフィとコンテンツ',
  },
  headings: {
    bestPractices: 'ベストプラクティス',
    example: '例',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: '型',
    description: '説明',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `${name} のサンプルコンテンツ`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` は、Shopify Polaris の \`<${tag}>\` web component 向けの型付き Vue 3 wrapper です。`,
  title: (name, tag, plain) => `${name} (${tag}) – Vue 3 向け Shopify Polaris ${plain}`,
  description: (name, summary, tag, vModel) =>
    `${name}：${summary} Shopify Polaris <${tag}> 向けの型付き Vue 3 wrapper。props、events${vModel ? '、v-model' : ''}、slots を掲載しています。`,
  vModel: (name, prop, event) =>
    `\`<${name}>\` の \`v-model\` は \`${prop}\` プロパティにバインドされ、\`${event}\` DOM イベントを監視します。`,
  vModelEquivalent: 'これは次と同等です：',
  truncatedTypes:
    '> 上記の一部の型の列は読みやすさのために省略されています。完全な union はライブラリが生成する TypeScript の型（`src/lib/generated/types.ts`）で確認できます。',
  eventsHint: (event, name) => `これらのイベントは \`<${name}>\` 上で \`@${event}\` 形式のリスナーで受け取れます。`,
  methodsIntro: (name) =>
    `\`<${name}>\` は、内部の DOM 要素で次のメソッドを公開しています（型付きのテンプレート ref からアクセスできます）：`,
  index: {
    title: 'Vue 3 向け Shopify Polaris web components',
    description: (count) =>
      `Shopify Polaris web components 向けの型付き Vue 3 wrapper 全 ${count} 個を、アクション、フォーム、レイアウト、フィードバック、テーブルなどのカテゴリ別に紹介します。`,
    heading: 'コンポーネント',
    lead: (count) =>
      `${count} 個の型付き Vue wrapper。Polaris web component ごとに 1 つずつ用意し、[Shopify 公式リファレンス](https://shopify.dev/docs/api/app-home/polaris-web-components)と同じ方法で分類しています。`,
  },
}
