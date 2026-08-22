<script setup>
import SPressButtonDemo from './demos/SPressButtonDemo.vue'
</script>

<SPressButtonDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SPressButton } from 'polaris-vue-elements'

const pressed = ref(false)
</script>

<template>
  <!-- SPressButton is a toggle-style button (aria-pressed) — pressed/defaultPressed
       control the on/off state instead of a click counter. -->
  <SPressButton icon="star" accessibilityLabel="Favorite" :pressed="pressed" @click="pressed = !pressed" />
  <SPressButton variant="secondary">Secondary</SPressButton>
  <SPressButton variant="tertiary">Tertiary</SPressButton>
  <SPressButton disabled>Disabled</SPressButton>
</template>
```
