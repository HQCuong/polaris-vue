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
}
