<script setup>
import SAvatarDemo from './demos/SAvatarDemo.vue'
</script>

नीचे दी गई images [picsum.photos](https://picsum.photos) से load होती हैं, जो एक third-party placeholder image service है; इनका इस्तेमाल सिर्फ़ demo के लिए किया गया है।

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
