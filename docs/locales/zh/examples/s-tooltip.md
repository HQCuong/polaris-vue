<script setup>
import STooltipDemo from './demos/STooltipDemo.vue'
</script>

将鼠标悬停在下方按钮上或使其获得焦点即可显示 tooltip：它通过 `interestFor` 触发，而不是点击。

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
