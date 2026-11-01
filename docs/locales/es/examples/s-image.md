<script setup>
import SImageDemo from './demos/SImageDemo.vue'
</script>

La imagen de abajo se carga desde [picsum.photos](https://picsum.photos), un servicio externo de imágenes de marcador de posición, solo con fines de demostración.

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
