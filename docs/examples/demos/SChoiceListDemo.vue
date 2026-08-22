<script setup lang="ts">
import { ref } from 'vue'
import { SChoiceList, SChoice } from '@lib'

const value = ref<string[]>([])
</script>

<template>
  <SChoiceList label="Notify me by" multiple v-model="value">
    <SChoice value="email">Email</SChoice>
    <SChoice value="sms">SMS</SChoice>
    <SChoice value="push">Push notification</SChoice>
  </SChoiceList>
  <p>Selected: <code>{{ value.join(', ') || '(none)' }}</code></p>
</template>
