<script setup lang="ts">
import { SButton, SButtonGroup, SPressButton } from '@lib'
</script>

<template>
  <SButtonGroup>
    <SPressButton>List</SPressButton>
    <SPressButton pressed>Grid</SPressButton>
  </SButtonGroup>

  <div style="margin-top: 12px">
    <SButtonGroup>
      <template #primary-action>
        <SButton variant="primary">Save</SButton>
      </template>
      <template #secondary-actions>
        <SButton variant="secondary">Cancel</SButton>
        <SButton variant="secondary">Discard</SButton>
      </template>
    </SButtonGroup>
  </div>
</template>
