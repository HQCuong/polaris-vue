<script setup lang="ts">
import { SUnorderedList, SOrderedList, SListItem, SStack } from '@lib'
</script>

<template>
  <SStack direction="inline" gap="large-500" alignItems="start">
    <SUnorderedList>
      <SListItem>Free shipping over $50</SListItem>
      <SListItem>30-day returns</SListItem>
      <SListItem>24/7 customer support</SListItem>
    </SUnorderedList>
    <SOrderedList>
      <SListItem>Add items to your cart</SListItem>
      <SListItem>Review your order</SListItem>
      <SListItem>Confirm and check out</SListItem>
    </SOrderedList>
  </SStack>
</template>
