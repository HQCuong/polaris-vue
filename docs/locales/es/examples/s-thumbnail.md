<script setup>
import SThumbnailDemo from './demos/SThumbnailDemo.vue'
</script>

Las imágenes de abajo se cargan desde [picsum.photos](https://picsum.photos), un servicio externo de imágenes de marcador de posición, solo con fines de demostración.

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
