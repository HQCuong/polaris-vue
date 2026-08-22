<script setup lang="ts">
import { ref } from 'vue'
import { SDropZone } from '@lib'

const value = ref('')
</script>

<template>
  <SDropZone label="Upload a file" accept="image/*" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
