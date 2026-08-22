<script setup lang="ts">
import { ref } from 'vue'
import { SDatePicker } from '@lib'

const value = ref('')
</script>

<template>
  <SDatePicker type="single" v-model="value" />
  <p>Selected: <code>{{ value || '(none)' }}</code></p>
</template>
