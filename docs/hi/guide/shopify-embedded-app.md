---
title: Vue 3 के साथ Shopify embedded app बनाएँ
description: Vue 3 और Vite के साथ Shopify app बनाएँ — App Bridge और Polaris web components लोड करें, अपने backend को भेजी जाने वाली fetch calls authenticate करें, और App Home में typed s-* components इस्तेमाल करें।
---

# Vue 3 के साथ Shopify embedded app बनाएँ {#build-a-shopify-embedded-app-with-vue-3}

Embedded app (Shopify इसके UI को
[App Home](https://shopify.dev/docs/apps/build/app-home) कहता है) एक web app है जिसे आप
खुद host करते हैं और जिसे Shopify admin के अंदर एक iframe में render करता है। आप इसे
Vue 3 सहित किसी भी web framework से बना सकते हैं।

Runtime पर Shopify अपने CDN से आपको दो चीज़ें देता है:

- **App Bridge** (`app-bridge.js`) आपके iframe को admin से जोड़ता है और global
  `shopify` object उपलब्ध कराता है (toasts, modals, navigation, session tokens, ...)।
- **Polaris web components** (`polaris-2.js`) `<s-*>` custom elements को register करते हैं।

`polaris-vue-elements` उन elements के ऊपर typed Vue 3 components (`SPage`, `STextField`, `SModal`, ...)
जोड़ता है। यह एक community project है, Shopify का बनाया हुआ नहीं।

Shopify के अपने docs और templates React के लिए हैं, इसलिए यह guide Vue से जुड़े
हिस्सों को कवर करती है। यह मानकर चलती है कि आप [शुरुआत करें](/hi/guide/getting-started) पहले ही पढ़ चुके हैं।

## Architecture {#architecture}

- **Frontend:** Vue 3 + Vite का single-page app, जो आपके नियंत्रण वाले URL से serve होता है। Shopify
  इसे admin iframe में लोड करता है।
- **Backend:** कोई भी server जो Shopify के ID tokens validate कर सके और Admin API call कर सके।
  Authentication में
  [token exchange](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization)
  इस्तेमाल होता है: frontend एक ID token भेजता है, आपका backend उसे validate करता है और उसके बदले
  access token लेता है।

`shopify app init` एक React Router app का ढाँचा बनाता है; Shopify कोई Vue या दूसरा
non-React template नहीं देता। किसी दूसरे stack के लिए Shopify आपको अपने authentication docs
और आपकी भाषा की official API library की ओर भेजता है (Node.js के लिए एक library है जो किसी
framework पर निर्भर नहीं है)। एक व्यावहारिक तरीक़ा यह है कि backend का ढाँचा अपनी पसंद से
बनाएँ, और Vue app को अलग से बनाएँ, जैसा नीचे बताया गया है।

`shopify.app.toml` में app को `embedded = true` के साथ embed किया जाता है, और `application_url`
उस जगह की ओर इशारा करता है जहाँ से आपका app serve होता है।

## 1. App Bridge और Polaris लोड करें {#_1-load-app-bridge-and-polaris}

`index.html` के `<head>` में `shopify-api-key` meta tag (आपके app का client ID) और दोनों scripts
जोड़ें:

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Vite `index.html` में मौजूद `%VITE_*%` variables को आपके environment की values से बदल देता है
(उदाहरण के लिए `.env` में `VITE_SHOPIFY_API_KEY`)। आप चाहें तो key को अपने
server से भी inject कर सकते हैं।

App Bridge का version Polaris के साथ तय नहीं होता: इसके URL में कोई version नहीं है और यह हमेशा
App Bridge का latest version लोड करता है। Polaris channels (`polaris-2.js`, pinned releases) के लिए देखें
[ज्ञात quirks](/hi/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version)।

App को Shopify admin से खोलें (उदाहरण के लिए `shopify app dev` द्वारा दिखाए गए preview URL से)।
Browser tab में सीधे लोड करने पर उसके चारों ओर कोई admin नहीं होता और
App Bridge की features काम नहीं करेंगी।

`shopify` global तक typed पहुँच के लिए, Shopify का types package इंस्टॉल करें और
उसे reference करें (Shopify इसके लिए `@shopify/app-bridge-types` बताता है):

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

यही package `polaris-vue-elements/app-bridge` को भी type करता है, जिसमें App Bridge के elements के लिए
Vue components और एक `useAppBridge()` composable है; देखें
[App Bridge components](/hi/app-bridge/)।

## 2. Vite कॉन्फ़िगर करें {#_2-configure-vite}

`s-*` tags को custom elements मानें। यह वही config है जो
[शुरुआत करें](/hi/guide/getting-started#_3-configure-vite) में है:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('s-'),
        },
      },
    }),
  ],
})
```

अगर आप templates में raw App Bridge `ui-*` tags लिखते हैं (जैसे `<ui-title-bar>`), तो
`|| tag.startsWith('ui-')` जोड़ें। [`polaris-vue-elements/app-bridge`](/hi/app-bridge/#raw-tags)
के components को इसकी ज़रूरत नहीं है।

## 3. एक page बनाएँ {#_3-build-a-page}

इस page में `v-model` वाला एक form, आपके backend को call करने वाला एक save button, और reset की
पुष्टि करने वाला एक modal है। `SModal` को `commandFor`/`command` से declarative तरीक़े से खोला जाता है;
देखें [`SModal`](/hi/components/s-modal) और
[modal action slot से जुड़ा quirk](/hi/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants)।

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SCheckbox, SModal, SPage, SSection, SStack, SText, STextField } from 'polaris-vue-elements'

const title = ref('')
const enabled = ref(true)
const saving = ref(false)

async function save(): Promise<void> {
  saving.value = true
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, enabled: enabled.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  title.value = ''
  enabled.value = true
}
</script>

<template>
  <SPage heading="Settings">
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="title" label="Title" placeholder="Welcome" />
        <SCheckbox v-model="enabled" label="Enabled" />
        <SStack direction="inline" gap="base">
          <SButton variant="primary" :loading="saving" @click="save">Save</SButton>
          <SButton commandFor="reset-modal" command="--show">Reset</SButton>
        </SStack>
      </SStack>
    </SSection>

    <SModal id="reset-modal" heading="Reset settings?">
      <SText>This restores the default values.</SText>
      <template #primary-action>
        <SButton variant="primary" commandFor="reset-modal" command="--hide" @click="reset">Reset</SButton>
      </template>
      <template #secondary-actions>
        <SButton variant="secondary" commandFor="reset-modal" command="--hide">Cancel</SButton>
      </template>
    </SModal>
  </SPage>
</template>
```

