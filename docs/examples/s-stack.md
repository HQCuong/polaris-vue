<script setup>
import SStackDemo from './demos/SStackDemo.vue'
</script>

<div class="demo-surface">

<SStackDemo />

</div>

```vue
<script setup>
import { SStack, SBox, SText } from 'polaris-vue-elements'
</script>

<template>
  <SStack direction="inline" gap="large" alignItems="center">
    <SBox background="subdued" padding="base" borderRadius="200">
      <SText>Item 1</SText>
    </SBox>
    <SBox background="subdued" padding="base" borderRadius="200">
      <SText>Item 2</SText>
    </SBox>
    <SBox background="subdued" padding="base" borderRadius="200">
      <SText>Item 3</SText>
    </SBox>
  </SStack>
</template>
```
