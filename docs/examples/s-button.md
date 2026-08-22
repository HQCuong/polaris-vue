<script setup>
import SButtonDemo from './demos/SButtonDemo.vue'
</script>

<div class="demo-surface">

<SButtonDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SButton } from 'polaris-vue-elements'

const clicks = ref(0)
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
    <SButton variant="primary">Primary</SButton>
    <SButton variant="secondary">Secondary</SButton>
    <SButton variant="tertiary">Tertiary</SButton>
    <SButton tone="critical">Critical</SButton>
  </div>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px;">
    <SButton loading>Loading</SButton>
    <SButton disabled>Disabled</SButton>
  </div>
  <div style="margin-top: 8px;">
    <SButton @click="clicks++">Clicked {{ clicks }} times</SButton>
  </div>
</template>
```
