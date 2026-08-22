<script setup>
import SGridDemo from './demos/SGridDemo.vue'
</script>

<div class="demo-surface">

<SGridDemo />

</div>

```vue
<script setup>
import { SGrid, SGridItem, SBox, SText } from 'polaris-vue-elements'
</script>

<template>
  <!-- Each SGridItem is one cell placed into the parent SGrid's tracks. -->
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
