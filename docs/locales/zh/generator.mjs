// Simplified Chinese strings for scripts/generate-docs.mjs. Hand-written prose
// per component lives next to this file: summaries.json, manifest.json
// (Shopify's prop and slot descriptions, keyed by the English text) and
// best-practices/.

export default {
  categories: {
    Actions: '操作',
    'Feedback and status': '反馈与状态',
    Forms: '表单',
    'Layout and structure': '布局与结构',
    'Media and visuals': '媒体与视觉',
    Overlays: '浮层',
    'Typography and content': '文字与内容',
  },
  headings: {
    bestPractices: '最佳实践',
    example: '示例',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: '类型',
    description: '说明',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `${name} 的示例内容`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` 是 Shopify Polaris \`<${tag}>\` web component 的带类型 Vue 3 wrapper。`,
  title: (name, tag, plain) => `${name} (${tag}) – 适用于 Vue 3 的 Shopify Polaris ${plain}`,
  description: (name, summary, tag, vModel) =>
    `${name}：${summary} Shopify Polaris <${tag}> 的带类型 Vue 3 wrapper，提供 props、events${vModel ? '、v-model' : ''} 和 slots。`,
  vModel: (name, prop, event) =>
    `\`<${name}>\` 上的 \`v-model\` 绑定到 \`${prop}\` property，并监听 \`${event}\` DOM 事件。`,
  vModelEquivalent: '等价于：',
  truncatedTypes:
    '> 为便于阅读，上面部分类型列已被截断；完整的联合类型见库中生成的 TypeScript 类型（`src/lib/generated/types.ts`）。',
  eventsHint: (event, name) => `在 \`<${name}>\` 上使用 \`@${event}\` 形式的监听器来监听这些事件。`,
  methodsIntro: (name) =>
    `\`<${name}>\` 在其底层 DOM 元素上提供以下方法（可通过带类型的模板 ref 访问）：`,
  index: {
    title: '适用于 Vue 3 的 Shopify Polaris web components',
    description: (count) =>
      `浏览全部 ${count} 个 Shopify Polaris web components 的带类型 Vue 3 wrapper，按类别分组：操作、表单、布局、反馈、表格等。`,
    heading: '组件',
    lead: (count) =>
      `${count} 个带类型的 Vue wrapper，每个对应一个 Polaris web component，分组方式与 [Shopify 参考文档](https://shopify.dev/docs/api/app-home/polaris-web-components) 一致。`,
  },
}
