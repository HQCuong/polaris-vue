<script setup lang="ts">
import { ref } from 'vue'
import { SDateField } from '@lib'

const value = ref('')
</script>

<template>
  <SDateField label="Delivery date" placeholder="YYYY-MM-DD" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
