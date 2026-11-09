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
}
