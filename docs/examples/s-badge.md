<script setup>
import SBadgeDemo from './demos/SBadgeDemo.vue'
</script>

<SBadgeDemo />

```vue
<script setup>
import { SBadge } from 'polaris-vue-elements'
</script>

<template>
  <SBadge tone="neutral">Neutral</SBadge>
  <SBadge tone="info">Info</SBadge>
  <SBadge tone="success">Success</SBadge>
  <SBadge tone="caution">Caution</SBadge>
  <SBadge tone="warning">Warning</SBadge>
  <SBadge tone="critical">Critical</SBadge>

  <SBadge tone="success" icon="check-circle">With icon</SBadge>
  <SBadge tone="info" size="large">Large</SBadge>
  <SBadge tone="info" color="strong">Strong color</SBadge>
</template>
```
