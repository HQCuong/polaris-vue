<script setup>
import SSwitchDemo from './demos/SSwitchDemo.vue'
</script>

<SSwitchDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SSwitch } from 'polaris-vue'

const value = ref(false)
</script>

<template>
  <SSwitch label="Enable notifications" v-model="value" />
  <p>On: {{ value }}</p>
</template>
```
