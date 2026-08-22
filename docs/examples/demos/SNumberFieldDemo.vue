<script setup lang="ts">
import { ref } from 'vue'
import { SNumberField } from '@lib'

const value = ref('1')
</script>

<template>
  <SNumberField label="Quantity" :min="0" :max="100" :step="1" v-model="value" />
  <p>Value: <code>{{ value }}</code></p>
</template>
