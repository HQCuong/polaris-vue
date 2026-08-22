<script setup>
import STextDemo from './demos/STextDemo.vue'
</script>

<STextDemo />

```vue
<script setup>
import { SText } from 'polaris-vue-elements'
</script>

<template>
  <SText>Default text</SText>
  <SText type="strong">Strong text</SText>
  <SText color="subdued">Subdued text</SText>
  <SText tone="success">Success tone</SText>
  <SText tone="critical">Critical tone</SText>
  <SText fontVariantNumeric="tabular-nums">Tabular numbers: 10 200 3000</SText>
</template>
```
