<script setup lang="ts">
import { ref } from 'vue'
import { STextArea } from '@lib'

const value = ref('')
</script>

<template>
  <STextArea label="Bio" placeholder="Tell us about yourself" :rows="3" v-model="value" />
  <p>Value: <code>{{ value || '(empty)' }}</code></p>
</template>
