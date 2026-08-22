<script setup>
import SPasswordFieldDemo from './demos/SPasswordFieldDemo.vue'
</script>

<SPasswordFieldDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SPasswordField } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SPasswordField label="Password" placeholder="Enter your password" v-model="value" />
  <p>Length: {{ value.length }}</p>
</template>
```
