// Brazilian Portuguese strings for scripts/generate-docs.mjs. Hand-written prose
// per component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: 'Ações',
    'Feedback and status': 'Feedback e status',
    Forms: 'Formulários',
    'Layout and structure': 'Layout e estrutura',
    'Media and visuals': 'Mídia e elementos visuais',
    Overlays: 'Sobreposições',
    'Typography and content': 'Tipografia e conteúdo',
  },
  headings: {
    bestPractices: 'Boas práticas',
    example: 'Exemplo',
    vModel: 'v-model',
    props: 'Props',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots',
  },
  table: {
    prop: 'Prop',
    type: 'Tipo',
    description: 'Descrição',
    event: 'Event',
    slot: 'Slot',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `Conteúdo de exemplo de ${name}`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` é o wrapper de Vue 3 tipado do web component \`<${tag}>\` do Shopify Polaris.`,
  title: (name, tag, plain) => `${name} (${tag}) – ${plain} do Shopify Polaris para Vue 3`,
  description: (name, summary, tag, vModel) =>
    `${name}: ${summary} Wrapper de Vue 3 tipado para <${tag}> do Shopify Polaris: props, events${vModel ? ', v-model' : ''} e slots.`,
  vModel: (name, prop, event) =>
    `\`v-model\` em \`<${name}>\` se vincula à propriedade \`${prop}\` e escuta o event DOM \`${event}\`.`,
  vModelEquivalent: 'equivale a:',
  truncatedTypes:
    '> Algumas colunas de tipo acima estão truncadas para facilitar a leitura; a união completa está disponível nos tipos TypeScript gerados da biblioteca (`src/lib/generated/types.ts`).',
  eventsHint: (event, name) => `Escute-os com listeners no estilo \`@${event}\` em \`<${name}>\`.`,
  methodsIntro: (name) =>
    `\`<${name}>\` expõe os seguintes métodos no elemento DOM subjacente (acessíveis por meio de uma template ref tipada):`,
  index: {
    title: 'Web components do Shopify Polaris para Vue 3',
    description: (count) =>
      `Explore os ${count} wrappers de Vue 3 tipados para os web components do Shopify Polaris, agrupados por categoria: ações, formulários, layout, feedback, tabelas e mais.`,
    heading: 'Componentes',
    lead: (count) =>
      `${count} wrappers de Vue tipados, um para cada web component do Polaris, agrupados como na [referência oficial da Shopify](https://shopify.dev/docs/api/app-home/polaris-web-components).`,
  },
}
