<script setup>
import SCheckboxDemo from './demos/SCheckboxDemo.vue'
</script>

<SCheckboxDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SCheckbox } from 'polaris-vue'

const value = ref(false)
</script>

<template>
  <SCheckbox label="Send me marketing emails" v-model="value" />
  <p>Checked: {{ value }}</p>
</template>
```
