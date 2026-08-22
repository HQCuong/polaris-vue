<script setup>
import SDatePickerDemo from './demos/SDatePickerDemo.vue'
</script>

<SDatePickerDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SDatePicker } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SDatePicker type="single" v-model="value" />
  <p>Selected: {{ value }}</p>
</template>
```
