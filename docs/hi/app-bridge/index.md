---
title: Vue के लिए App Bridge components
description: Shopify के @shopify/app-bridge-react components के Vue 3 समकक्ष — Modal, SaveBar, AppWindow, TitleBar, NavMenu और useAppBridge — polaris-vue-elements/app-bridge से।
---

# Vue के लिए App Bridge components {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge` में Shopify के
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
(version 4.3.0) के components और hook के Vue 3 समकक्ष हैं। ये उन App Bridge elements को wrap करते हैं
जिन्हें App Bridge script परिभाषित करती है।
बाक़ी `polaris-vue-elements` की तरह यह एक community project है, Shopify द्वारा नहीं बनाया गया।

| Vue export | Element | Shopify reference |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | `shopify` global | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

ये elements केवल Shopify admin के अंदर काम करते हैं, इसलिए इस page में code examples हैं और
live demos नहीं हैं। पहले app सेट अप करें, जैसा
[Shopify embedded app बनाएँ](/hi/guide/shopify-embedded-app) में बताया गया है।

- [useAppBridge()](/hi/app-bridge/use-app-bridge)
- [Modal](/hi/app-bridge/modal)
- [TitleBar](/hi/app-bridge/title-bar)
- [SaveBar](/hi/app-bridge/save-bar)
- [AppWindow](/hi/app-bridge/app-window)
- [App navigation](/hi/app-bridge/nav-menu)

## Install {#install}

App Bridge script page पर होनी चाहिए (देखें
[embedded-app guide का चरण 1](/hi/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris))।
Types के लिए Shopify का types package install करें, जो `polaris-vue-elements` की एक optional peer
dependency है:

```sh
npm install -D @shopify/app-bridge-types
```

Shopify के
[App Bridge web components](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
page में लिखा है कि CDN script हमेशा नवीनतम App Bridge लोड करती है, और यह कहा गया है: "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

फिर subpath से import करें:

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

मुख्य `polaris-vue-elements` entry यह code import नहीं करती, इसलिए जो apps इसे इस्तेमाल नहीं करते
वे इसे लोड नहीं करते।

Components अपने elements को render functions से render करते हैं, इसलिए इन्हें इस्तेमाल करने के लिए
`isCustomElement` में कोई बदलाव ज़रूरी नहीं है।

## मौजूदा App Bridge elements {#current-elements}

Shopify की [migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide)
मौजूदा web components का वर्णन करती है:

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` Polaris modal है, इस library में
  [`SModal`](/hi/components/s-modal)।
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." यह [`SPage`](/hi/components/s-page) और उसके slots हैं।
- "The navigation now uses the `<s-app-nav>` web component."
  [App navigation](/hi/app-bridge/nav-menu) देखें।

`ui-modal`, `ui-save-bar`, `ui-title-bar` और `ui-nav-menu` अब भी
`@shopify/app-bridge-types` और `@shopify/app-bridge-react` में हैं, और इस page के components
इन्हीं को दर्शाते हैं।

## Raw tags {#raw-tags}

Elements को सीधे templates में लिखने के लिए (`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), `ui-` tags को भी custom elements मानें:

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

`s-app-window` और `s-app-nav` पहले से `s-` में आ जाते हैं।

उन tags की type checking के लिए, opt-in types को `tsconfig.app.json` में जोड़ें, अगर आप
`polaris-vue-elements/elements` types इस्तेमाल करते हैं तो उनके बगल में:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

यह `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window` और
`s-app-nav` को type करता है, साथ ही `<button>` और `<a>` के `variant`, `tone` और `loading` attributes को।
`s-page` को `polaris-vue-elements/elements` type करता है।

## Types {#types}

Subpath `@shopify/app-bridge-types` के हर type को re-export करता है, जैसा
`@shopify/app-bridge-react` करता है, साथ ही `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps` और `NavMenuProps` भी।

`polaris-vue-elements/app-bridge` का `ModalProps` `Modal` (`ui-modal`) के लिए है। मुख्य
entry भी एक `ModalProps` export करती है, `SModal` (`s-modal`) के लिए। दोनों import करते समय
एक का नाम बदलें:

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## React से मिलान {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (या `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| element का `ref` | template `ref`, फिर `.$el` |
| `children` | default slot |
| `useAppBridge()` | `useAppBridge()` |

## अक्सर पूछे जाने वाले सवाल {#faq}

### क्या मुझे @shopify/app-bridge-react चाहिए?

नहीं। `polaris-vue-elements/app-bridge` React इस्तेमाल नहीं करता। इसे केवल page पर App Bridge
script और types के लिए `@shopify/app-bridge-types` चाहिए।

### क्या यह Shopify admin के बाहर काम करता है?

नहीं। App Bridge script आपके app को admin से जोड़ती है, और admin ही modals, save bar और title bar को
render करता है। App को admin से खोलें, जैसा
[embedded-app guide](/hi/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris) में बताया गया है।

### मुझे Modal इस्तेमाल करना चाहिए या SModal?

Shopify की [migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide)
कहती है कि App Bridge "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes"। `Modal`, `ui-modal` element को दर्शाता है
जो `@shopify/app-bridge-react` अब भी देता है।
