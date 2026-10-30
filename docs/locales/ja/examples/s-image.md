<script setup>
import SImageDemo from './demos/SImageDemo.vue'
</script>

以下の画像は、デモ目的でのみ、サードパーティのプレースホルダー画像サービスである [picsum.photos](https://picsum.photos) から読み込んでいます。

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
