<script setup lang="ts">
import { ref } from 'vue'
import { SUrlField } from '@lib'

const value = ref('')
</script>

<template>
  <SUrlField label="Website" placeholder="https://example.com" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
