// Russian strings for scripts/generate-docs.mjs. Hand-written prose per
// component lives next to this file: summaries.json, manifest.json (Shopify's
// prop and slot descriptions, keyed by the English text) and best-practices/.

export default {
  categories: {
    Actions: 'Действия',
    'Feedback and status': 'Обратная связь и статус',
    Forms: 'Формы',
    'Layout and structure': 'Макет и структура',
    'Media and visuals': 'Медиа и визуальные элементы',
    Overlays: 'Оверлеи',
    'Typography and content': 'Типографика и контент',
  },
  headings: {
    bestPractices: 'Рекомендации',
    example: 'Пример',
    vModel: 'v-model',
    props: 'Пропсы',
    events: 'События',
    methods: 'Методы',
    slots: 'Слоты',
  },
  table: {
    prop: 'Проп',
    type: 'Тип',
    description: 'Описание',
    event: 'Событие',
    slot: 'Слот',
  },
  defaultSlot: 'default',
  exampleContent: (name) => `Пример содержимого ${name}`,
  cssVariablesTip: (name, link) =>
    `Пишете собственный CSS вокруг \`<${name}>\`? Используйте [CSS-переменные](${link}) Polaris (\`--p-space-*\`, \`--p-color-*\`, …), чтобы ваш макет соответствовал компонентам.`,
  intro: (summary, name, tag) =>
    `${summary} \`${name}\` — типизированная обёртка Vue 3 для веб-компонента \`<${tag}>\` из Shopify Polaris.`,
  title: (name, tag, plain) => `${name} (${tag}) – ${plain} из Shopify Polaris для Vue 3`,
  description: (name, summary, tag, vModel) =>
    `${name}: ${summary} Типизированная обёртка Vue 3 для <${tag}> из Shopify Polaris: пропсы, события${vModel ? ', v-model' : ''} и слоты.`,
  vModel: (name, prop, event) =>
    `\`v-model\` на \`<${name}>\` привязывается к свойству \`${prop}\` и слушает DOM-событие \`${event}\`.`,
  vModelEquivalent: 'эквивалентно:',
  truncatedTypes:
    '> Некоторые столбцы с типами выше сокращены для удобства чтения; полное объединение типов доступно в сгенерированных TypeScript-типах библиотеки (`src/lib/generated/types.ts`).',
  eventsHint: (event, name) => `Подписывайтесь на них слушателями вида \`@${event}\` на \`<${name}>\`.`,
  methodsIntro: (name) =>
    `\`<${name}>\` предоставляет следующие методы на своём базовом DOM-элементе (доступны через типизированный template ref):`,
  index: {
    title: 'Веб-компоненты Shopify Polaris для Vue 3',
    description: (count) =>
      `Все типизированные обёртки Vue 3 (${count}) для веб-компонентов Shopify Polaris, сгруппированные по категориям: действия, формы, макет, обратная связь, таблицы и другие.`,
    heading: 'Компоненты',
    lead: (count) =>
      `Типизированных обёрток Vue: ${count}, по одной на каждый веб-компонент Polaris. Они сгруппированы так же, как в [официальном справочнике Shopify](https://shopify.dev/docs/api/app-home/polaris-web-components).`,
  },
  // docs/ru/app-bridge/types/. Shopify's descriptions on those pages stay in English.
  appBridgeTypes: {
    title: 'Типы App Bridge для Vue 3 – ShopifyGlobal',
    description:
      'Справочник по типам из @shopify/app-bridge-types, которые используют компоненты App Bridge для Vue 3: ShopifyGlobal, его API по категориям, атрибуты элементов и указатель A–Z.',
    heading: 'Типы App Bridge',
    intro: (pkg, version, subpath) =>
      `Типы, используемые на страницах App Bridge, и все типы, на которые они ссылаются, из ${pkg} ${version}. ${subpath} реэкспортирует те из них, которые экспортирует пакет. Описания — это оригинальный JSDoc от Shopify на английском.`,
    pagesHeading: 'Страницы',
    azIndex: 'Указатель A–Z',
    otherApis: 'Другие API',
    sharedTypes: 'Используются в нескольких категориях',
    listSeparator: ', ',
    onThisPage: (list) => `На этой странице: ${list}.`,
    pages: {
      'authentication-and-data': {
        title: 'Типы App Bridge: аутентификация и данные',
        description:
          'Типы API аутентификации и данных App Bridge из @shopify/app-bridge-types для Vue 3: их члены и типы, которые использует только они.',
        lead:
          'API, которые Shopify относит к аутентификации и данным, и типы, которые использует только они.',
      },
      'user-interface-and-interactions': {
        title: 'Типы App Bridge: пользовательский интерфейс',
        description:
          'Типы API пользовательского интерфейса и взаимодействий App Bridge из @shopify/app-bridge-types для Vue 3: их члены и типы, которые использует только они.',
        lead:
          'API, которые Shopify относит к пользовательскому интерфейсу и взаимодействиям, и типы, которые использует только они.',
      },
      'device-and-platform-integration': {
        title: 'Типы App Bridge: устройства и платформы',
        description:
          'Типы API интеграции с устройствами и платформами App Bridge из @shopify/app-bridge-types для Vue 3: их члены и типы, которые использует только они.',
        lead:
          'API, которые Shopify относит к интеграции с устройствами и платформами, и типы, которые использует только они.',
      },
      elements: {
        title: 'Типы App Bridge: элементы и атрибуты',
        description:
          'Типы интерфейсов элементов и атрибутов App Bridge из @shopify/app-bridge-types для Vue 3: их члены и типы, которые использует только они.',
        lead:
          'Интерфейсы элементов и типы атрибутов App Bridge, а также типы, которые использует только они.',
      },
      other: {
        title: 'Типы App Bridge: другие API и типы',
        description:
          'API App Bridge, которые shopify.dev не относит ни к одной категории, и типы, используемые в нескольких категориях, из @shopify/app-bridge-types для Vue 3.',
        lead:
          'API, которые shopify.dev не относит ни к одной категории, и типы, которые используются более чем в одной категории.',
      },
    },
    table: { member: 'Член', type: 'Тип', description: 'Описание' },
    notDescribed: 'В типах не описано.',
    exported: 'Импорт:',
    global: 'Объявлен в `declare global`, поэтому доступен без импорта.',
    typeParameters: 'Параметры типа:',
    extends: 'Расширяет:',
    references: 'Ссылки на:',
    usedIn: 'Используется в:',
    deprecated: 'Устарел.',
    default: 'По умолчанию:',
    see: 'См.:',
  },
}
