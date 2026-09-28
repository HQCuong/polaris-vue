<script setup lang="ts">
import { ref } from 'vue'
import { SProgress, SButton } from '@lib'

const uploaded = ref(40)

function advance() {
  uploaded.value = Math.min(uploaded.value + 20, 100)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <SProgress accessibilityLabel="Import progress" :value="uploaded" :max="100" />
    <SProgress accessibilityLabel="Sync progress" tone="success" :value="80" :max="100" />
    <SProgress accessibilityLabel="Preparing export" />
    <div>
      <SButton @click="advance">Upload next file ({{ uploaded }}%)</SButton>
    </div>
  </div>
</template>
