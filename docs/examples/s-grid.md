<script setup>
import SGridDemo from './demos/SGridDemo.vue'
</script>

<SGridDemo />

```vue
<script setup>
import { SGrid, SGridItem, SBox, SText } from 'polaris-vue'
</script>

<template>
  <!-- SGrid controls the track layout (columns/rows/gap); each SGridItem is a cell. -->
  <SGrid gridTemplateColumns="1fr 1fr" gap="base">
    <SGridItem>
      <SBox background="subdued" padding="base" borderRadius="200">
        <SText>Column 1</SText>
      </SBox>
    </SGridItem>
    <SGridItem>
      <SBox background="subdued" padding="base" borderRadius="200">
        <SText>Column 2</SText>
      </SBox>
    </SGridItem>
    <SGridItem>
      <SBox background="strong" padding="base" borderRadius="200">
        <SText>Column 1</SText>
      </SBox>
    </SGridItem>
    <SGridItem>
      <SBox background="strong" padding="base" borderRadius="200">
        <SText>Column 2</SText>
      </SBox>
    </SGridItem>
  </SGrid>
</template>
```
