<script setup>
import SChipDemo from './demos/SChipDemo.vue'
</script>

<div class="demo-surface">

<SChipDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SChip, SIcon } from 'polaris-vue-elements'

const removed = ref(false)
</script>

<template>
  <!-- SChip's `graphic` slot only accepts an SIcon. -->
  <SChip>
    <template #graphic>
      <SIcon type="product" />
    </template>
    Snowboard
  </SChip>

  <!-- SChip has no `hidden` prop (unlike SClickableChip) — use v-if to remove it
       from the DOM when `remove` fires. -->
  <SChip v-if="!removed" color="strong" removable @remove="removed = true">
    Removable chip
  </SChip>
</template>
```
