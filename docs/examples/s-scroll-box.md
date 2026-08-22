<script setup>
import SScrollBoxDemo from './demos/SScrollBoxDemo.vue'
</script>

<SScrollBoxDemo />

```vue
<script setup>
import { SScrollBox, SBox, SText } from 'polaris-vue'
</script>

<template>
  <!-- maxBlockSize only accepts the "none"/"0" keywords, so an arbitrary pixel cap is
       set as a plain style attribute (it passes through untyped, see the quirks guide). -->
  <SScrollBox
    style="max-height: 160px"
    overflow="auto"
    border="base"
    borderRadius="200"
    padding="base"
  >
    <SBox
      v-for="n in 8"
      :key="n"
      padding="small"
      paddingBlockEnd="small"
      borderColor="subdued"
      borderWidth="small"
      borderStyle="solid"
    >
      <SText>Scrollable row {{ n }}</SText>
    </SBox>
  </SScrollBox>
</template>
```
