<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { format, useLabels } from './labels'
import { matchCount, state, type CopyFormat, type ThemeName } from './store'

// Sticky search / theme / copy-format bar above the token groups. Filtering only hides
// rows on the client; every row stays in the static HTML.
const t = useLabels()

const countText = computed(() =>
  matchCount.value === 1 ? t.value.countOne : format(t.value.count, { count: matchCount.value }),
)
// The empty-state template has a `{query}` slot, rendered as code.
const emptyParts = computed(() => t.value.empty.split('{query}'))

const themes: { value: ThemeName; label: () => string }[] = [
  { value: 'base', label: () => t.value.baseTheme },
  { value: 'admin-next', label: () => 'admin-next' },
]
const formats: { value: CopyFormat; label: string }[] = [
  { value: 'name', label: '--p-x' },
  { value: 'var', label: 'var(--p-x)' },
]

// Sit right under whatever VitePress keeps stuck to the top: the local nav ("Menu / On
// this page") when it's shown, otherwise the fixed top nav.
const top = ref('var(--vp-nav-height)')
function measure(): void {
  const local = document.querySelector<HTMLElement>('.VPLocalNav')
  if (local && local.offsetHeight > 0 && getComputedStyle(local).display !== 'none') {
    top.value = `${(Number.parseFloat(getComputedStyle(local).top) || 0) + local.offsetHeight}px`
    return
  }
  const nav = document.querySelector<HTMLElement>('.VPNav')
  top.value = nav && getComputedStyle(nav).position === 'fixed' ? `${nav.offsetHeight}px` : '0px'
}

// Search, theme and format live in the query string so a filtered view can be shared.
function readUrl(): void {
  const params = new URLSearchParams(location.search)
  state.query = params.get('q') ?? ''
  const theme = params.get('theme')
  if (theme === 'base' || theme === 'admin-next') state.theme = theme
  if (params.get('copy') === 'var') state.format = 'var'
}

function writeUrl(): void {
  const params = new URLSearchParams(location.search)
  const set = (key: string, value: string, fallback: string) =>
    value && value !== fallback ? params.set(key, value) : params.delete(key)
  set('q', state.query.trim(), '')
  set('theme', state.theme, 'admin-next')
  set('copy', state.format, 'name')
  const search = params.toString()
  history.replaceState(history.state, '', `${location.pathname}${search ? `?${search}` : ''}${location.hash}`)
}

let stop: (() => void) | undefined
onMounted(() => {
  readUrl()
  measure()
  window.addEventListener('resize', measure)
  stop = watch(() => [state.query, state.theme, state.format], writeUrl)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
  stop?.()
})
</script>

<template>
  <div class="CssVariablesToolbar" :style="{ top }">
    <div class="bar">
      <label class="search">
        <span class="visually-hidden">{{ t.search }}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input v-model="state.query" type="search" :placeholder="t.searchPlaceholder" spellcheck="false" autocomplete="off" />
      </label>
      <div class="controls">
        <div class="segmented" role="group" :aria-label="t.theme">
          <span class="segmented-label" aria-hidden="true">{{ t.theme }}</span>
          <button
            v-for="option in themes"
            :key="option.value"
            type="button"
            :aria-pressed="state.theme === option.value"
            @click="state.theme = option.value"
          >
            {{ option.label() }}
          </button>
        </div>
        <div class="segmented" role="group" :aria-label="t.copyAs">
          <span class="segmented-label" aria-hidden="true">{{ t.copyAs }}</span>
          <button
            v-for="option in formats"
            :key="option.value"
            type="button"
            class="mono"
            :aria-pressed="state.format === option.value"
            @click="state.format = option.value"
          >
            {{ option.label }}
          </button>
        </div>
        <span class="count" aria-live="polite">{{ countText }}</span>
      </div>
    </div>
    <p v-if="matchCount === 0" class="empty">
      {{ emptyParts[0] }}<code>{{ state.query.trim() }}</code>{{ emptyParts[1] }}
      <button type="button" class="clear" @click="state.query = ''">{{ t.clear }}</button>
    </p>
    <span class="visually-hidden" aria-live="polite">{{
      state.copied ? format(t.copiedAnnounce, { value: state.copiedText }) : ''
    }}</span>
  </div>
</template>

<style scoped>
.CssVariablesToolbar {
  position: sticky;
  z-index: 10;
  margin: 24px 0 8px;
  padding: 10px 0;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
}

.search {
  position: relative;
  flex: 1 1 260px;
  min-width: 0;
}

.search svg {
  position: absolute;
  top: 50%;
  left: 10px;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 2;
  stroke-linecap: round;
}

.search input {
  width: 100%;
  height: 36px;
  padding: 0 10px 0 34px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.search input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
  border-color: transparent;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
}

.segmented {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.segmented-label {
  padding: 0 6px 0 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.segmented button {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

.segmented button.mono {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.segmented button[aria-pressed='true'] {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 0 0 1px var(--vp-c-divider);
}

.segmented button:focus-visible,
.clear:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.count {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.empty {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.clear {
  margin-left: 8px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .segmented-label {
    display: none;
  }
}
</style>
