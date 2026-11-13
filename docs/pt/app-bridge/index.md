---
title: Componentes do App Bridge para Vue
description: Equivalentes em Vue 3 dos componentes do @shopify/app-bridge-react da Shopify — Modal, SaveBar, AppWindow, TitleBar, NavMenu e useAppBridge — a partir de polaris-vue-elements/app-bridge.
---

# Componentes do App Bridge para Vue {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge` traz equivalentes em Vue 3 dos componentes e do hook do
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react) da Shopify
(versão 4.3.0). Eles envolvem os elementos do App Bridge que o script do App Bridge define.
Como o restante do `polaris-vue-elements`, este é um projeto da comunidade, não feito pela Shopify.

| Export do Vue | Elemento | Referência da Shopify |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | o global `shopify` | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

Esses elementos só funcionam dentro do admin da Shopify, então esta página traz exemplos de
código e nenhuma demonstração ao vivo. Configure o app primeiro, como em
[Criar um app incorporado da Shopify](/pt/guide/shopify-embedded-app).

- [useAppBridge()](/pt/app-bridge/use-app-bridge)
- [Modal](/pt/app-bridge/modal)
- [TitleBar](/pt/app-bridge/title-bar)
- [SaveBar](/pt/app-bridge/save-bar)
- [AppWindow](/pt/app-bridge/app-window)
- [Navegação do app](/pt/app-bridge/nav-menu)

## Instalação {#install}

O script do App Bridge precisa estar na página (veja o
[passo 1 do guia de apps incorporados](/pt/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)).
Para os tipos, instale o pacote de tipos da Shopify, que é uma peer dependency opcional do
`polaris-vue-elements`:

```sh
npm install -D @shopify/app-bridge-types
```

A página da Shopify sobre os
[web components do App Bridge](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
observa que o script da CDN sempre carrega a versão mais recente do App Bridge e diz: "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

Depois, importe a partir do subcaminho:

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

A entrada principal do `polaris-vue-elements` não importa esse código, então os apps que não o
usam não o carregam.

Os componentes renderizam seus elementos a partir de funções de render, então nenhuma mudança em
`isCustomElement` é necessária para usá-los.

## Elementos atuais do App Bridge {#current-elements}

O [guia de migração](https://shopify.dev/docs/api/app-bridge/migration-guide) da Shopify
descreve os web components atuais:

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` é o modal do Polaris,
  [`SModal`](/pt/components/s-modal) nesta biblioteca.
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." Esse é o [`SPage`](/pt/components/s-page) e seus slots.
- "The navigation now uses the `<s-app-nav>` web component." Veja
  [Navegação do app](/pt/app-bridge/nav-menu).

`ui-modal`, `ui-save-bar`, `ui-title-bar` e `ui-nav-menu` ainda estão em
`@shopify/app-bridge-types` e `@shopify/app-bridge-react`, e os componentes desta
página os espelham.

## Tags sem wrapper {#raw-tags}

Para escrever os elementos diretamente nos templates (`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), trate também as tags `ui-` como custom elements:

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

`s-app-window` e `s-app-nav` já são cobertos por `s-`.

Para a verificação de tipos dessas tags, adicione os tipos opcionais ao `tsconfig.app.json`,
ao lado dos tipos de `polaris-vue-elements/elements`, se você os usa:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

Ele tipa `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window` e
`s-app-nav`, além dos atributos `variant`, `tone` e `loading` de `<button>` e `<a>`.
`s-page` é tipado por `polaris-vue-elements/elements`.

## Tipos {#types}

O subcaminho reexporta todos os tipos de `@shopify/app-bridge-types`, como faz o
`@shopify/app-bridge-react`, além de `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps` e `NavMenuProps`.

`ModalProps` de `polaris-vue-elements/app-bridge` é para o `Modal` (`ui-modal`). A entrada
principal também exporta um `ModalProps`, para o `SModal` (`s-modal`). Renomeie um deles quando
importar os dois:

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## Equivalências com o React {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (ou `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| `ref` para o elemento | `ref` do template e depois `.$el` |
| `children` | slot padrão |
| `useAppBridge()` | `useAppBridge()` |

## Perguntas frequentes {#faq}

### Preciso do @shopify/app-bridge-react?

Não. `polaris-vue-elements/app-bridge` não usa React. Ele só precisa do script do App Bridge na
página e do `@shopify/app-bridge-types` para os tipos.

### Funciona fora do admin da Shopify?

Não. O script do App Bridge conecta o seu app ao admin, e o admin renderiza os modais,
a barra de salvamento e a barra de título. Abra o app a partir do admin, como descrito no
[guia de apps incorporados](/pt/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris).

### Devo usar Modal ou SModal?

O [guia de migração](https://shopify.dev/docs/api/app-bridge/migration-guide) da Shopify
diz que o App Bridge "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes". `Modal` espelha o elemento `ui-modal`
que o `@shopify/app-bridge-react` ainda oferece.
