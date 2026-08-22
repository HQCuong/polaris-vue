<script setup>
import SPageDemo from './demos/SPageDemo.vue'
</script>

<!-- SPage is typically the root of a whole app screen. It's wrapped in a bordered,
     scrollable box here purely so the docs preview stays compact; a real app renders
     it directly at the top level, unconstrained. -->
<div class="demo-surface">

<SPageDemo />

</div>

```vue
<script setup>
import { SPage, SSection, SParagraph, SButton } from 'polaris-vue-elements'
</script>

<template>
  <SPage heading="Orders">
    <template #primary-action>
      <SButton variant="primary">Create order</SButton>
    </template>

    <SSection heading="Recent activity">
      <SParagraph>No orders have been placed yet.</SParagraph>
    </SSection>
  </SPage>
</template>
```
