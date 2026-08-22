<script setup>
import SMoneyFieldDemo from './demos/SMoneyFieldDemo.vue'
</script>

<SMoneyFieldDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SMoneyField } from 'polaris-vue'

const value = ref('')
</script>

<template>
  <SMoneyField label="Price" currencyCode="USD" placeholder="0.00" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
