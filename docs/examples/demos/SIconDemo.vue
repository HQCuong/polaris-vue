<script setup lang="ts">
import { SIcon } from '@lib'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center">
    <SIcon type="star" />
    <SIcon type="cart" tone="info" />
    <SIcon type="check-circle" tone="success" />
    <SIcon type="alert-triangle" tone="warning" />
    <SIcon type="delete" tone="critical" />
    <SIcon type="settings" size="small" color="subdued" />
  </div>
</template>
