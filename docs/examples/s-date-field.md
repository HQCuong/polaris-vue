<script setup>
import SDateFieldDemo from './demos/SDateFieldDemo.vue'
</script>

<div class="demo-surface">

<SDateFieldDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SDateField } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SDateField label="Delivery date" placeholder="YYYY-MM-DD" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
