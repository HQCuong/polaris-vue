<script setup lang="ts">
import { SSpinner } from '@lib'
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center">
    <SSpinner accessibilityLabel="Loading, small" size="base" />
    <SSpinner accessibilityLabel="Loading, large" size="large" />
    <SSpinner accessibilityLabel="Loading, extra large" size="large-100" />
  </div>
</template>
