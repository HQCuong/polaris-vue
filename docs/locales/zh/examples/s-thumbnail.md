<script setup>
import SThumbnailDemo from './demos/SThumbnailDemo.vue'
</script>

下方图片从 [picsum.photos](https://picsum.photos) 加载，这是一个第三方占位图片服务，仅用于演示。

<div class="demo-surface">

<SThumbnailDemo />

</div>

```vue
<script setup>
import { SThumbnail } from 'polaris-vue-elements'
</script>

<template>
  <SThumbnail src="https://picsum.photos/seed/polaris-thumb/100" alt="Product photo" size="small" />
  <SThumbnail src="https://picsum.photos/seed/polaris-thumb/100" alt="Product photo" size="base" />
  <SThumbnail src="https://picsum.photos/seed/polaris-thumb/100" alt="Product photo" size="large" />

  <!-- No src: renders a placeholder -->
  <SThumbnail alt="Product photo not yet uploaded" size="base" />
</template>
```
