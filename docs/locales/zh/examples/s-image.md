<script setup>
import SImageDemo from './demos/SImageDemo.vue'
</script>

下方图片从 [picsum.photos](https://picsum.photos) 加载，这是一个第三方占位图片服务，仅用于演示。

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
