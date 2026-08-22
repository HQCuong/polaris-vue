<script setup lang="ts">
import { ref } from 'vue'
import { SEmailField } from '@lib'

const value = ref('')
</script>

<template>
  <SEmailField label="Email" placeholder="jane@example.com" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
