// Hindi strings for scripts/generate-docs.mjs. Hand-written prose per
// component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: 'Actions',
    'Feedback and status': 'Feedback और status',
    Forms: 'Forms',
    'Layout and structure': 'Layout और संरचना',
    'Media and visuals': 'Media और visuals',
    Overlays: 'Overlays',
    'Typography and content': 'Typography और content',
  },
  headings: {
    bestPractices: 'Best practices',
    example: 'उदाहरण',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: 'Type',
    description: 'विवरण',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `${name} का उदाहरण content`,
  cssVariablesTip: (name, link) =>
    `\`<${name}>\` के आसपास अपना CSS लिख रहे हैं? Polaris के [CSS वेरिएबल](${link}) (\`--p-space-*\`, \`--p-color-*\`, …) इस्तेमाल करें, ताकि आपका लेआउट components से मेल खाए।`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` Shopify के Polaris \`<${tag}>\` web component का typed Vue 3 wrapper है।`,
  title: (name, tag, plain) => `${name} (${tag}) – Vue 3 के लिए Shopify Polaris ${plain}`,
  description: (name, summary, tag, vModel) =>
    `${name}: ${summary} Shopify Polaris <${tag}> के लिए typed Vue 3 wrapper — props, events${vModel ? ', v-model' : ''} और slots।`,
  vModel: (name, prop, event) =>
    `\`<${name}>\` पर \`v-model\` \`${prop}\` property से bind होता है और \`${event}\` DOM event को सुनता है।`,
  vModelEquivalent: 'इसके बराबर है:',
  truncatedTypes:
    '> पढ़ने में आसानी के लिए ऊपर के कुछ type columns छोटे किए गए हैं; पूरा union library के generate किए गए TypeScript types (`src/lib/generated/types.ts`) में उपलब्ध है।',
  eventsHint: (event, name) => `इन्हें \`<${name}>\` पर \`@${event}\` जैसे listeners से सुनें।`,
  methodsIntro: (name) =>
    `\`<${name}>\` अपने underlying DOM element पर ये methods उपलब्ध कराता है (typed template ref के ज़रिए इस्तेमाल करें):`,
  index: {
    title: 'Vue 3 के लिए Shopify Polaris web components',
    description: (count) =>
      `Shopify Polaris web components के लिए सभी ${count} typed Vue 3 wrappers देखें, category के अनुसार समूहित — actions, forms, layout, feedback, tables और भी बहुत कुछ।`,
    heading: 'Components',
    lead: (count) =>
      `${count} typed Vue wrappers, हर Polaris web component के लिए एक, उसी तरह समूहित जैसे [Shopify का अपना reference](https://shopify.dev/docs/api/app-home/polaris-web-components) उन्हें समूहित करता है।`,
  },
}
