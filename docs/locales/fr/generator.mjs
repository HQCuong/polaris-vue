// French strings for scripts/generate-docs.mjs. Hand-written prose per
// component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: 'Actions',
    'Feedback and status': 'Retours et statut',
    Forms: 'Formulaires',
    'Layout and structure': 'Mise en page et structure',
    'Media and visuals': 'Médias et visuels',
    Overlays: 'Superpositions',
    'Typography and content': 'Typographie et contenu',
  },
  headings: {
    bestPractices: 'Bonnes pratiques',
    example: 'Exemple',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: 'Type',
    description: 'Description',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `Contenu d'exemple pour ${name}`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` est le wrapper Vue 3 typé du web component \`<${tag}>\` de Shopify Polaris.`,
  title: (name, tag, plain) => `${name} (${tag}) – ${plain} Shopify Polaris pour Vue 3`,
  description: (name, summary, tag, vModel) =>
    `${name} : ${summary} Wrapper Vue 3 typé pour <${tag}> de Shopify Polaris : props, events${vModel ? ', v-model' : ''} et slots.`,
  vModel: (name, prop, event) =>
    `\`v-model\` sur \`<${name}>\` est lié à la propriété \`${prop}\` et écoute l'event DOM \`${event}\`.`,
  vModelEquivalent: 'équivaut à :',
  truncatedTypes:
    "> Certaines colonnes de type ci-dessus sont tronquées pour plus de lisibilité ; l'union complète est disponible dans les types TypeScript générés de la bibliothèque (`src/lib/generated/types.ts`).",
  eventsHint: (event, name) => `Écoutez-les avec des listeners de la forme \`@${event}\` sur \`<${name}>\`.`,
  methodsIntro: (name) =>
    `\`<${name}>\` expose les méthodes suivantes sur son élément DOM sous-jacent (accessibles via une template ref typée) :`,
  index: {
    title: 'Web components Shopify Polaris pour Vue 3',
    description: (count) =>
      `Parcourez les ${count} wrappers Vue 3 typés pour les web components Shopify Polaris, classés par catégorie : actions, formulaires, mise en page, retours, tableaux et plus encore.`,
    heading: 'Composants',
    lead: (count) =>
      `${count} wrappers Vue typés, un par web component Polaris, classés comme dans [la référence officielle de Shopify](https://shopify.dev/docs/api/app-home/polaris-web-components).`,
  },
}
