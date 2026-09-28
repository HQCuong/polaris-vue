<script setup lang="ts">
import { SEmptyState, SButton, SIcon, SText, SLink } from '@lib'
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
