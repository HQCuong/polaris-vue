<script setup lang="ts">
import { SButton, SModal } from '@lib'
</script>

<template>
  <SButton commandFor="docs-example-modal" command="--show">Open modal</SButton>

  <SModal id="docs-example-modal" heading="Example modal">
    <p>Modal body content goes here.</p>

    <template #primary-action>
      <SButton variant="primary">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton variant="secondary">Cancel</SButton>
    </template>
  </SModal>
</template>
