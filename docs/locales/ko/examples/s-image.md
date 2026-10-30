<script setup>
import SImageDemo from './demos/SImageDemo.vue'
</script>

아래 이미지는 서드파티 플레이스홀더 이미지 서비스인 [picsum.photos](https://picsum.photos)에서 불러오며, 데모용으로만 사용됩니다.

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
