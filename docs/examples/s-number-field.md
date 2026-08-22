<script setup>
import SNumberFieldDemo from './demos/SNumberFieldDemo.vue'
</script>

<div class="demo-surface">

<SNumberFieldDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SNumberField } from 'polaris-vue-elements'

const value = ref('1')
</script>

<template>
  <SNumberField label="Quantity" :min="0" :max="100" :step="1" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
