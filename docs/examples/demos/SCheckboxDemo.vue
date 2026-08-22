<script setup lang="ts">
import { ref } from 'vue'
import { SCheckbox } from '@lib'

const value = ref(false)
</script>

<template>
  <SCheckbox label="Send me marketing emails" v-model="value" />
  <p>Checked: <code>{{ value }}</code></p>
</template>
