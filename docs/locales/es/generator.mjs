// Spanish strings for scripts/generate-docs.mjs. Hand-written prose per
// component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: 'Acciones',
    'Feedback and status': 'Avisos y estado',
    Forms: 'Formularios',
    'Layout and structure': 'Diseño y estructura',
    'Media and visuals': 'Multimedia y elementos visuales',
    Overlays: 'Superposiciones',
    'Typography and content': 'Tipografía y contenido',
  },
  headings: {
    bestPractices: 'Buenas prácticas',
    example: 'Ejemplo',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: 'Tipo',
    description: 'Descripción',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `Contenido de ejemplo de ${name}`,
  cssVariablesTip: (name, link) =>
    `¿Escribes tu propio CSS alrededor de \`<${name}>\`? Usa las [variables CSS](${link}) de Polaris (\`--p-space-*\`, \`--p-color-*\`, …) para que tu diseño coincida con los componentes.`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` es el wrapper de Vue 3 tipado del web component \`<${tag}>\` de Shopify Polaris.`,
  title: (name, tag, plain) => `${name} (${tag}) – ${plain} de Shopify Polaris para Vue 3`,
  description: (name, summary, tag, vModel) =>
    `${name}: ${summary} Wrapper de Vue 3 tipado para <${tag}> de Shopify Polaris: props, events${vModel ? ', v-model' : ''} y slots.`,
  vModel: (name, prop, event) =>
    `\`v-model\` en \`<${name}>\` se vincula a la propiedad \`${prop}\` y escucha el event DOM \`${event}\`.`,
  vModelEquivalent: 'equivale a:',
  truncatedTypes:
    '> Algunas columnas de tipo de arriba están truncadas para facilitar la lectura; la unión completa está disponible en los tipos de TypeScript generados de la biblioteca (`src/lib/generated/types.ts`).',
  eventsHint: (event, name) => `Escúchalos con listeners del estilo \`@${event}\` en \`<${name}>\`.`,
  methodsIntro: (name) =>
    `\`<${name}>\` expone los siguientes métodos en su elemento DOM subyacente (accesibles mediante una template ref tipada):`,
  index: {
    title: 'Web components de Shopify Polaris para Vue 3',
    description: (count) =>
      `Explora los ${count} wrappers de Vue 3 tipados para los web components de Shopify Polaris, agrupados por categoría: acciones, formularios, diseño, avisos, tablas y más.`,
    heading: 'Componentes',
    lead: (count) =>
      `${count} wrappers de Vue tipados, uno por cada web component de Polaris, agrupados igual que en [la referencia oficial de Shopify](https://shopify.dev/docs/api/app-home/polaris-web-components).`,
  },
  // docs/es/app-bridge/types/. Shopify's descriptions on those pages stay in English.
  appBridgeTypes: {
    title: 'Tipos de App Bridge para Vue 3 – ShopifyGlobal',
    description:
      'Referencia de los tipos de @shopify/app-bridge-types que usan los componentes de App Bridge para Vue 3: ShopifyGlobal, sus API por categoría, atributos de elementos e índice A–Z.',
    heading: 'Tipos de App Bridge',
    intro: (pkg, version, subpath) =>
      `Los tipos que se usan en las páginas de App Bridge, y todos los tipos a los que hacen referencia, de ${pkg} ${version}. ${subpath} reexporta los que exporta el paquete. Las descripciones son el propio JSDoc de Shopify, en inglés.`,
    pagesHeading: 'Páginas',
    azIndex: 'Índice A–Z',
    otherApis: 'Otras API',
    sharedTypes: 'Usados en varias categorías',
    listSeparator: ', ',
    onThisPage: (list) => `En esta página: ${list}.`,
    pages: {
      'authentication-and-data': {
        title: 'Tipos de App Bridge: autenticación y datos',
        description:
          'Tipos de las API de autenticación y datos de App Bridge en @shopify/app-bridge-types, para Vue 3: sus miembros y los tipos que solo usan ellas.',
        lead:
          'Las API que Shopify agrupa en autenticación y datos, y los tipos que solo usan ellas.',
      },
      'user-interface-and-interactions': {
        title: 'Tipos de App Bridge: interfaz de usuario',
        description:
          'Tipos de las API de interfaz de usuario e interacciones de App Bridge en @shopify/app-bridge-types, para Vue 3: sus miembros y los tipos que solo usan ellas.',
        lead:
          'Las API que Shopify agrupa en interfaz de usuario e interacciones, y los tipos que solo usan ellas.',
      },
      'device-and-platform-integration': {
        title: 'Tipos de App Bridge: dispositivos y plataforma',
        description:
          'Tipos de las API de integración con dispositivos y plataformas de App Bridge en @shopify/app-bridge-types, para Vue 3: sus miembros y los tipos que solo usan ellas.',
        lead:
          'Las API que Shopify agrupa en integración con dispositivos y plataformas, y los tipos que solo usan ellas.',
      },
      elements: {
        title: 'Tipos de App Bridge: elementos y atributos',
        description:
          'Tipos de las interfaces de elementos y los atributos de App Bridge en @shopify/app-bridge-types, para Vue 3: sus miembros y los tipos que solo usan ellos.',
        lead:
          'Las interfaces de elementos y los tipos de atributos de App Bridge, y los tipos que solo usan ellos.',
      },
      other: {
        title: 'Tipos de App Bridge: otras API y tipos',
        description:
          'API de App Bridge que shopify.dev no incluye en ninguna categoría y tipos usados en varias categorías, de @shopify/app-bridge-types para Vue 3.',
        lead:
          'Las API que shopify.dev no incluye en ninguna categoría, y los tipos que usa más de una categoría.',
      },
    },
    table: { member: 'Miembro', type: 'Tipo', description: 'Descripción' },
    notDescribed: 'No se describe en los tipos.',
    exported: 'Importación:',
    global: 'Se declara en `declare global`, así que está disponible sin importarlo.',
    typeParameters: 'Parámetros de tipo:',
    extends: 'Extiende:',
    references: 'Referencias:',
    usedIn: 'Se usa en:',
    deprecated: 'Obsoleto.',
    default: 'Por defecto:',
    see: 'Ver:',
  },
}
