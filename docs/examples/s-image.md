<script setup>
import SImageDemo from './demos/SImageDemo.vue'
</script>

The image below loads from [picsum.photos](https://picsum.photos), a third-party placeholder image service, purely for demo purposes.

<SImageDemo />

```vue
<script setup>
import { SImage } from 'polaris-vue'
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
