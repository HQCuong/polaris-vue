---
title: "Компоненты Shopify App Bridge для Vue 3"
description: "Типизированные компоненты Vue 3 для Shopify App Bridge: Modal, SaveBar, AppWindow, TitleBar, NavMenu, useAppBridge(). Аналог @shopify/app-bridge-react для встроенных приложений."
---

# Компоненты App Bridge для Vue

`polaris-vue-elements/app-bridge` содержит версии для Vue 3 компонентов и хука из
Shopify [`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
(версия 4.3.0). Они оборачивают элементы App Bridge, которые определяет скрипт App Bridge.
Как и остальная часть `polaris-vue-elements`, это проект сообщества, а не продукт Shopify.

| Экспорт Vue | Элемент | Справочник Shopify |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | глобальный объект `shopify` | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

Эти элементы работают только в админке Shopify, поэтому на этой странице есть примеры кода,
но нет живых демо. Сначала настройте приложение, как описано в статье
[Создание встроенного приложения Shopify](/ru/guide/shopify-embedded-app).

- [useAppBridge()](/ru/app-bridge/use-app-bridge)
- [Modal](/ru/app-bridge/modal)
- [TitleBar](/ru/app-bridge/title-bar)
- [SaveBar](/ru/app-bridge/save-bar)
- [AppWindow](/ru/app-bridge/app-window)
- [Навигация приложения](/ru/app-bridge/nav-menu)

## Установка {#install}

Скрипт App Bridge должен быть подключён на странице (см.
[шаг 1 руководства по встроенному приложению](/ru/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)).
Для типов установите пакет типов Shopify, который является необязательной peer-зависимостью
`polaris-vue-elements`:

```sh
npm install -D @shopify/app-bridge-types
```

Страница Shopify
[App Bridge web components](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
отмечает, что скрипт с CDN всегда загружает последнюю версию App Bridge, и советует: «Чтобы типы соответствовали версии, укажите `@shopify/app-bridge-types@latest` в файле package.json».

Затем импортируйте из подпути:

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

Основная точка входа `polaris-vue-elements` не импортирует этот код, поэтому приложения,
которые его не используют, его не загружают.

Компоненты создают свои элементы в render-функциях, поэтому для их использования не нужно
менять `isCustomElement`.

## Актуальные элементы App Bridge {#current-elements}

[Руководство по миграции](https://shopify.dev/docs/api/app-bridge/migration-guide) Shopify
описывает текущие web components:

- «Shopify App Bridge теперь использует web components: `<s-modal>` для встроенного содержимого и `<s-app-window>` для модальных окон с отдельными маршрутами». `<s-modal>` — это модальное окно Polaris, в этой библиотеке
  [`SModal`](/ru/components/s-modal).
- «Строки заголовка теперь настраиваются через слоты заголовка и действий компонента `<s-page>`». Это [`SPage`](/ru/components/s-page) и его слоты.
- «Навигация теперь использует web component `<s-app-nav>`». См. [Навигация приложения](/ru/app-bridge/nav-menu).

`ui-modal`, `ui-save-bar`, `ui-title-bar` и `ui-nav-menu` по-прежнему есть в
`@shopify/app-bridge-types` и `@shopify/app-bridge-react`, и компоненты на этой
странице повторяют именно их.

## Необработанные теги {#raw-tags}

Чтобы писать элементы прямо в шаблонах (`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), также считайте теги `ui-` пользовательскими элементами:

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-') || tag.startsWith('ui-'),
    },
  },
})
```

`s-app-window` и `s-app-nav` уже покрываются правилом `s-`.

Для проверки типов этих тегов добавьте необязательные типы в `tsconfig.app.json` рядом
с типами `polaris-vue-elements/elements`, если вы их используете:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

Он типизирует `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window` и
`s-app-nav`, а также атрибуты `variant`, `tone` и `loading` у `<button>` и `<a>`.
`s-page` типизируется пакетом `polaris-vue-elements/elements`.

## Типы {#types}

Подпуть реэкспортирует все типы из `@shopify/app-bridge-types`, как это делает
`@shopify/app-bridge-react`, а также `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps` и `NavMenuProps`.

`ModalProps` из `polaris-vue-elements/app-bridge` предназначен для `Modal` (`ui-modal`). Основная
точка входа тоже экспортирует `ModalProps`, для `SModal` (`s-modal`). Переименуйте один из них,
если импортируете оба:

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## Соответствие React {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (или `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| `ref` на элемент | `ref` в шаблоне, затем `.$el` |
| `children` | слот по умолчанию |
| `useAppBridge()` | `useAppBridge()` |

## FAQ {#faq}

### Нужен ли @shopify/app-bridge-react?

Нет. `polaris-vue-elements/app-bridge` не использует React. Ему нужен только скрипт App Bridge
на странице и `@shopify/app-bridge-types` для типов.

### Работает ли это вне админки Shopify?

Нет. Скрипт App Bridge связывает ваше приложение с админкой, а модальные окна,
панель сохранения (save bar) и строку заголовка отображает админка. Открывайте приложение из админки, как описано в
[руководстве по встроенному приложению](/ru/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris).

### Что использовать: Modal или SModal?

[Руководство по миграции](https://shopify.dev/docs/api/app-bridge/migration-guide) Shopify
говорит, что App Bridge «теперь использует web components: `<s-modal>` для встроенного содержимого и `<s-app-window>` для модальных окон с отдельными маршрутами». `Modal` повторяет элемент `ui-modal`,
который `@shopify/app-bridge-react` по-прежнему предоставляет.
