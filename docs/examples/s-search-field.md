<script setup>
import SSearchFieldDemo from './demos/SSearchFieldDemo.vue'
</script>

<SSearchFieldDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SSearchField } from 'polaris-vue'

const value = ref('')
</script>

<template>
  <SSearchField label="Search products" placeholder="Search" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
