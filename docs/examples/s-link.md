<script setup>
import SLinkDemo from './demos/SLinkDemo.vue'
</script>

<SLinkDemo />

```vue
<script setup>
import { SLink } from 'polaris-vue-elements'
</script>

<template>
  <SLink href="https://polaris.shopify.com" target="_blank">Neutral link</SLink>
  <SLink href="https://polaris.shopify.com" target="_blank" tone="critical">Critical link</SLink>
</template>
```
