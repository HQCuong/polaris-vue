<script setup>
import SBoxDemo from './demos/SBoxDemo.vue'
</script>

<SBoxDemo />

```vue
<script setup>
import { SBox, SText } from 'polaris-vue-elements'
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap">
    <SBox background="subdued" padding="base" borderRadius="200">
      <SText>background="subdued"</SText>
    </SBox>
    <SBox background="strong" padding="base" borderRadius="200">
      <SText>background="strong"</SText>
    </SBox>
    <SBox
      background="base"
      padding="base"
      borderRadius="200"
      borderWidth="small"
      borderColor="strong"
      borderStyle="solid"
    >
      <SText>bordered box</SText>
    </SBox>
  </div>
</template>
```
