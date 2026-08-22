<script setup>
import SMoneyFieldDemo from './demos/SMoneyFieldDemo.vue'
</script>

<div class="demo-surface">

<SMoneyFieldDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SMoneyField } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SMoneyField label="Price" currencyCode="USD" placeholder="0.00" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
