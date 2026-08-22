<script setup>
import SCheckboxDemo from './demos/SCheckboxDemo.vue'
</script>

<div class="demo-surface">

<SCheckboxDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SCheckbox } from 'polaris-vue-elements'

const value = ref(false)
</script>

<template>
  <SCheckbox label="Send me marketing emails" v-model="value" />
  <p>Checked: {{ value }}</p>
</template>
```
