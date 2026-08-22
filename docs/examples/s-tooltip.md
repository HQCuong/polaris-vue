<script setup>
import STooltipDemo from './demos/STooltipDemo.vue'
</script>

Hover or focus the button below to reveal the tooltip — it activates via `interestFor`, not a click.

<STooltipDemo />

```vue
<script setup>
import { SButton, SText, STooltip } from 'polaris-vue'
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
