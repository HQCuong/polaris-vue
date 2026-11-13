---
title: Componentes de App Bridge para Vue
description: Equivalentes en Vue 3 de los componentes de @shopify/app-bridge-react de Shopify — Modal, SaveBar, AppWindow, TitleBar, NavMenu y useAppBridge — desde polaris-vue-elements/app-bridge.
---

# Componentes de App Bridge para Vue {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge` incluye equivalentes en Vue 3 de los componentes y del hook de
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react) de Shopify
(versión 4.3.0). Envuelven los elementos de App Bridge que define el script de App Bridge.
Como el resto de `polaris-vue-elements`, es un proyecto de la comunidad, no creado por Shopify.

| Export de Vue | Elemento | Referencia de Shopify |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | el global `shopify` | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

Estos elementos solo funcionan dentro del admin de Shopify, así que esta página tiene ejemplos de
código y no demos en vivo. Configura primero la app, como en
[Crear una app integrada de Shopify](/es/guide/shopify-embedded-app).

- [useAppBridge()](/es/app-bridge/use-app-bridge)
- [Modal](/es/app-bridge/modal)
- [TitleBar](/es/app-bridge/title-bar)
- [SaveBar](/es/app-bridge/save-bar)
- [AppWindow](/es/app-bridge/app-window)
- [Navegación de la app](/es/app-bridge/nav-menu)

## Instalación {#install}

El script de App Bridge debe estar en la página (consulta el
[paso 1 de la guía de apps integradas](/es/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)).
Para los tipos, instala el paquete de tipos de Shopify, que es una peer dependency opcional de
`polaris-vue-elements`:

```sh
npm install -D @shopify/app-bridge-types
```

La página de Shopify sobre los
[web components de App Bridge](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
indica que el script de la CDN siempre carga la última versión de App Bridge, y dice: "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

Después importa desde la subruta:

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

La entrada principal de `polaris-vue-elements` no importa este código, así que las apps que no lo
usan no lo cargan.

Los componentes renderizan sus elementos desde funciones de render, por lo que no hace falta
ningún cambio en `isCustomElement` para usarlos.

## Elementos actuales de App Bridge {#current-elements}

La [guía de migración](https://shopify.dev/docs/api/app-bridge/migration-guide) de Shopify
describe los web components actuales:

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` es el modal de Polaris,
  [`SModal`](/es/components/s-modal) en esta biblioteca.
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." Es decir, [`SPage`](/es/components/s-page) y sus slots.
- "The navigation now uses the `<s-app-nav>` web component." Consulta
  [Navegación de la app](/es/app-bridge/nav-menu).

`ui-modal`, `ui-save-bar`, `ui-title-bar` y `ui-nav-menu` siguen estando en
`@shopify/app-bridge-types` y `@shopify/app-bridge-react`, y los componentes de esta
página los reflejan.

## Etiquetas sin wrapper {#raw-tags}

Para escribir los elementos directamente en las plantillas (`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), trata también las etiquetas `ui-` como custom elements:

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

`s-app-window` y `s-app-nav` ya quedan cubiertos por `s-`.

Para la comprobación de tipos de esas etiquetas, añade los tipos opcionales a `tsconfig.app.json`,
junto a los tipos de `polaris-vue-elements/elements` si los usas:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

Tipa `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window` y
`s-app-nav`, y los atributos `variant`, `tone` y `loading` de `<button>` y `<a>`.
`s-page` está tipado por `polaris-vue-elements/elements`.

## Tipos {#types}

La subruta reexporta todos los tipos de `@shopify/app-bridge-types`, como hace
`@shopify/app-bridge-react`, además de `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps` y `NavMenuProps`.

`ModalProps` de `polaris-vue-elements/app-bridge` es para `Modal` (`ui-modal`). La entrada
principal también exporta un `ModalProps`, para `SModal` (`s-modal`). Renombra uno cuando importes
ambos:

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## Equivalencias con React {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (o `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| `ref` al elemento | `ref` de la plantilla y luego `.$el` |
| `children` | slot por defecto |
| `useAppBridge()` | `useAppBridge()` |

## Preguntas frecuentes {#faq}

### ¿Necesito @shopify/app-bridge-react?

No. `polaris-vue-elements/app-bridge` no usa React. Solo necesita el script de App Bridge en la
página y `@shopify/app-bridge-types` para los tipos.

### ¿Funciona fuera del admin de Shopify?

No. El script de App Bridge conecta tu app con el admin, y el admin renderiza los modales,
la barra de guardado y la barra de título. Abre la app desde el admin, como se describe en la
[guía de apps integradas](/es/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris).

### ¿Debo usar Modal o SModal?

La [guía de migración](https://shopify.dev/docs/api/app-bridge/migration-guide) de Shopify
dice que App Bridge "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes". `Modal` refleja el elemento `ui-modal`
que `@shopify/app-bridge-react` sigue ofreciendo.
