<script setup lang="ts">
import { ref } from 'vue'
import { SColorPicker } from '@lib'

const value = ref('#008060')
</script>

<template>
  <SColorPicker v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
