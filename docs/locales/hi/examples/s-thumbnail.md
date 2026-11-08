<script setup>
import SThumbnailDemo from './demos/SThumbnailDemo.vue'
</script>

नीचे दी गई images [picsum.photos](https://picsum.photos) से load होती हैं, जो एक third-party placeholder image service है; इनका इस्तेमाल सिर्फ़ demo के लिए किया गया है।

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
