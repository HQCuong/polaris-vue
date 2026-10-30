<script setup>
import SAvatarDemo from './demos/SAvatarDemo.vue'
</script>

Die folgenden Bilder werden zu reinen Demozwecken von [picsum.photos](https://picsum.photos) geladen, einem Platzhalterbild-Dienst eines Drittanbieters.

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
