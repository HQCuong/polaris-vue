<script setup>
import SProgressDemo from './demos/SProgressDemo.vue'
</script>

<div class="demo-surface">

<SProgressDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SProgress, SButton } from 'polaris-vue-elements'

const uploaded = ref(40)

function advance() {
  uploaded.value = Math.min(uploaded.value + 20, 100)
}
</script>

<template>
  <!-- determinate: bind numeric props, don't write them as string attributes -->
  <SProgress accessibilityLabel="Import progress" :value="uploaded" :max="100" />

  <!-- toned -->
  <SProgress accessibilityLabel="Sync progress" tone="success" :value="80" :max="100" />

  <!-- indeterminate: omit `value` entirely -->
  <SProgress accessibilityLabel="Preparing export" />

  <SButton @click="advance">Upload next file ({{ uploaded }}%)</SButton>
</template>
```
