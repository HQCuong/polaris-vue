<script setup>
import SUrlFieldDemo from './demos/SUrlFieldDemo.vue'
</script>

<div class="demo-surface">

<SUrlFieldDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SUrlField } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SUrlField label="Website" placeholder="https://example.com" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
