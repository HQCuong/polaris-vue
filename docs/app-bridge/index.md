---
title: App Bridge components for Vue
description: Vue 3 counterparts of Shopify's @shopify/app-bridge-react components — Modal, SaveBar, AppWindow, TitleBar, NavMenu and useAppBridge — from polaris-vue-elements/app-bridge.
---

# App Bridge components for Vue

`polaris-vue-elements/app-bridge` has Vue 3 counterparts of the components and hook in
Shopify's [`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
(version 4.3.0). They wrap the App Bridge elements that the App Bridge script defines.
Like the rest of `polaris-vue-elements`, this is a community project, not made by Shopify.

| Vue export | Element | Shopify reference |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | the `shopify` global | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

These elements only work inside the Shopify admin, so this page has code examples and
no live demos. Set up the app first, as in
[Build a Shopify embedded app](/guide/shopify-embedded-app).

- [useAppBridge()](/app-bridge/use-app-bridge)
- [Modal](/app-bridge/modal)
- [TitleBar](/app-bridge/title-bar)
- [SaveBar](/app-bridge/save-bar)
- [AppWindow](/app-bridge/app-window)
- [App navigation](/app-bridge/nav-menu)

## Install {#install}

The App Bridge script must be on the page (see
[step 1 of the embedded-app guide](/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)).
For types, install Shopify's types package, which is an optional peer dependency of
`polaris-vue-elements`:

```sh
npm install -D @shopify/app-bridge-types
```

Shopify's
[App Bridge web components](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
page notes that the CDN script always loads the latest App Bridge, and says: "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

Then import from the subpath:

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

The main `polaris-vue-elements` entry does not import this code, so apps that do not
use it do not load it.

The components render their elements from render functions, so no `isCustomElement`
change is needed to use them.

## Current App Bridge elements {#current-elements}

Shopify's [migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide)
describes the current web components:

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` is the Polaris modal,
  [`SModal`](/components/s-modal) in this library.
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." That is [`SPage`](/components/s-page) and its slots.
- "The navigation now uses the `<s-app-nav>` web component." See
  [App navigation](/app-bridge/nav-menu).

`ui-modal`, `ui-save-bar`, `ui-title-bar` and `ui-nav-menu` are still in
`@shopify/app-bridge-types` and `@shopify/app-bridge-react`, and the components on this
page mirror those.

## Raw tags {#raw-tags}

To write the elements directly in templates (`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), also treat `ui-` tags as custom elements:

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

`s-app-window` and `s-app-nav` are already covered by `s-`.

For type checking of those tags, add the opt-in types to `tsconfig.app.json`, next to
the `polaris-vue-elements/elements` types if you use them:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

It types `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window` and
`s-app-nav`, and the `variant`, `tone` and `loading` attributes of `<button>` and `<a>`.
`s-page` is typed by `polaris-vue-elements/elements`.

## Types {#types}

The subpath re-exports every type from `@shopify/app-bridge-types`, as
`@shopify/app-bridge-react` does, plus `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps` and `NavMenuProps`.

`ModalProps` from `polaris-vue-elements/app-bridge` is for `Modal` (`ui-modal`). The main
entry also exports a `ModalProps`, for `SModal` (`s-modal`). Rename one when you import
both:

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## Mapping from React {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (or `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| `ref` to the element | template `ref`, then `.$el` |
| `children` | default slot |
| `useAppBridge()` | `useAppBridge()` |

## FAQ {#faq}

### Do I need @shopify/app-bridge-react?

No. `polaris-vue-elements/app-bridge` does not use React. It needs only the App Bridge
script on the page, and `@shopify/app-bridge-types` for types.

### Does it work outside the Shopify admin?

No. The App Bridge script connects your app to the admin, and the admin renders modals,
the save bar and the title bar. Open the app from the admin, as described in the
[embedded-app guide](/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris).

### Should I use Modal or SModal?

Shopify's [migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide)
says that App Bridge "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes". `Modal` mirrors the `ui-modal`
element that `@shopify/app-bridge-react` still provides.
