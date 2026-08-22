<script setup>
import SSelectDemo from './demos/SSelectDemo.vue'
</script>

`<SOption>` doesn't render on its own — it's an option within an `<SSelect>` (optionally grouped by `<SOptionGroup>`). Its `value` prop is what gets bound into the parent's `v-model`, and its default slot is the visible option label.

<div class="demo-surface">

<SSelectDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SSelect, SOption, SOptionGroup } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SSelect label="Shipping region" placeholder="Select a region" v-model="value">
    <SOptionGroup label="North America">
      <!-- Each SOption's `value` is what SSelect's v-model receives -->
      <SOption value="us">United States</SOption>
      <SOption value="ca">Canada</SOption>
    </SOptionGroup>
    <SOptionGroup label="Europe">
      <SOption value="fr">France</SOption>
      <SOption value="de">Germany</SOption>
    </SOptionGroup>
  </SSelect>
  <p>Value: {{ value }}</p>
</template>
```
