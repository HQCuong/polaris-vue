<script setup>
import SAvatarDemo from './demos/SAvatarDemo.vue'
</script>

下方图片从 [picsum.photos](https://picsum.photos) 加载，这是一个第三方占位图片服务，仅用于演示。

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
