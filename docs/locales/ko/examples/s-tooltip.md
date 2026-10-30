<script setup>
import STooltipDemo from './demos/STooltipDemo.vue'
</script>

아래 버튼에 마우스를 올리거나 포커스하면 tooltip이 표시됩니다. tooltip은 클릭이 아니라 `interestFor`로 활성화됩니다.

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
