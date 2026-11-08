<script setup>
import SThumbnailDemo from './demos/SThumbnailDemo.vue'
</script>

As imagens abaixo são carregadas de [picsum.photos](https://picsum.photos), um serviço externo de imagens de placeholder, apenas para fins de demonstração.

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
