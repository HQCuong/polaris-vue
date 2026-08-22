<script setup lang="ts">
import { ref } from 'vue'
import { SPressButton } from '@lib'

const pressed = ref(false)
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
    <SPressButton icon="star" accessibilityLabel="Favorite" :pressed="pressed" @click="pressed = !pressed" />
    <SPressButton variant="secondary">Secondary</SPressButton>
    <SPressButton variant="tertiary">Tertiary</SPressButton>
    <SPressButton disabled>Disabled</SPressButton>
  </div>
</template>
