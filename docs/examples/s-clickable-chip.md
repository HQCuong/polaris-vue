<script setup>
import SClickableChipDemo from './demos/SClickableChipDemo.vue'
</script>

<SClickableChipDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SClickableChip, SIcon } from 'polaris-vue-elements'

const removed = ref(false)
</script>

<template>
  <!-- SClickableChip is a Chip that can act as a link (href) or command trigger,
       and its `graphic` slot only accepts an SIcon. -->
  <SClickableChip href="https://polaris.shopify.com" target="_blank">
    <template #graphic>
      <SIcon type="external" />
    </template>
    Visit Polaris
  </SClickableChip>

  <!-- removable chips fire `remove`; drive `hidden` from app state to actually hide it. -->
  <SClickableChip removable :hidden="removed" @remove="removed = true">
    Removable chip
  </SClickableChip>
</template>
```
