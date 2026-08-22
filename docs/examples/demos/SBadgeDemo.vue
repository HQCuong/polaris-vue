<script setup lang="ts">
import { SBadge } from '@lib'
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
    <SBadge tone="neutral">Neutral</SBadge>
    <SBadge tone="info">Info</SBadge>
    <SBadge tone="success">Success</SBadge>
    <SBadge tone="caution">Caution</SBadge>
    <SBadge tone="warning">Warning</SBadge>
    <SBadge tone="critical">Critical</SBadge>
  </div>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px">
    <SBadge tone="success" icon="check-circle">With icon</SBadge>
    <SBadge tone="info" size="large">Large</SBadge>
    <SBadge tone="info" color="strong">Strong color</SBadge>
  </div>
</template>
