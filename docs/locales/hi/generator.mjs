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
    bestPractices: 'सर्वोत्तम अभ्यास',
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
  // docs/hi/app-bridge/types/. Shopify's descriptions on those pages stay in English.
  appBridgeTypes: {
    title: 'Vue 3 के लिए App Bridge types – ShopifyGlobal',
    description:
      'Vue 3 के App Bridge components जिन @shopify/app-bridge-types types का इस्तेमाल करते हैं, उनका reference: ShopifyGlobal, category के हिसाब से उसके APIs, element attributes और A–Z index।',
    heading: 'App Bridge types',
    intro: (pkg, version, subpath) =>
      `App Bridge pages पर इस्तेमाल होने वाले types, और वे सभी types जिन्हें ये reference करते हैं, ${pkg} ${version} से लिए गए हैं। ${subpath} उन types को re-export करता है जिन्हें package export करता है। विवरण Shopify का अपना JSDoc हैं, अंग्रेज़ी में।`,
    pagesHeading: 'Pages',
    azIndex: 'A–Z index',
    otherApis: 'अन्य APIs',
    sharedTypes: 'कई categories में इस्तेमाल',
    listSeparator: ', ',
    onThisPage: (list) => `इस page पर: ${list}।`,
    pages: {
      'authentication-and-data': {
        title: 'App Bridge types: authentication और data',
        description:
          'Vue 3 के लिए @shopify/app-bridge-types में App Bridge के authentication और data APIs के types: उनके members और वे types जिन्हें सिर्फ़ ये इस्तेमाल करते हैं।',
        lead:
          'वे APIs जिन्हें Shopify authentication और data में रखता है, और वे types जिन्हें सिर्फ़ ये इस्तेमाल करते हैं।',
      },
      'user-interface-and-interactions': {
        title: 'App Bridge types: user interface APIs',
        description:
          'Vue 3 के लिए @shopify/app-bridge-types में App Bridge के user interface और interactions APIs के types: उनके members और वे types जिन्हें सिर्फ़ ये इस्तेमाल करते हैं।',
        lead:
          'वे APIs जिन्हें Shopify user interface और interactions में रखता है, और वे types जिन्हें सिर्फ़ ये इस्तेमाल करते हैं।',
      },
      'device-and-platform-integration': {
        title: 'App Bridge types: device और platform APIs',
        description:
          'Vue 3 के लिए @shopify/app-bridge-types में App Bridge के device और platform integration APIs के types: उनके members और वे types जिन्हें सिर्फ़ ये इस्तेमाल करते हैं।',
        lead:
          'वे APIs जिन्हें Shopify device और platform integration में रखता है, और वे types जिन्हें सिर्फ़ ये इस्तेमाल करते हैं।',
      },
      elements: {
        title: 'App Bridge types: elements और attributes',
        description:
          'Vue 3 के लिए @shopify/app-bridge-types में App Bridge के element interfaces और attributes के types: उनके members और वे types जिन्हें सिर्फ़ ये इस्तेमाल करते हैं।',
        lead:
          'App Bridge के element interfaces और attribute types, और वे types जिन्हें सिर्फ़ ये इस्तेमाल करते हैं।',
      },
      other: {
        title: 'App Bridge types: अन्य APIs और types',
        description:
          'Vue 3 के लिए @shopify/app-bridge-types के वे App Bridge APIs जिन्हें shopify.dev किसी category में नहीं रखता, और कई categories में इस्तेमाल होने वाले types।',
        lead:
          'वे APIs जिन्हें shopify.dev किसी category में नहीं रखता, और वे types जिन्हें एक से ज़्यादा category इस्तेमाल करती है।',
      },
    },
    table: { member: 'Member', type: 'Type', description: 'विवरण' },
    notDescribed: 'Types में इसका विवरण नहीं है।',
    exported: 'Import:',
    global: 'यह `declare global` में declare किया गया है, इसलिए import के बिना उपलब्ध है।',
    typeParameters: 'Type parameters:',
    extends: 'Extends:',
    references: 'References:',
    usedIn: 'इनमें इस्तेमाल:',
    deprecated: 'Deprecated।',
    default: 'Default:',
    see: 'देखें:',
  },
}
