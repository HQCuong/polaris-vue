<script setup>
import SSearchFieldDemo from './demos/SSearchFieldDemo.vue'
</script>

<div class="demo-surface">

<SSearchFieldDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SSearchField } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SSearchField label="Search products" placeholder="Search" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
