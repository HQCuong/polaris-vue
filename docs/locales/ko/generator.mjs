// Korean strings for scripts/generate-docs.mjs. Hand-written prose per
// component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: '액션',
    'Feedback and status': '피드백 및 상태',
    Forms: '폼',
    'Layout and structure': '레이아웃 및 구조',
    'Media and visuals': '미디어 및 시각 요소',
    Overlays: '오버레이',
    'Typography and content': '타이포그래피 및 콘텐츠',
  },
  headings: {
    bestPractices: '모범 사례',
    example: '예시',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: '타입',
    description: '설명',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `${name} 예시 콘텐츠`,
  cssVariablesTip: (name, link) =>
    `\`<${name}>\` 주변에 직접 CSS를 작성하나요? Polaris [CSS 변수](${link})(\`--p-space-*\`, \`--p-color-*\`, …)를 사용하면 레이아웃이 컴포넌트와 일치합니다.`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\`은(는) Shopify Polaris \`<${tag}>\` web component를 위한 타입이 지정된 Vue 3 wrapper입니다.`,
  title: (name, tag, plain) => `${name} (${tag}) – Vue 3용 Shopify Polaris ${plain}`,
  description: (name, summary, tag, vModel) =>
    `${name}: ${summary} Shopify Polaris <${tag}>를 위한 타입이 지정된 Vue 3 wrapper: props, events${vModel ? ', v-model' : ''}, slots.`,
  vModel: (name, prop, event) =>
    `\`<${name}>\`의 \`v-model\`은 \`${prop}\` property에 바인딩되고 \`${event}\` DOM event를 수신합니다.`,
  vModelEquivalent: '다음과 동일합니다:',
  truncatedTypes:
    '> 위의 일부 타입 열은 읽기 쉽도록 축약되었습니다. 전체 union은 라이브러리에서 생성된 TypeScript 타입(`src/lib/generated/types.ts`)에 있습니다.',
  eventsHint: (event, name) => `\`<${name}>\`에서 \`@${event}\` 형식의 리스너로 이 events를 수신하세요.`,
  methodsIntro: (name) =>
    `\`<${name}>\`은(는) 기반 DOM element에 다음 methods를 제공합니다(타입이 지정된 template ref로 접근):`,
  index: {
    title: 'Vue 3용 Shopify Polaris web components',
    description: (count) =>
      `Shopify Polaris web components를 위한 타입이 지정된 Vue 3 wrapper ${count}개를 액션, 폼, 레이아웃, 피드백, 테이블 등 카테고리별로 살펴보세요.`,
    heading: '컴포넌트',
    lead: (count) =>
      `타입이 지정된 Vue wrapper ${count}개로, 각각 하나의 Polaris web component에 대응하며 [Shopify 레퍼런스](https://shopify.dev/docs/api/app-home/polaris-web-components)와 같은 방식으로 분류되어 있습니다.`,
  },
  // docs/ko/app-bridge/types.md. Shopify's descriptions on that page stay in English.
  appBridgeTypes: {
    title: 'App Bridge 타입 – Vue 3용 @shopify/app-bridge-types 레퍼런스',
    description:
      'Vue 3용 App Bridge 컴포넌트가 사용하는 @shopify/app-bridge-types 타입 레퍼런스입니다. ShopifyGlobal과 그 API, 요소 속성, 그리고 이들이 참조하는 타입을 다룹니다.',
    heading: 'App Bridge 타입',
    intro: (pkg, version, subpath) =>
      `App Bridge 페이지에서 사용하는 타입과 이 타입들이 참조하는 모든 타입으로, ${pkg} ${version}에서 가져왔습니다. ${subpath}는 패키지가 export하는 타입을 다시 export합니다. 설명은 Shopify의 JSDoc 그대로이며 영어로 되어 있습니다.`,
    groups: {
      apis: 'ShopifyGlobal과 API',
      elements: '요소와 속성',
      other: '기타 타입',
    },
    table: { member: '멤버', type: '타입', description: '설명' },
    notDescribed: '타입에 설명이 없습니다.',
    exported: '가져오기:',
    global: '`declare global`에 선언되어 있어 import 없이 사용할 수 있습니다.',
    typeParameters: '타입 매개변수:',
    extends: '확장:',
    references: '참조:',
    usedIn: '사용처:',
    deprecated: '더 이상 사용되지 않습니다.',
    default: '기본값:',
    see: '참고:',
  },
}
