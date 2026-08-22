<script setup lang="ts">
import { SText } from '@lib'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 4px">
    <SText>Default text</SText>
    <SText type="strong">Strong text</SText>
    <SText color="subdued">Subdued text</SText>
    <SText tone="success">Success tone</SText>
    <SText tone="critical">Critical tone</SText>
    <SText fontVariantNumeric="tabular-nums">Tabular numbers: 10 200 3000</SText>
  </div>
</template>
