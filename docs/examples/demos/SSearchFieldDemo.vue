<script setup lang="ts">
import { ref } from 'vue'
import { SSearchField } from '@lib'

const value = ref('')
</script>

<template>
  <SSearchField label="Search products" placeholder="Search" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
