<script setup lang="ts">
import { ref } from 'vue'
import { SPasswordField } from '@lib'

const value = ref('')
</script>

<template>
  <SPasswordField label="Password" placeholder="Enter your password" v-model="value" />
  <p>Length: <code>{{ value.length }}</code></p>
</template>
