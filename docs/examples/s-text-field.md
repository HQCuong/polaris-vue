<script setup>
import STextFieldDemo from './demos/STextFieldDemo.vue'
</script>

<STextFieldDemo />

```vue
<script setup>
import { ref } from 'vue'
import { STextField } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <STextField label="Your name" placeholder="Jane Doe" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
