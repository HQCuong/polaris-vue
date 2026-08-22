<script setup lang="ts">
import { SPage, SSection, SParagraph, SButton } from '@lib'
</script>

<template>
  <div style="border: 1px solid #d3d3d3; border-radius: 8px; overflow: auto; max-height: 320px">
    <SPage heading="Orders">
      <template #primary-action>
        <SButton variant="primary">Create order</SButton>
      </template>

      <SSection heading="Recent activity">
        <SParagraph>No orders have been placed yet.</SParagraph>
      </SSection>
    </SPage>
  </div>
</template>
