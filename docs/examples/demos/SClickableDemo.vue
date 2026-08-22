<script setup lang="ts">
import { ref } from 'vue'
import { SClickable, SText } from '@lib'

const clicks = ref(0)
</script>

<template>
  <SClickable
    background="subdued"
    borderRadius="200"
    padding="base"
    @click="clicks++"
  >
    <SText>Clicked {{ clicks }} times</SText>
  </SClickable>
</template>
