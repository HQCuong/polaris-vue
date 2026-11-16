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
  cssVariablesTip: (name, link) =>
    `Vous écrivez votre propre CSS autour de \`<${name}>\` ? Utilisez les [variables CSS](${link}) de Polaris (\`--p-space-*\`, \`--p-color-*\`, …) pour que votre mise en page corresponde aux composants.`,
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
  // docs/fr/app-bridge/types/. Shopify's descriptions on those pages stay in English.
  appBridgeTypes: {
    title: 'Types App Bridge pour Vue 3 – ShopifyGlobal',
    description:
      'Référence des types de @shopify/app-bridge-types utilisés par les composants App Bridge pour Vue 3 : ShopifyGlobal, ses API par catégorie, les attributs des éléments et un index A–Z.',
    heading: 'Types App Bridge',
    intro: (pkg, version, subpath) =>
      `Les types utilisés sur les pages App Bridge, et tous les types auxquels ils font référence, issus de ${pkg} ${version}. ${subpath} réexporte ceux que le package exporte. Les descriptions sont le JSDoc de Shopify lui-même, en anglais.`,
    pagesHeading: 'Pages',
    azIndex: 'Index A–Z',
    otherApis: 'Autres API',
    sharedTypes: 'Utilisés par plusieurs catégories',
    listSeparator: ', ',
    onThisPage: (list) => `Sur cette page : ${list}.`,
    pages: {
      'authentication-and-data': {
        title: 'Types App Bridge : authentification et données',
        description:
          "Types des API App Bridge d'authentification et de données de @shopify/app-bridge-types, pour Vue 3 : leurs membres et les types qu'elles seules utilisent.",
        lead:
          "Les API que Shopify range dans authentification et données, et les types qu'elles seules utilisent.",
      },
      'user-interface-and-interactions': {
        title: 'Types App Bridge : interface utilisateur',
        description:
          "Types des API App Bridge d'interface utilisateur et d'interactions de @shopify/app-bridge-types, pour Vue 3 : leurs membres et les types qu'elles seules utilisent.",
        lead:
          "Les API que Shopify range dans interface utilisateur et interactions, et les types qu'elles seules utilisent.",
      },
      'device-and-platform-integration': {
        title: 'Types App Bridge : appareils et plateforme',
        description:
          "Types des API App Bridge d'intégration des appareils et de la plateforme de @shopify/app-bridge-types, pour Vue 3 : leurs membres et les types qu'elles seules utilisent.",
        lead:
          "Les API que Shopify range dans intégration des appareils et de la plateforme, et les types qu'elles seules utilisent.",
      },
      elements: {
        title: 'Types App Bridge : éléments et attributs',
        description:
          "Types des interfaces d'éléments et des attributs App Bridge de @shopify/app-bridge-types, pour Vue 3 : leurs membres et les types qu'ils sont seuls à utiliser.",
        lead:
          "Les interfaces d'éléments et les types d'attributs App Bridge, et les types qu'ils sont seuls à utiliser.",
      },
      other: {
        title: 'Types App Bridge : autres API et types',
        description:
          'API App Bridge que shopify.dev ne range dans aucune catégorie, et types utilisés par plusieurs catégories, issus de @shopify/app-bridge-types pour Vue 3.',
        lead:
          'Les API que shopify.dev ne range dans aucune catégorie, et les types utilisés par plusieurs catégories.',
      },
    },
    table: { member: 'Membre', type: 'Type', description: 'Description' },
    notDescribed: 'Non décrit dans les types.',
    exported: 'Import :',
    global: 'Déclaré dans `declare global`, donc disponible sans import.',
    typeParameters: 'Paramètres de type :',
    extends: 'Étend :',
    references: 'Références :',
    usedIn: 'Utilisé dans :',
    deprecated: 'Obsolète.',
    default: 'Par défaut :',
    see: 'Voir :',
  },
}
