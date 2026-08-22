<script setup lang="ts">
import { ref } from 'vue'
import { SMoneyField } from '@lib'

const value = ref('')
</script>

<template>
  <SMoneyField label="Price" currencyCode="USD" placeholder="0.00" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
