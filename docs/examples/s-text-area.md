<script setup>
import STextAreaDemo from './demos/STextAreaDemo.vue'
</script>

<STextAreaDemo />

```vue
<script setup>
import { ref } from 'vue'
import { STextArea } from 'polaris-vue'

const value = ref('')
</script>

<template>
  <STextArea label="Bio" placeholder="Tell us about yourself" :rows="3" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
