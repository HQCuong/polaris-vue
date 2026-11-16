---
title: "NavMenu (ui-nav-menu) – Vue 3 के लिए App Bridge"
description: "Vue 3 वाले Shopify embedded app का app navigation: Shopify s-app-nav को document करता है, जो raw tag के रूप में काम करता है; NavMenu पुराने App Bridge ui-nav-menu को render करता है।"
---

# App navigation {#app-nav}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें।

App nav Shopify admin में आपके app के navigation items configure करता है, जैसा Shopify का [NavMenu reference](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) बताता है।

Shopify app navigation के लिए `<s-link>` children वाले `<s-app-nav>` को document करता है; देखें
[embedded-app guide](/hi/guide/shopify-embedded-app#app-navigation) और Shopify का
[app nav reference](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)।
इसका भी कोई React component नहीं है; Shopify की
[React migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
इसे सीधे render करने को कहती है। इसलिए इस library में इसके लिए कोई component नहीं है, और raw tag
मौजूदा `s-` वाले `isCustomElement` नियम के साथ काम करता है।

`NavMenu` पुराने `ui-nav-menu` को render करता है, उन apps के लिए जो अब भी इसे इस्तेमाल करते हैं:

```vue
<script setup lang="ts">
import { NavMenu } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <NavMenu>
    <a href="/" rel="home">Home</a>
    <a href="/templates">Templates</a>
  </NavMenu>
</template>
```

दोनों में से कोई भी element Vue Router के साथ कैसे काम करता है, यह अभी verify नहीं किया गया है।

## Props और events {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` में कोई prop नहीं है और यह कोई event emit नहीं करता: `UINavMenuAttributes` सिर्फ़ children define करता है, जिन्हें `NavMenu` अपने default slot से render करता है। Types इन children का वर्णन नहीं करते।

| Slot | विवरण |
| --- | --- |
| `default` | Navigation links, जैसे ऊपर के उदाहरण में `<a href="/" rel="home">`। |

### `s-app-nav` {#reference-app-nav}

Types में `s-app-nav` का कोई attribute नहीं है। इसके children navigation items हैं, जो link elements के रूप में दिए जाते हैं: हर link app के navigation menu में एक item बनाता है, और `rel="home"` वाला एक link default landing page set करता है।

Types इन links के attributes का वर्णन करते हैं:

| Attribute | Type | विवरण |
| --- | --- | --- |
| `href` | `string` (ज़रूरी) | Navigation item का path, आपके app के भीतर relative, जैसे `/products` या `/settings`। Click करने पर app पूरा page reload किए बिना इस route पर जाता है; यह आपके app की routing के किसी route से मेल खाना चाहिए। |
| `rel` | `"home"` | Link को app का default landing page बनाता है। वह link navigation menu में छिपा रहता है, और सिर्फ़ एक link में `rel="home"` होना चाहिए। |
| `children` | `string` | Item का दिखने वाला label। Types छोटे labels (एक या दो शब्द) की सलाह देते हैं जो destination का नाम बताएँ, जैसे "Products" या "Settings"। |
