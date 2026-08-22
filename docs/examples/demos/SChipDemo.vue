<script setup lang="ts">
import { ref } from 'vue'
import { SChip, SIcon } from '@lib'

const removed = ref(false)
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
    <SChip>
      <template #graphic>
        <SIcon type="product" />
      </template>
      Snowboard
    </SChip>

    <SChip v-if="!removed" color="strong" removable @remove="removed = true">
      Removable chip
    </SChip>
  </div>
</template>
