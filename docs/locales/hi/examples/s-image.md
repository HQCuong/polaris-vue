<script setup>
import SImageDemo from './demos/SImageDemo.vue'
</script>

नीचे दी गई image [picsum.photos](https://picsum.photos) से load होती है, जो एक third-party placeholder image service है; इसका इस्तेमाल सिर्फ़ demo के लिए किया गया है।

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
