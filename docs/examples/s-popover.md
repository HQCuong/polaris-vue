<script setup>
import SPopoverDemo from './demos/SPopoverDemo.vue'
</script>

<SPopoverDemo />

```vue
<script setup>
import { SButton, SPopover, SText } from 'polaris-vue'
</script>

<template>
  <!-- Same declarative pattern as SModal: a trigger button's commandFor points
       at the popover's id, command controls the action ("--toggle" here). -->
  <SButton commandFor="example-popover" command="--toggle">Toggle popover</SButton>

  <SPopover id="example-popover">
    <SText>Popover content, opened via commandFor/command on the button above.</SText>
  </SPopover>
</template>
```
