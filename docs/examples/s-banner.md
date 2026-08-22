<script setup>
import SBannerDemo from './demos/SBannerDemo.vue'
</script>

<SBannerDemo />

```vue
<script setup>
import { ref } from 'vue'
import { SBanner, SButton, SText } from 'polaris-vue-elements'

const showCritical = ref(true)
</script>

<template>
  <!-- SBanner needs default-slot content — a `heading` alone renders an empty
       banner. See docs/guide/quirks.md. -->
  <SBanner heading="Order updated" tone="success">
    <SText>Your changes have been saved.</SText>
  </SBanner>

  <!-- dismissible banners fire `dismiss` immediately, then `afterhide` once any
       animation completes; drive `hidden` (or v-if, as here) from that event. -->
  <SBanner
    v-if="showCritical"
    heading="Something went wrong"
    tone="critical"
    dismissible
    @dismiss="showCritical = false"
  >
    <SText>We couldn't process the payment. Please try again.</SText>
    <template #secondary-actions>
      <SButton variant="secondary">Retry</SButton>
    </template>
  </SBanner>
</template>
```
