---
title: App-Bridge-Komponenten für Vue
description: Vue 3 Gegenstücke zu den Komponenten aus @shopify/app-bridge-react von Shopify – Modal, SaveBar, AppWindow, TitleBar, NavMenu und useAppBridge aus polaris-vue-elements/app-bridge.
---

# App-Bridge-Komponenten für Vue {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge` enthält Vue 3 Gegenstücke zu den Komponenten und dem Hook aus
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
von Shopify (Version 4.3.0). Sie umhüllen die App-Bridge-Elemente, die das App-Bridge-Skript
definiert. Wie der Rest von `polaris-vue-elements` ist dies ein Community-Projekt und stammt nicht von Shopify.

| Vue-Export | Element | Shopify-Referenz |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | das globale Objekt `shopify` | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

Diese Elemente funktionieren nur im Shopify-Adminbereich, daher enthält diese Seite
Codebeispiele und keine Live-Demos. Richten Sie zuerst die App ein, wie in
[Eine eingebettete Shopify-App bauen](/de/guide/shopify-embedded-app).

- [useAppBridge()](/de/app-bridge/use-app-bridge)
- [Modal](/de/app-bridge/modal)
- [TitleBar](/de/app-bridge/title-bar)
- [SaveBar](/de/app-bridge/save-bar)
- [AppWindow](/de/app-bridge/app-window)
- [App-Navigation](/de/app-bridge/nav-menu)

## Installation {#install}

Das App-Bridge-Skript muss auf der Seite eingebunden sein (siehe
[Schritt 1 der Anleitung zu eingebetteten Apps](/de/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)).
Für die Typen installieren Sie das Typenpaket von Shopify, eine optionale Peer-Abhängigkeit von
`polaris-vue-elements`:

```sh
npm install -D @shopify/app-bridge-types
```

Die Seite zu Shopifys
[App Bridge Web Components](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
weist darauf hin, dass das CDN-Skript immer die neueste App Bridge lädt, und sagt: "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

Importieren Sie dann aus dem Subpfad:

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

Der Haupteinstieg von `polaris-vue-elements` importiert diesen Code nicht, daher wird er von Apps,
die ihn nicht verwenden, auch nicht geladen.

Die Komponenten rendern ihre Elemente aus Render-Funktionen, daher ist keine Änderung an
`isCustomElement` nötig, um sie zu verwenden.

## Aktuelle App-Bridge-Elemente {#current-elements}

Die [Migrationsanleitung](https://shopify.dev/docs/api/app-bridge/migration-guide) von Shopify
beschreibt die aktuellen Web Components:

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` ist das Polaris-Modal,
  in dieser Bibliothek [`SModal`](/de/components/s-modal).
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." Das ist [`SPage`](/de/components/s-page) mit seinen Slots.
- "The navigation now uses the `<s-app-nav>` web component." Siehe
  [App-Navigation](/de/app-bridge/nav-menu).

`ui-modal`, `ui-save-bar`, `ui-title-bar` und `ui-nav-menu` sind weiterhin in
`@shopify/app-bridge-types` und `@shopify/app-bridge-react` enthalten, und die Komponenten auf dieser
Seite bilden sie nach.

## Rohe Tags {#raw-tags}

Um die Elemente direkt in Templates zu schreiben (`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), behandle zusätzlich `ui-`-Tags als Custom Elements:

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

`s-app-window` und `s-app-nav` werden bereits durch `s-` abgedeckt.

Für die Typprüfung dieser Tags fügen Sie die optionalen Typen in `tsconfig.app.json` hinzu, neben den
Typen von `polaris-vue-elements/elements`, falls Sie sie verwenden:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

Sie typisiert `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window` und
`s-app-nav` sowie die Attribute `variant`, `tone` und `loading` von `<button>` und `<a>`.
`s-page` wird von `polaris-vue-elements/elements` typisiert.

## Typen {#types}

Der Subpfad exportiert alle Typen aus `@shopify/app-bridge-types` erneut, wie es
`@shopify/app-bridge-react` tut, sowie `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps` und `NavMenuProps`.

`ModalProps` aus `polaris-vue-elements/app-bridge` gehört zu `Modal` (`ui-modal`). Der Haupteinstieg
exportiert ebenfalls ein `ModalProps`, für `SModal` (`s-modal`). Benennen Sie eines um, wenn Sie
beide importieren:

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## Zuordnung von React {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (oder `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| `ref` auf das Element | Template-`ref`, dann `.$el` |
| `children` | Default-Slot |
| `useAppBridge()` | `useAppBridge()` |

## FAQ {#faq}

### Brauche ich @shopify/app-bridge-react?

Nein. `polaris-vue-elements/app-bridge` verwendet kein React. Es braucht nur das App-Bridge-
Skript auf der Seite und `@shopify/app-bridge-types` für die Typen.

### Funktioniert es außerhalb des Shopify-Adminbereichs?

Nein. Das App-Bridge-Skript verbindet Ihre App mit dem Adminbereich, und der Adminbereich rendert Modals,
die Save Bar und die Titelleiste. Öffnen Sie die App aus dem Adminbereich, wie in der
[Anleitung zu eingebetteten Apps](/de/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris) beschrieben.

### Sollte ich Modal oder SModal verwenden?

Shopifys [Migrationsanleitung](https://shopify.dev/docs/api/app-bridge/migration-guide)
sagt, dass App Bridge "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes". `Modal` bildet das Element `ui-modal` nach,
das `@shopify/app-bridge-react` weiterhin bereitstellt.
