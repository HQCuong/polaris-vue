<script setup>
import SNumberFieldDemo from './demos/SNumberFieldDemo.vue'
</script>

<SNumberFieldDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SNumberField } from 'polaris-vue'

const value = ref('1')
</script>

<template>
  <SNumberField label="Quantity" :min="0" :max="100" :step="1" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
