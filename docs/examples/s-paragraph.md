<script setup>
import SParagraphDemo from './demos/SParagraphDemo.vue'
</script>

<SParagraphDemo />

```vue
<script setup>
import { SParagraph } from 'polaris-vue-elements'
</script>

<template>
  <SParagraph>Default paragraph text, used for the bulk of body copy.</SParagraph>
  <SParagraph color="subdued">A subdued paragraph, useful for secondary or helper text.</SParagraph>
  <SParagraph tone="critical">A critical paragraph, useful for inline error copy.</SParagraph>
  <SParagraph :lineClamp="2" style="max-width: 280px">
    A long paragraph that demonstrates lineClamp truncating its content after a fixed
    number of lines instead of wrapping indefinitely down the page.
  </SParagraph>
</template>
```