## 4. अपने backend से बात करें {#_4-talk-to-your-backend}

आम तौर पर आपको खुद token जोड़ने की ज़रूरत नहीं होती। App Bridge `fetch()` को intercept करता है और
आपके app के domain और subdomains को भेजी गई requests में `Authorization` header में एक ID token
(और `Accept-Language` में store का locale) जोड़ देता है। एक सामान्य relative call काफ़ी है:

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

Server पर:

- हर request पर ID token validate करें: आपके client secret के साथ HS256 signature, `exp`
  और `nbf`, `aud` आपके client ID के बराबर, और मेल खाते `iss` और `dest` hostnames।
  विफल होने पर `401` लौटाएँ।
- ID tokens एक मिनट बाद expire हो जाते हैं और bearer credentials हैं: इन्हें सिर्फ़ अपने
  backend को ही भेजें।
- Admin API call करने के लिए ID token के बदले access token लें, और उस token को
  server पर ही रखें।

`shopify.idToken()` खुद तभी call करें जब interceptor उस request को कवर न करता हो,
जैसे WebSocket connection:

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

अगर आपके app को सिर्फ़ GraphQL Admin API चाहिए, तो app configuration में Direct API access
चालू होने पर App Bridge `fetch('shopify:admin/api/graphql.json', ...)` को admin के ज़रिए route
कर सकता है, और आपको अपने backend की ज़रूरत नहीं पड़ती। देखें
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api)।

## 5. Vue से App Bridge APIs इस्तेमाल करें {#_5-use-app-bridge-apis-from-vue}

सब कुछ `shopify` global पर है; किसी Vue plugin की ज़रूरत नहीं। `polaris-vue-elements/app-bridge` का
`useAppBridge()` वही global लौटाता है, और server पर या App Bridge script न होने पर साफ़ error देता है;
देखें [useAppBridge()](/hi/app-bridge/use-app-bridge)।

### Toasts {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` `duration` (ms), `isError`, `action`, `onAction` और
`onDismiss` स्वीकार करता है, और एक id लौटाता है जिसे आप `shopify.toast.hide(id)` को दे सकते हैं।

### id से modals {#modals-by-id}

`commandFor` के अलावा, `shopify.modal` किसी `SModal` को उसके `id` से नियंत्रित करता है:

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### App navigation {#app-navigation}

`<s-app-nav>` admin sidebar में app का navigation render करता है। इसे अपने app के root के पास
mounted रखें, उदाहरण के लिए `App.vue` में:

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

Active item मौजूदा URL से तय होता है। Code से navigate करने के लिए, Shopify की
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)
anchors, `open('/settings', '_self')` और History API
(`history.pushState`) के बारे में बताती है।

### Save bar {#save-bar}

किसी `<form>` में `data-save-bar` जोड़ें, और जब form में unsaved बदलाव हों तो admin एक save bar
दिखाता है; Save पर `submit` और Discard पर `reset` fire होता है। उसी form पर इसे
programmatic `shopify.saveBar` methods के साथ न मिलाएँ। देखें
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)।
`v-model:open` से bind किए गए `ui-save-bar` element के लिए देखें
[`SaveBar`](/hi/app-bridge/save-bar)।

## अगले कदम {#next-steps}

- [सभी components](/hi/components/) देखें और [ज्ञात quirks](/hi/guide/quirks) पढ़ें।
- [App Bridge components](/hi/app-bridge/) (`Modal`, `SaveBar`, `AppWindow`, ...) इस्तेमाल करें।
- `v-model`, overlays और raw tags को type करने के लिए [शुरुआत करें](/hi/guide/getting-started) फिर से देखें।
- Shopify के [App Home docs](https://shopify.dev/docs/apps/build/app-home) और
  [App Bridge APIs](https://shopify.dev/docs/api/app-home/apis) पढ़ें।
