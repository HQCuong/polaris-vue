<script setup lang="ts">
import { SLink } from '@lib'
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center">
    <SLink href="https://polaris.shopify.com" target="_blank">Neutral link</SLink>
    <SLink href="https://polaris.shopify.com" target="_blank" tone="critical">Critical link</SLink>
  </div>
</template>
