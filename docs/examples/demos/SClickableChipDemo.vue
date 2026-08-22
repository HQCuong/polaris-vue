<script setup lang="ts">
import { ref } from 'vue'
import { SClickableChip, SIcon } from '@lib'

const removed = ref(false)
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
    <SClickableChip href="https://polaris.shopify.com" target="_blank">
      <template #graphic>
        <SIcon type="external" />
      </template>
      Visit Polaris
    </SClickableChip>

    <SClickableChip removable :hidden="removed" @remove="removed = true">
      Removable chip
    </SClickableChip>
  </div>
</template>
