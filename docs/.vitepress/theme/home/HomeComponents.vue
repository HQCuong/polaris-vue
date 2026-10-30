<script setup lang="ts">
import { computed } from 'vue'

import { useStrings } from '../i18n'

const t = useStrings()
const groups = computed(() => t.value.sidebar)
const componentCount = computed(() => groups.value.reduce((sum, group) => sum + group.items.length, 0))
</script>

<template>
  <!-- Every component page linked from the homepage, as plain server-rendered
       <a href>s: this is the homepage's main internal-link hub for crawlers. -->
  <div class="HomeComponents">
    <p class="line">{{ t.componentsLine(componentCount) }}</p>
    <div class="groups">
      <section v-for="group in groups" :key="group.text" class="group">
        <!-- The count sits outside the <h3> so the heading text stays the bare
             group name. -->
        <div class="group-head">
          <h3 class="group-title">{{ group.text }}</h3>
          <span class="count">{{ group.items.length }}</span>
        </div>
        <ul class="chips">
          <li v-for="item in group.items" :key="item.link">
            <a class="chip" :href="item.link">{{ item.text }}</a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.line {
  margin: 8px 0 0;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 18px;
}

.groups {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 32px;
}

@media (min-width: 768px) {
  .groups {
    grid-template-columns: repeat(2, 1fr);
  }
}

.group {
  padding: 20px 22px;
  border: 1px solid var(--home-tile-border);
  border-radius: 18px;
  background: var(--home-tile-bg);
}

.group-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 14px;
}

.group-title {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.count {
  color: var(--vp-c-text-3);
  font-size: 14px;
  font-weight: 500;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chips li {
  margin: 0;
}

.chip {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  font-size: 13.5px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  transition:
    border-color 0.2s,
    color 0.2s,
    background-color 0.2s;
}

.chip:hover {
  border-color: var(--home-pill-border);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
