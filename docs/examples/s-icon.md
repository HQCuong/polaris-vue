<script setup>
import SIconDemo from './demos/SIconDemo.vue'
</script>

<SIconDemo />

```vue
<script setup>
import { SIcon } from 'polaris-vue'
</script>

<template>
  <!-- `type` accepts a large named-icon union; a few examples below. See
       src/lib/generated/types.ts for the full list. -->
  <SIcon type="star" />
  <SIcon type="cart" tone="info" />
  <SIcon type="check-circle" tone="success" />
  <SIcon type="alert-triangle" tone="warning" />
  <SIcon type="delete" tone="critical" />
  <SIcon type="settings" size="small" color="subdued" />
</template>
```
