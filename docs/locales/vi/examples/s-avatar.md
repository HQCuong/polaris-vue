<script setup>
import SAvatarDemo from './demos/SAvatarDemo.vue'
</script>

Các ảnh bên dưới được tải từ [picsum.photos](https://picsum.photos), một dịch vụ ảnh mẫu của bên thứ ba, chỉ nhằm mục đích minh họa.

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
