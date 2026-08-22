<script setup lang="ts">
import { ref } from 'vue'
import { SSwitch } from '@lib'

const value = ref(false)
</script>

<template>
  <SSwitch label="Enable notifications" v-model="value" />
  <p>On: <code>{{ value }}</code></p>
</template>
