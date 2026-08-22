<script setup>
import SDividerDemo from './demos/SDividerDemo.vue'
</script>

<div class="demo-surface">

<SDividerDemo />

</div>

```vue
<script setup>
import { SDivider, SParagraph } from 'polaris-vue-elements'
</script>

<template>
  <SParagraph>Content above the divider.</SParagraph>
  <SDivider />
  <SParagraph>Content below the divider.</SParagraph>
  <SDivider color="strong" />
  <SParagraph color="subdued">A stronger divider variant.</SParagraph>
</template>
```
