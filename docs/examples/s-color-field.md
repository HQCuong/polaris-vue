<script setup>
import SColorFieldDemo from './demos/SColorFieldDemo.vue'
</script>

<SColorFieldDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SColorField } from 'polaris-vue-elements'

const value = ref('#008060')
</script>

<template>
  <SColorField label="Brand color" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
