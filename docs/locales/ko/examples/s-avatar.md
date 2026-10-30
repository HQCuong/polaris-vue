<script setup>
import SAvatarDemo from './demos/SAvatarDemo.vue'
</script>

아래 이미지는 서드파티 플레이스홀더 이미지 서비스인 [picsum.photos](https://picsum.photos)에서 불러오며, 데모용으로만 사용됩니다.

<div class="demo-surface">

<SAvatarDemo />

</div>

```vue
<script setup>
import { SAvatar } from 'polaris-vue-elements'
</script>

<template>
  <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="small" />
  <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="base" />
  <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="large" />

  <!-- No src: falls back to initials -->
  <SAvatar initials="AL" alt="Ada Lovelace" size="large" />
</template>
```
