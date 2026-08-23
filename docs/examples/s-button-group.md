<script setup>
import SButtonGroupDemo from './demos/SButtonGroupDemo.vue'
</script>

<div class="demo-surface">

<SButtonGroupDemo />

</div>

```vue
<script setup>
import { SButton, SButtonGroup, SPressButton } from 'polaris-vue-elements'
</script>

<template>
  <!-- primary-action accepts a single variant="primary" button; secondary-actions
       accepts Button (variant "secondary" or "auto") and PressButton (variant
       "secondary", its default) elements. The default slot is NOT rendered by the
       underlying <s-button-group> — content without one of these slots silently
       disappears. -->
  <SButtonGroup>
    <template #primary-action>
      <SButton variant="primary">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton variant="secondary">Cancel</SButton>
      <SButton variant="secondary">Discard</SButton>
    </template>
  </SButtonGroup>

  <!-- Segmented toggle: gap="none" joins the buttons. primary-action is not
       supported with gap="none", so every button goes in secondary-actions. -->
  <SButtonGroup gap="none" accessibilityLabel="View style">
    <template #secondary-actions>
      <SPressButton>List</SPressButton>
      <SPressButton pressed>Grid</SPressButton>
    </template>
  </SButtonGroup>
</template>
```
