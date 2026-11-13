---
title: useAppBridge()
description: useAppBridge() shopify global लौटाता है, जिसका type ShopifyGlobal है।
---

# useAppBridge() {#use-app-bridge}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें।

`useAppBridge()` `shopify` global लौटाता है, जिसका type `ShopifyGlobal` है:

```vue
<script setup lang="ts">
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const shopify = useAppBridge()

function generate(): void {
  shopify.toast.show('Blog post template generated')
}
</script>

<template>
  <button @click="generate">Generate blog post</button>
</template>
```

`@shopify/app-bridge-react` की तरह:

- Server पर यह एक ऐसा object लौटाता है जो किसी भी property को पढ़ने पर error throw करता है। APIs को
  `onMounted()` या किसी event handler से call करें।
- Browser में, अगर `shopify` परिभाषित नहीं है तो यह error throw करता है, जिसका मतलब "likely means the App
  Bridge script tag was not added correctly to this page" है।

`shopify` global को सीधे इस्तेमाल करना, जैसा embedded-app guide करती है, भी काम करता है।
