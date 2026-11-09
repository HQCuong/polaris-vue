<script setup lang="ts">
import migration from '../../polaris-tokens-migration.json'
import { format, useLabels } from './labels'

// Name differences between @shopify/polaris-tokens (Polaris React) and the web components
// runtime, from docs/.vitepress/polaris-tokens-migration.json (written by
// `npm run docs:generate`). Rendered at build time; the lists are collapsed by default.
const t = useLabels()
const values = { package: migration.package, version: migration.version }
</script>

<template>
  <div class="CssVariablesMigration">
    <p class="shared">{{ format(t.migrationShared, { count: migration.shared }) }}</p>
    <details>
      <summary>{{ format(t.migrationLegacyOnly, { ...values, count: migration.legacyOnly.length }) }}</summary>
      <ul class="names">
        <li v-for="name in migration.legacyOnly" :key="name"><code>{{ name }}</code></li>
      </ul>
    </details>
    <details>
      <summary>{{ format(t.migrationRuntimeOnly, { ...values, count: migration.runtimeOnly.length }) }}</summary>
      <ul class="names">
        <li v-for="name in migration.runtimeOnly" :key="name"><code>{{ name }}</code></li>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.CssVariablesMigration {
  margin: 16px 0;
}

.shared {
  margin: 0 0 8px;
}

details {
  margin: 8px 0;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

summary {
  cursor: pointer;
  font-weight: 500;
}

summary:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.names {
  columns: 2 280px;
  column-gap: 24px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.names li {
  margin: 0;
  break-inside: avoid;
  white-space: nowrap;
  overflow-x: auto;
}

.names code {
  font-size: 12px;
}
</style>
