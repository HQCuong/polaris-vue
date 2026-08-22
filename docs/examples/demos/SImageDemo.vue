<script setup lang="ts">
import { SImage } from '@lib'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-start">
    <SImage
      src="https://picsum.photos/seed/polaris-image/400/300"
      alt="Placeholder scenic photo"
      aspectRatio="4/3"
      inlineSize="fill"
      objectFit="cover"
      borderRadius="200"
      style="width: 220px"
    />
  </div>
</template>
