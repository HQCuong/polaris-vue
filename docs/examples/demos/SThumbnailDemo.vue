<script setup lang="ts">
import { SThumbnail } from '@lib'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center">
    <SThumbnail src="https://picsum.photos/seed/polaris-thumb/100" alt="Product photo" size="small" />
    <SThumbnail src="https://picsum.photos/seed/polaris-thumb/100" alt="Product photo" size="base" />
    <SThumbnail src="https://picsum.photos/seed/polaris-thumb/100" alt="Product photo" size="large" />
    <!-- No src: renders a placeholder -->
    <SThumbnail alt="Product photo not yet uploaded" size="base" />
  </div>
</template>
