// German strings for scripts/generate-docs.mjs. Hand-written prose per
// component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: 'Aktionen',
    'Feedback and status': 'Feedback und Status',
    Forms: 'Formulare',
    'Layout and structure': 'Layout und Struktur',
    'Media and visuals': 'Medien und Grafik',
    Overlays: 'Overlays',
    'Typography and content': 'Typografie und Inhalt',
  },
  headings: {
    bestPractices: 'Best Practices',
    example: 'Beispiel',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: 'Typ',
    description: 'Beschreibung',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `Beispielinhalt für ${name}`,
  cssVariablesTip: (name, link) =>
    `Eigenes CSS rund um \`<${name}>\`? Nutze die Polaris-[CSS-Variablen](${link}) (\`--p-space-*\`, \`--p-color-*\`, …), damit dein Layout zu den Komponenten passt.`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` ist ein typisierter Vue-3-Wrapper für die Shopify Polaris Web Component \`<${tag}>\`.`,
  title: (name, tag, plain) => `${name} (${tag}) – Shopify Polaris ${plain} für Vue 3`,
  description: (name, summary, tag, vModel) =>
    `${name}: ${summary} Typisierter Vue-3-Wrapper für Shopify Polaris <${tag}>: Props, Events${vModel ? ', v-model' : ''} und Slots.`,
  vModel: (name, prop, event) =>
    `\`v-model\` auf \`<${name}>\` bindet die Property \`${prop}\` und lauscht auf das DOM-Event \`${event}\`.`,
  vModelEquivalent: 'entspricht:',
  truncatedTypes:
    '> Einige Typspalten oben wurden zur besseren Lesbarkeit gekürzt; die vollständigen Unions finden sich in den generierten TypeScript-Typen der Bibliothek (`src/lib/generated/types.ts`).',
  eventsHint: (event, name) => `Auf diese Events lauschen Sie mit Listenern im Stil von \`@${event}\` auf \`<${name}>\`.`,
  methodsIntro: (name) =>
    `\`<${name}>\` stellt die folgenden Methoden auf dem zugrunde liegenden DOM-Element bereit (Zugriff über ein typisiertes Template-Ref):`,
  index: {
    title: 'Shopify Polaris Web Components für Vue 3',
    description: (count) =>
      `Alle ${count} typisierten Vue-3-Wrapper für die Shopify Polaris Web Components im Überblick, nach Kategorien gruppiert: Aktionen, Formulare, Layout, Feedback, Tabellen und mehr.`,
    heading: 'Komponenten',
    lead: (count) =>
      `${count} typisierte Vue-Wrapper, einer pro Polaris Web Component, gruppiert wie in der [Referenz von Shopify](https://shopify.dev/docs/api/app-home/polaris-web-components).`,
  },
  // docs/de/app-bridge/types.md. Shopify's descriptions on that page stay in English.
  appBridgeTypes: {
    title: 'App Bridge-Typen – @shopify/app-bridge-types-Referenz für Vue 3',
    description:
      'Referenz der @shopify/app-bridge-types-Typen, die die App Bridge-Komponenten für Vue 3 verwenden: ShopifyGlobal, seine APIs, Element-Attribute und die Typen, auf die sie verweisen.',
    heading: 'App Bridge-Typen',
    intro: (pkg, version, subpath) =>
      `Die Typen, die auf den App Bridge-Seiten verwendet werden, und alle Typen, auf die sie verweisen, aus ${pkg} ${version}. ${subpath} exportiert die Typen erneut, die das Paket exportiert. Die Beschreibungen sind Shopifys eigenes JSDoc und bleiben auf Englisch.`,
    groups: {
      apis: 'ShopifyGlobal und APIs',
      elements: 'Elemente und Attribute',
      other: 'Weitere Typen',
    },
    table: { member: 'Mitglied', type: 'Typ', description: 'Beschreibung' },
    notDescribed: 'In den Typen nicht beschrieben.',
    exported: 'Import:',
    global: 'In `declare global` deklariert und daher ohne Import verfügbar.',
    typeParameters: 'Typparameter:',
    extends: 'Erweitert:',
    references: 'Verweist auf:',
    usedIn: 'Verwendet in:',
    deprecated: 'Veraltet.',
    default: 'Standard:',
    see: 'Siehe:',
  },
}
