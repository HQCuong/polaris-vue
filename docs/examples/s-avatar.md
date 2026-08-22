<script setup>
import SAvatarDemo from './demos/SAvatarDemo.vue'
</script>

The images below load from [picsum.photos](https://picsum.photos), a third-party placeholder image service, purely for demo purposes.

<SAvatarDemo />

```vue
<script setup>
import { SAvatar } from 'polaris-vue'
</script>

<template>
  <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="small" />
  <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="base" />
  <SAvatar src="https://picsum.photos/seed/polaris-avatar/200" alt="Photo of a customer" size="large" />

  <!-- No src: falls back to initials -->
  <SAvatar initials="AL" alt="Ada Lovelace" size="large" />
</template>
```
