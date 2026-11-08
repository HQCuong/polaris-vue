<script setup>
import STooltipDemo from './demos/STooltipDemo.vue'
</script>

Tooltip देखने के लिए नीचे दिए गए button पर hover करें या उसे focus करें — यह `interestFor` से activate होता है, click से नहीं।

<div class="demo-surface">

<STooltipDemo />

</div>

```vue
<script setup>
import { SButton, SText, STooltip } from 'polaris-vue-elements'
</script>

<template>
  <!-- interestFor activates the target on hover/focus, unlike commandFor which
       requires a click/activation. -->
  <SButton interestFor="example-tooltip">Hover or focus me</SButton>

  <STooltip id="example-tooltip">
    <SText>Extra context shown on hover or focus.</SText>
  </STooltip>
</template>
```
