<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

import { useStrings } from './i18n'

// Beta notice at the top of every App Bridge page (/app-bridge/ and /<code>/app-bridge/).
// Kept here, not in the 70 markdown pages, so the text lives once per language in
// docs/locales/<code>/theme.json and goes away with one change when the beta ends.
const route = useRoute()
const t = useStrings()
const show = computed(() => /^(\/[a-z]{2})?\/app-bridge\//.test(route.path))
</script>

<template>
  <div v-if="show" class="custom-block warning app-bridge-beta">
    <p class="custom-block-title">{{ t.appBridgeBeta.title }}</p>
    <!-- The text is our own string from theme.json, with one link. -->
    <p v-html="t.appBridgeBeta.text" />
  </div>
</template>

<style scoped>
.app-bridge-beta {
  margin: 0 0 24px;
}
</style>
