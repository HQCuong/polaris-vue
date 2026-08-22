<script setup lang="ts">
import { ref } from 'vue'
import { SColorField } from '@lib'

const value = ref('#008060')
</script>

<template>
  <SColorField label="Brand color" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
