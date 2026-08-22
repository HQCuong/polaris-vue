<script setup>
import SColorPickerDemo from './demos/SColorPickerDemo.vue'
</script>

<SColorPickerDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SColorPicker } from 'polaris-vue-elements'

const value = ref('#008060')
</script>

<template>
  <SColorPicker v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
