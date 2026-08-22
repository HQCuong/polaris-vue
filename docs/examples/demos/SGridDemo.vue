<script setup lang="ts">
import { SGrid, SGridItem, SBox, SText } from '@lib'
</script>

<template>
  <SGrid gridTemplateColumns="1fr 1fr" gap="base">
    <SGridItem>
      <SBox background="subdued" padding="base" borderRadius="200">
        <SText>Column 1</SText>
      </SBox>
    </SGridItem>
    <SGridItem>
      <SBox background="subdued" padding="base" borderRadius="200">
        <SText>Column 2</SText>
      </SBox>
    </SGridItem>
    <SGridItem>
      <SBox background="strong" padding="base" borderRadius="200">
        <SText>Column 1</SText>
      </SBox>
    </SGridItem>
    <SGridItem>
      <SBox background="strong" padding="base" borderRadius="200">
        <SText>Column 2</SText>
      </SBox>
    </SGridItem>
  </SGrid>
</template>
