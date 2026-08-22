<script setup>
import SClickableDemo from './demos/SClickableDemo.vue'
</script>

<div class="demo-surface">

<SClickableDemo />

</div>

```vue
<script setup>
import { ref } from 'vue'
import { SClickable, SText } from 'polaris-vue-elements'

const clicks = ref(0)
</script>

<template>
  <!-- SClickable is a generic, unstyled-by-default interactive container: box
       styling props (background, padding, borderRadius, ...) plus a click event. -->
  <SClickable
    background="subdued"
    borderRadius="200"
    padding="base"
    @click="clicks++"
  >
    <SText>Clicked {{ clicks }} times</SText>
  </SClickable>
</template>
```
