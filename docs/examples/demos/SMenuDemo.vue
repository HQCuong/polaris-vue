<script setup lang="ts">
import { SButton, SMenu, SSection } from '@lib'
</script>

<template>
  <SButton commandFor="docs-example-menu" command="--toggle">Actions</SButton>

  <SMenu id="docs-example-menu" accessibilityLabel="Actions menu">
    <SSection heading="Manage">
      <SButton variant="tertiary">Edit</SButton>
      <SButton variant="tertiary">Duplicate</SButton>
    </SSection>
    <SSection heading="Danger zone">
      <SButton variant="tertiary" tone="critical">Delete</SButton>
    </SSection>
  </SMenu>
</template>
