<script setup>
import SButtonGroupDemo from './demos/SButtonGroupDemo.vue'
</script>

<SButtonGroupDemo />

```vue
<script setup>
import { SButton, SButtonGroup, SPressButton } from 'polaris-vue'
</script>

<template>
  <!-- Default slot: a plain segmented group of PressButtons -->
  <SButtonGroup>
    <SPressButton>List</SPressButton>
    <SPressButton pressed>Grid</SPressButton>
  </SButtonGroup>

  <!-- primary-action/secondary-actions slots follow the same variant rules as SModal:
       primary-action accepts a single variant="primary" button, secondary-actions
       accepts variant="secondary" (or "auto") buttons. -->
  <SButtonGroup>
    <template #primary-action>
      <SButton variant="primary">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton variant="secondary">Cancel</SButton>
      <SButton variant="secondary">Discard</SButton>
    </template>
  </SButtonGroup>
</template>
```
