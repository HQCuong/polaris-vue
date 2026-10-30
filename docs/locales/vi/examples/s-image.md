<script setup>
import SImageDemo from './demos/SImageDemo.vue'
</script>

Ảnh bên dưới được tải từ [picsum.photos](https://picsum.photos), một dịch vụ ảnh mẫu của bên thứ ba, chỉ nhằm mục đích minh họa.

<div class="demo-surface">

<SImageDemo />

</div>

```vue
<script setup>
import { SImage } from 'polaris-vue-elements'
</script>

<template>
  <SImage
    src="https://picsum.photos/seed/polaris-image/400/300"
    alt="Placeholder scenic photo"
    aspectRatio="4/3"
    inlineSize="fill"
    objectFit="cover"
    borderRadius="200"
    style="width: 220px"
  />
</template>
```
