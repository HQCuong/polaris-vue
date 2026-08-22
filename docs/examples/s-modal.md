<script setup>
import SModalDemo from './demos/SModalDemo.vue'
</script>

<SModalDemo />

```vue
<script setup>
import { SButton, SModal } from 'polaris-vue-elements'
</script>

<template>
  <SButton commandFor="example-modal" command="--show">Open modal</SButton>

  <SModal id="example-modal" heading="Example modal">
    <p>Modal body content goes here.</p>

    <!-- The runtime only accepts a primary-action button with variant="primary",
         and secondary-actions buttons with variant="secondary" (or "auto"). -->
    <template #primary-action>
      <SButton variant="primary">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton variant="secondary">Cancel</SButton>
    </template>
  </SModal>
</template>
```
