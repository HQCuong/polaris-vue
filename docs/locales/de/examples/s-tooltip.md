<script setup>
import STooltipDemo from './demos/STooltipDemo.vue'
</script>

Bewegen Sie den Mauszeiger über die Schaltfläche unten oder fokussieren Sie sie, um den Tooltip anzuzeigen: Er wird über `interestFor` aktiviert, nicht per Klick.

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
