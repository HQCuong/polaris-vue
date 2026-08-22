<script setup>
import SChoiceListDemo from './demos/SChoiceListDemo.vue'
</script>

`<SChoice>` doesn't render on its own — it's an individual choice within an `<SChoiceList>`. Its `value` prop is what feeds the parent's `values` array (bound via `v-model`), and its default slot is the choice label.

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
    <!-- Each SChoice's `value` is collected into SChoiceList's v-model array -->
    <SChoice value="email">Email</SChoice>
    <SChoice value="sms">SMS</SChoice>
    <SChoice value="push">Push notification</SChoice>
  </SChoiceList>
  <p>Selected: {{ value.join(', ') }}</p>
</template>
```
