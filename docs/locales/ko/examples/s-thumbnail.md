<script setup>
import SThumbnailDemo from './demos/SThumbnailDemo.vue'
</script>

아래 이미지는 서드파티 플레이스홀더 이미지 서비스인 [picsum.photos](https://picsum.photos)에서 불러오며, 데모용으로만 사용됩니다.

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
