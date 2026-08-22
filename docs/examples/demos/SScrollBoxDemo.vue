<script setup lang="ts">
import { SScrollBox, SBox, SText } from '@lib'
</script>

<template>
  <SScrollBox
    style="max-height: 160px"
    overflow="auto"
    border="base"
    borderRadius="200"
    padding="base"
  >
    <SBox
      v-for="n in 8"
      :key="n"
      padding="small"
      paddingBlockEnd="small"
      borderColor="subdued"
      borderWidth="small"
      borderStyle="solid"
    >
      <SText>Scrollable row {{ n }}</SText>
    </SBox>
  </SScrollBox>
</template>
