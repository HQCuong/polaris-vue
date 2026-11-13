---
title: App navigation
description: Shopify app navigation के लिए <s-link> children वाले <s-app-nav> को document करता है; देखें embedded-app guide और Shopify का app nav reference।
---

# App navigation {#app-nav}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें।

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
