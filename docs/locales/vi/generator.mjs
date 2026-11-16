// Vietnamese strings for scripts/generate-docs.mjs. Hand-written prose per
// component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: 'Hành động',
    'Feedback and status': 'Phản hồi và trạng thái',
    Forms: 'Form',
    'Layout and structure': 'Bố cục và cấu trúc',
    'Media and visuals': 'Hình ảnh và media',
    Overlays: 'Overlay',
    'Typography and content': 'Chữ và nội dung',
  },
  headings: {
    bestPractices: 'Thực hành tốt',
    example: 'Ví dụ',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: 'Kiểu',
    description: 'Mô tả',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `Nội dung ví dụ cho ${name}`,
  cssVariablesTip: (name, link) =>
    `Viết CSS riêng quanh \`<${name}>\`? Hãy dùng [biến CSS](${link}) của Polaris (\`--p-space-*\`, \`--p-color-*\`, …) để layout của bạn khớp với các component.`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` là Vue 3 wrapper có type cho web component \`<${tag}>\` của Shopify Polaris.`,
  title: (name, tag, plain) => `${name} (${tag}) – ${plain} Shopify Polaris cho Vue 3`,
  description: (name, summary, tag, vModel) =>
    `${name}: ${summary} Vue 3 wrapper có type cho <${tag}> của Shopify Polaris: props, events${vModel ? ', v-model' : ''} và slots.`,
  vModel: (name, prop, event) =>
    `\`v-model\` trên \`<${name}>\` gắn với property \`${prop}\` và lắng nghe DOM event \`${event}\`.`,
  vModelEquivalent: 'tương đương với:',
  truncatedTypes:
    '> Một số cột kiểu ở trên đã được rút gọn cho dễ đọc; union đầy đủ có trong type TypeScript được generate của thư viện (`src/lib/generated/types.ts`).',
  eventsHint: (event, name) => `Lắng nghe các event này bằng listener dạng \`@${event}\` trên \`<${name}>\`.`,
  methodsIntro: (name) =>
    `\`<${name}>\` cung cấp các method sau trên DOM element bên dưới (truy cập qua template ref có type):`,
  index: {
    title: 'Shopify Polaris web components cho Vue 3',
    description: (count) =>
      `Xem đủ ${count} Vue 3 wrapper có type cho Shopify Polaris web components, chia theo nhóm: hành động, form, bố cục, phản hồi, bảng và nhiều hơn nữa.`,
    heading: 'Components',
    lead: (count) =>
      `${count} Vue wrapper có type, mỗi wrapper cho một Polaris web component, được chia nhóm giống [tài liệu tham khảo của Shopify](https://shopify.dev/docs/api/app-home/polaris-web-components).`,
  },
  // docs/vi/app-bridge/types.md. Shopify's descriptions on that page stay in English.
  appBridgeTypes: {
    title: 'Type App Bridge – tài liệu tham khảo @shopify/app-bridge-types cho Vue 3',
    description:
      'Tài liệu tham khảo các type của @shopify/app-bridge-types mà các component App Bridge cho Vue 3 dùng: ShopifyGlobal, các API của nó, attribute của element và các type chúng tham chiếu.',
    heading: 'Các type App Bridge',
    intro: (pkg, version, subpath) =>
      `Các type được dùng trên các trang App Bridge, cùng mọi type mà chúng tham chiếu, lấy từ ${pkg} ${version}. ${subpath} re-export những type mà package export. Phần mô tả là JSDoc của chính Shopify, giữ nguyên tiếng Anh.`,
    groups: {
      apis: 'ShopifyGlobal và các API',
      elements: 'Element và attribute',
      other: 'Các type khác',
    },
    table: { member: 'Thành viên', type: 'Kiểu', description: 'Mô tả' },
    notDescribed: 'Không được mô tả trong type.',
    exported: 'Import:',
    global: 'Được khai báo trong `declare global`, nên có thể dùng mà không cần import.',
    typeParameters: 'Tham số type:',
    extends: 'Kế thừa:',
    references: 'Tham chiếu:',
    usedIn: 'Được dùng trong:',
    deprecated: 'Đã lỗi thời.',
    default: 'Mặc định:',
    see: 'Xem:',
  },
}
