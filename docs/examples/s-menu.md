<script setup>
import SMenuDemo from './demos/SMenuDemo.vue'
</script>

<SMenuDemo />

```vue
<script setup>
import { SButton, SMenu, SSection } from 'polaris-vue'
</script>

<template>
  <!-- SMenu only accepts Button and Section elements in its default slot; it's
       activated the same way as SPopover, via commandFor/command on a trigger. -->
  <SButton commandFor="example-menu" command="--toggle">Actions</SButton>

  <SMenu id="example-menu" accessibilityLabel="Actions menu">
    <SSection heading="Manage">
      <SButton variant="tertiary">Edit</SButton>
      <SButton variant="tertiary">Duplicate</SButton>
    </SSection>
    <SSection heading="Danger zone">
      <SButton variant="tertiary" tone="critical">Delete</SButton>
    </SSection>
  </SMenu>
</template>
```
