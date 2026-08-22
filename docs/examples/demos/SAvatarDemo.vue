<script setup lang="ts">
import { SAvatar } from '@lib'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center">
    <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="small" />
    <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="base" />
    <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="large" />
    <!-- No src: falls back to initials -->
    <SAvatar initials="AL" alt="Ada Lovelace" size="large" />
  </div>
</template>
