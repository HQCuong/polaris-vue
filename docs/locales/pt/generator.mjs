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
  cssVariablesTip: (name, link) =>
    `Escrevendo seu próprio CSS em volta de \`<${name}>\`? Use as [variáveis CSS](${link}) do Polaris (\`--p-space-*\`, \`--p-color-*\`, …) para que seu layout combine com os componentes.`,
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
  // docs/pt/app-bridge/types/. Shopify's descriptions on those pages stay in English.
  appBridgeTypes: {
    title: 'Tipos do App Bridge para Vue 3 – ShopifyGlobal',
    description:
      'Referência dos tipos de @shopify/app-bridge-types usados pelos componentes do App Bridge para Vue 3: ShopifyGlobal, suas APIs por categoria, atributos dos elementos e um índice A–Z.',
    heading: 'Tipos do App Bridge',
    intro: (pkg, version, subpath) =>
      `Os tipos usados nas páginas do App Bridge, e todos os tipos a que eles fazem referência, de ${pkg} ${version}. ${subpath} reexporta os que o pacote exporta. As descrições são o próprio JSDoc da Shopify, em inglês.`,
    pagesHeading: 'Páginas',
    azIndex: 'Índice A–Z',
    otherApis: 'Outras APIs',
    sharedTypes: 'Usados em várias categorias',
    listSeparator: ', ',
    onThisPage: (list) => `Nesta página: ${list}.`,
    pages: {
      'authentication-and-data': {
        title: 'Tipos do App Bridge: autenticação e dados',
        description:
          'Tipos das APIs de autenticação e dados do App Bridge em @shopify/app-bridge-types, para Vue 3: seus membros e os tipos que só elas usam.',
        lead: 'As APIs que a Shopify agrupa em autenticação e dados, e os tipos que só elas usam.',
      },
      'user-interface-and-interactions': {
        title: 'Tipos do App Bridge: interface do usuário',
        description:
          'Tipos das APIs de interface do usuário e interações do App Bridge em @shopify/app-bridge-types, para Vue 3: seus membros e os tipos que só elas usam.',
        lead:
          'As APIs que a Shopify agrupa em interface do usuário e interações, e os tipos que só elas usam.',
      },
      'device-and-platform-integration': {
        title: 'Tipos do App Bridge: dispositivos e plataforma',
        description:
          'Tipos das APIs de integração com dispositivos e plataformas do App Bridge em @shopify/app-bridge-types, para Vue 3: seus membros e os tipos que só elas usam.',
        lead:
          'As APIs que a Shopify agrupa em integração com dispositivos e plataformas, e os tipos que só elas usam.',
      },
      elements: {
        title: 'Tipos do App Bridge: elementos e atributos',
        description:
          'Tipos das interfaces de elementos e dos atributos do App Bridge em @shopify/app-bridge-types, para Vue 3: seus membros e os tipos que só eles usam.',
        lead:
          'As interfaces de elementos e os tipos de atributos do App Bridge, e os tipos que só eles usam.',
      },
      other: {
        title: 'Tipos do App Bridge: outras APIs e tipos',
        description:
          'APIs do App Bridge que o shopify.dev não inclui em nenhuma categoria e tipos usados em várias categorias, de @shopify/app-bridge-types para Vue 3.',
        lead:
          'As APIs que o shopify.dev não inclui em nenhuma categoria, e os tipos usados por mais de uma categoria.',
      },
    },
    table: { member: 'Membro', type: 'Tipo', description: 'Descrição' },
    notDescribed: 'Não descrito nos tipos.',
    exported: 'Importação:',
    global: 'Declarado em `declare global`, por isso está disponível sem importação.',
    typeParameters: 'Parâmetros de tipo:',
    extends: 'Estende:',
    references: 'Referências:',
    usedIn: 'Usado em:',
    deprecated: 'Obsoleto.',
    default: 'Padrão:',
    see: 'Veja:',
  },
}
