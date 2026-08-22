<script setup>
import SSectionDemo from './demos/SSectionDemo.vue'
</script>

<SSectionDemo />

```vue
<script setup>
import { SSection, SParagraph, SDivider } from 'polaris-vue-elements'
</script>

<template>
  <SSection heading="Shipping address">
    <SParagraph>123 Main Street, Ottawa, ON, Canada</SParagraph>
    <SDivider />
    <SParagraph color="subdued">Delivery instructions: leave at front door.</SParagraph>
  </SSection>
</template>
```
