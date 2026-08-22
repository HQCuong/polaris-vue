<script setup>
import SDropZoneDemo from './demos/SDropZoneDemo.vue'
</script>

<SDropZoneDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SDropZone } from 'polaris-vue-elements'

const value = ref('')
</script>

<template>
  <SDropZone label="Upload a file" accept="image/*" v-model="value" />
  <p>Value: {{ value }}</p>
</template>
```
