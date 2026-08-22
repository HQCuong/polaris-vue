<script setup>
import SChoiceListDemo from './demos/SChoiceListDemo.vue'
</script>

<div class="demo-surface">

<SChoiceListDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SChoiceList, SChoice } from 'polaris-vue-elements'

const value = ref([])
</script>

<template>
  <SChoiceList label="Notify me by" multiple v-model="value">
    <SChoice value="email">Email</SChoice>
    <SChoice value="sms">SMS</SChoice>
    <SChoice value="push">Push notification</SChoice>
  </SChoiceList>
  <p>Selected: {{ value.join(', ') }}</p>
</template>
```
