<script setup>
import SEmptyStateDemo from './demos/SEmptyStateDemo.vue'
</script>

<div class="demo-surface">

<SEmptyStateDemo />

</div>

```vue
<script setup>
import { SEmptyState, SButton, SIcon, SText, SLink } from 'polaris-vue-elements'
</script>

<template>
  <SEmptyState heading="No orders yet">
    <template #graphic>
      <SIcon type="cart" size="large" />
    </template>
    <template #subheading>
      <SText>Once a customer places an order, it will show up here. <SLink href="https://help.shopify.com/orders" target="_blank">Learn more about orders</SLink></SText>
    </template>
    <template #primary-action>
      <SButton variant="primary">Create order</SButton>
    </template>
    <template #secondary-actions>
      <SButton variant="secondary">Import orders</SButton>
    </template>
  </SEmptyState>
</template>
```
