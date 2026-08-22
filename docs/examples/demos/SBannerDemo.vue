<script setup lang="ts">
import { ref } from 'vue'
import { SBanner, SButton, SText } from '@lib'

const showCritical = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px">
    <SBanner heading="Order updated" tone="success">
      <SText>Your changes have been saved.</SText>
    </SBanner>

    <SBanner v-if="showCritical" heading="Something went wrong" tone="critical" dismissible @dismiss="showCritical = false">
      <SText>We couldn't process the payment. Please try again.</SText>
      <template #secondary-actions>
        <SButton variant="secondary">Retry</SButton>
      </template>
    </SBanner>
  </div>
</template>
