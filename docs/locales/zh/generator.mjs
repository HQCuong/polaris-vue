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
  cssVariablesTip: (name, link) =>
    `要在 \`<${name}>\` 周围编写自己的 CSS？使用 Polaris [CSS 变量](${link})（\`--p-space-*\`、\`--p-color-*\` 等），让布局与组件保持一致。`,
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
  // docs/zh/app-bridge/types/. Shopify's descriptions on those pages stay in English.
  appBridgeTypes: {
    title: '适用于 Vue 3 的 App Bridge 类型 – ShopifyGlobal',
    description:
      '适用于 Vue 3 的 App Bridge 组件所用的 @shopify/app-bridge-types 类型参考：ShopifyGlobal、按类别划分的 API、元素属性和 A–Z 索引。',
    heading: 'App Bridge 类型',
    intro: (pkg, version, subpath) =>
      `App Bridge 各页面用到的类型，以及它们引用的所有类型，均来自 ${pkg} ${version}。${subpath} 重新导出该包所导出的类型。说明是 Shopify 自己的 JSDoc，保留英文。`,
    pagesHeading: '页面',
    azIndex: 'A–Z 索引',
    otherApis: '其他 API',
    sharedTypes: '多个类别共用',
    listSeparator: '、',
    onThisPage: (list) => `本页：${list}。`,
    pages: {
      'authentication-and-data': {
        title: 'App Bridge 类型：身份验证和数据',
        description:
          '适用于 Vue 3 的 @shopify/app-bridge-types 中 App Bridge 身份验证和数据 API 的类型：它们的成员，以及只有它们使用的类型。',
        lead: 'Shopify 归入“身份验证和数据”的 API，以及只有它们使用的类型。',
      },
      'user-interface-and-interactions': {
        title: 'App Bridge 类型：用户界面',
        description:
          '适用于 Vue 3 的 @shopify/app-bridge-types 中 App Bridge 用户界面和交互 API 的类型：它们的成员，以及只有它们使用的类型。',
        lead: 'Shopify 归入“用户界面和交互”的 API，以及只有它们使用的类型。',
      },
      'device-and-platform-integration': {
        title: 'App Bridge 类型：设备和平台',
        description:
          '适用于 Vue 3 的 @shopify/app-bridge-types 中 App Bridge 设备和平台集成 API 的类型：它们的成员，以及只有它们使用的类型。',
        lead: 'Shopify 归入“设备和平台集成”的 API，以及只有它们使用的类型。',
      },
      elements: {
        title: 'App Bridge 类型：元素与属性',
        description:
          '适用于 Vue 3 的 @shopify/app-bridge-types 中 App Bridge 元素接口和属性的类型：它们的成员，以及只有它们使用的类型。',
        lead: 'App Bridge 的元素接口和属性类型，以及只有它们使用的类型。',
      },
      other: {
        title: 'App Bridge 类型：其他 API 和类型',
        description:
          '适用于 Vue 3 的 @shopify/app-bridge-types 中 shopify.dev 未归入任何类别的 App Bridge API，以及多个类别共用的类型。',
        lead: 'shopify.dev 未归入任何类别的 API，以及多个类别共用的类型。',
      },
    },
    table: { member: '成员', type: '类型', description: '说明' },
    notDescribed: '类型中没有说明。',
    exported: '导入：',
    global: '在 `declare global` 中声明，因此无需导入即可使用。',
    typeParameters: '类型参数：',
    extends: '继承：',
    references: '引用：',
    usedIn: '用于：',
    deprecated: '已弃用。',
    default: '默认值：',
    see: '参见：',
  },
}
