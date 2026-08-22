<script setup lang="ts">
import { SButton, SText, STooltip } from '@lib'
</script>

<template>
  <!-- Hover (or focus) the button to reveal the tooltip; interestFor points at
       the tooltip's id, no click required. -->
  <SButton interestFor="docs-example-tooltip">Hover or focus me</SButton>

  <STooltip id="docs-example-tooltip">
    <SText>Extra context shown on hover or focus.</SText>
  </STooltip>
</template>
