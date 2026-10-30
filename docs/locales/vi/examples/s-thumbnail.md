<script setup>
import SThumbnailDemo from './demos/SThumbnailDemo.vue'
</script>

Các ảnh bên dưới được tải từ [picsum.photos](https://picsum.photos), một dịch vụ ảnh mẫu của bên thứ ba, chỉ nhằm mục đích minh họa.

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
