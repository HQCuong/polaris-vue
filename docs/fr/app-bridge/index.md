---
title: Composants App Bridge pour Vue
description: Équivalents Vue 3 des composants @shopify/app-bridge-react de Shopify — Modal, SaveBar, AppWindow, TitleBar, NavMenu et useAppBridge, depuis polaris-vue-elements/app-bridge.
---

# Composants App Bridge pour Vue {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge` propose des équivalents Vue 3 des composants et du hook de
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
de Shopify (version 4.3.0). Ils encapsulent les éléments App Bridge que le script App Bridge définit.
Comme le reste de `polaris-vue-elements`, c'est un projet communautaire, non réalisé par Shopify.

| Export Vue | Élément | Référence Shopify |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | l'objet global `shopify` | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

Ces éléments ne fonctionnent que dans l'interface d'administration Shopify ; cette page contient donc des exemples
de code et aucune démo en direct. Configurez d'abord l'app, comme dans
[Créer une app Shopify intégrée](/fr/guide/shopify-embedded-app).

- [useAppBridge()](/fr/app-bridge/use-app-bridge)
- [Modal](/fr/app-bridge/modal)
- [TitleBar](/fr/app-bridge/title-bar)
- [SaveBar](/fr/app-bridge/save-bar)
- [AppWindow](/fr/app-bridge/app-window)
- [Navigation de l'app](/fr/app-bridge/nav-menu)

## Installation {#install}

Le script App Bridge doit être présent sur la page (voir
[l'étape 1 du guide de l'app intégrée](/fr/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)).
Pour les types, installez le paquet de types de Shopify, une peer dependency optionnelle de
`polaris-vue-elements` :

```sh
npm install -D @shopify/app-bridge-types
```

La page de Shopify sur les
[web components App Bridge](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
indique que le script CDN charge toujours la dernière version d'App Bridge, et précise : "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

Importez ensuite depuis le sous-chemin :

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

Le point d'entrée principal de `polaris-vue-elements` n'importe pas ce code ; les apps qui ne
l'utilisent pas ne le chargent donc pas.

Les composants génèrent leurs éléments depuis des fonctions de rendu, aucune modification de
`isCustomElement` n'est donc nécessaire pour les utiliser.

## Éléments App Bridge actuels {#current-elements}

Le [guide de migration](https://shopify.dev/docs/api/app-bridge/migration-guide) de Shopify
décrit les web components actuels :

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` est le modal Polaris,
  [`SModal`](/fr/components/s-modal) dans cette bibliothèque.
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." Il s'agit de [`SPage`](/fr/components/s-page) et de ses slots.
- "The navigation now uses the `<s-app-nav>` web component." Voir
  [Navigation de l'app](/fr/app-bridge/nav-menu).

`ui-modal`, `ui-save-bar`, `ui-title-bar` et `ui-nav-menu` figurent toujours dans
`@shopify/app-bridge-types` et `@shopify/app-bridge-react`, et les composants de cette
page en sont le reflet.

## Balises brutes {#raw-tags}

Pour écrire les éléments directement dans les templates (`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), traitez aussi les balises `ui-` comme des custom elements :

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

`s-app-window` et `s-app-nav` sont déjà couverts par `s-`.

Pour le contrôle de types de ces balises, ajoutez les types optionnels à `tsconfig.app.json`, à côté des
types `polaris-vue-elements/elements` si vous les utilisez :

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

Il type `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window` et
`s-app-nav`, ainsi que les attributs `variant`, `tone` et `loading` de `<button>` et `<a>`.
`s-page` est typé par `polaris-vue-elements/elements`.

## Types {#types}

Le sous-chemin réexporte tous les types de `@shopify/app-bridge-types`, comme le fait
`@shopify/app-bridge-react`, ainsi que `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps` et `NavMenuProps`.

`ModalProps` de `polaris-vue-elements/app-bridge` est destiné à `Modal` (`ui-modal`). Le point d'entrée
principal exporte aussi un `ModalProps`, pour `SModal` (`s-modal`). Renommez l'un des deux quand vous
importez les deux :

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## Correspondance avec React {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (ou `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| `ref` vers l'élément | `ref` du template, puis `.$el` |
| `children` | slot par défaut |
| `useAppBridge()` | `useAppBridge()` |

## FAQ {#faq}

### Ai-je besoin de @shopify/app-bridge-react ?

Non. `polaris-vue-elements/app-bridge` n'utilise pas React. Il a seulement besoin du script App Bridge
sur la page, et de `@shopify/app-bridge-types` pour les types.

### Est-ce que cela fonctionne en dehors de l'interface d'administration Shopify ?

Non. Le script App Bridge relie votre app à l'interface d'administration, et c'est elle qui rend les modals,
la save bar et la barre de titre. Ouvrez l'app depuis l'interface d'administration, comme décrit dans le
[guide de l'app intégrée](/fr/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris).

### Dois-je utiliser Modal ou SModal ?

Le [guide de migration](https://shopify.dev/docs/api/app-bridge/migration-guide) de Shopify
indique qu'App Bridge "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes". `Modal` reflète l'élément `ui-modal`
que `@shopify/app-bridge-react` fournit toujours.
