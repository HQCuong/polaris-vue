<script setup lang="ts">
import { ref } from 'vue'
import { STextField } from '@lib'

const value = ref('')
</script>

<template>
  <STextField label="Your name" placeholder="Jane Doe" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
