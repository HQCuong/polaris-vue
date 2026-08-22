<script setup>
import SEmailFieldDemo from './demos/SEmailFieldDemo.vue'
</script>

<div class="demo-surface">

<SEmailFieldDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SEmailField } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SEmailField label="Email" placeholder="jane@example.com" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
