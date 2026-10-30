<script setup>
import STooltipDemo from './demos/STooltipDemo.vue'
</script>

Survolez le bouton ci-dessous ou donnez-lui le focus pour afficher le tooltip : il s'active via `interestFor`, et non par un clic.

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
