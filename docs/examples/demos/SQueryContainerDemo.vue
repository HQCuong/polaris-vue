<script setup lang="ts">
import { SQueryContainer, SText } from '@lib'
</script>

<template>
  <div class="query-resize-wrapper">
    <SQueryContainer containerName="docs-demo">
      <SText class="wide-only">Wide layout (container inline-size ≥ 320px)</SText>
      <SText class="narrow-only">Narrow layout (container inline-size &lt; 320px)</SText>
    </SQueryContainer>
  </div>
</template>

<style scoped>
.query-resize-wrapper {
  resize: horizontal;
  overflow: auto;
  inline-size: 400px;
  max-inline-size: 100%;
  min-inline-size: 160px;
  border: 1px dashed #8c9196;
  border-radius: 8px;
  padding: 12px;
}
.narrow-only {
  display: none;
}
/* Queries the container established by SQueryContainer via its containerName prop. */
@container docs-demo (inline-size < 320px) {
  .wide-only {
    display: none;
  }
  .narrow-only {
    display: block;
  }
}
</style>
