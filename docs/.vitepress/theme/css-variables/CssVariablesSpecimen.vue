<script setup lang="ts">
import { computed, ref } from 'vue'

import { useLabels, type Labels } from './labels'
import { copy, resolved, state } from './store'

// A small app card styled only with Polaris tokens (plain HTML, not Polaris components),
// next to the variables it uses. Hovering or focusing a variable outlines where the card
// uses it, and hovering a part of the card highlights its variables. Follows the toolbar's
// Base / admin-next choice.
const t = useLabels()

type Part = 'surface' | 'shadow' | 'radius' | 'padding' | 'text' | 'chip' | 'divider' | 'button'

const legend: { part: Part; name: string; label: keyof Labels }[] = [
  { part: 'surface', name: '--p-color-bg-surface', label: 'legendSurface' },
  { part: 'shadow', name: '--p-shadow-100', label: 'legendShadow' },
  { part: 'radius', name: '--p-border-radius-300', label: 'legendRadius' },
  { part: 'padding', name: '--p-space-400', label: 'legendPadding' },
  { part: 'text', name: '--p-color-text', label: 'legendText' },
  { part: 'chip', name: '--p-color-bg-fill-success-secondary', label: 'legendChip' },
  { part: 'divider', name: '--p-color-border', label: 'legendDivider' },
  { part: 'button', name: '--p-color-button-primary-bg', label: 'legendButton' },
]

const active = ref<Part | null>(null)
const v = (name: string) => resolved(name, state.theme)

const cardParts = new Set<Part>(['surface', 'shadow', 'radius', 'padding'])
const cardActive = computed(() => active.value !== null && cardParts.has(active.value))

const styles = computed(() => ({
  card: {
    background: v('--p-color-bg-surface'),
    boxShadow: v('--p-shadow-100'),
    borderRadius: v('--p-border-radius-300'),
    padding: v('--p-space-400'),
    fontFamily: v('--p-font-family-sans'),
    '--pad': v('--p-space-400'),
  },
  title: {
    color: v('--p-color-text'),
    fontSize: v('--p-font-size-350'),
    fontWeight: v('--p-font-weight-semibold'),
    lineHeight: v('--p-font-line-height-500'),
  },
  text: {
    color: v('--p-color-text-secondary'),
    fontSize: v('--p-font-size-325'),
    lineHeight: v('--p-font-line-height-400'),
  },
  chip: {
    background: v('--p-color-bg-fill-success-secondary'),
    color: v('--p-color-text-success'),
    borderRadius: v('--p-border-radius-200'),
    padding: `${v('--p-space-050')} ${v('--p-space-200')}`,
    fontSize: v('--p-font-size-300'),
    fontWeight: v('--p-font-weight-medium'),
  },
  divider: {
    borderTop: `${v('--p-border-width-025')} solid ${v('--p-color-border')}`,
    margin: `${v('--p-space-300')} 0`,
  },
  button: {
    background: v('--p-color-button-primary-bg'),
    color: v('--p-color-button-primary-text'),
    borderRadius: v('--p-border-radius-200'),
    padding: `${v('--p-space-150')} ${v('--p-space-300')}`,
    fontSize: v('--p-font-size-325'),
    fontWeight: v('--p-font-weight-semibold'),
    boxShadow: v('--p-shadow-button-primary'),
  },
}))

function is(...parts: Part[]): boolean {
  return active.value !== null && parts.includes(active.value)
}
</script>

<template>
  <figure class="CssVariablesSpecimen" @mouseleave="active = null">
    <div class="stage">
      <div
        class="card"
        role="img"
        :aria-label="t.specimenLabel"
        :class="{ 'is-active': cardActive, 'show-padding': is('padding') }"
        :style="styles.card"
        @mouseover="active = 'surface'"
      >
        <div class="header">
          <span class="title" :class="{ 'is-active': is('text') }" :style="styles.title" @mouseover.stop="active = 'text'">
            {{ t.specimenTitle }}
          </span>
          <span class="chip" :class="{ 'is-active': is('chip') }" :style="styles.chip" @mouseover.stop="active = 'chip'">
            {{ t.specimenChip }}
          </span>
        </div>
        <p class="text" :style="styles.text">{{ t.specimenText }}</p>
        <div class="divider" :class="{ 'is-active': is('divider') }" :style="styles.divider" @mouseover.stop="active = 'divider'" />
        <div class="footer">
          <span class="button" :class="{ 'is-active': is('button') }" :style="styles.button" @mouseover.stop="active = 'button'">
            {{ t.specimenButton }}
          </span>
        </div>
      </div>
    </div>
    <figcaption class="legend">
      <p class="hint">{{ t.specimenHint }}</p>
      <ul>
        <li v-for="item in legend" :key="item.part">
          <button
            type="button"
            class="legend-item"
            :class="{ 'is-active': active === item.part }"
            :aria-label="`${t[item.label]}: ${item.name}. ${t.copy}`"
            @mouseenter="active = item.part"
            @focus="active = item.part"
            @blur="active = null"
            @click="copy(item.name)"
          >
            <span class="legend-label">{{ t[item.label] }}</span>
            <code>{{ state.copied === item.name ? t.copied : item.name }}</code>
          </button>
        </li>
      </ul>
    </figcaption>
  </figure>
</template>

<style scoped>
.CssVariablesSpecimen {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
  margin: 24px 0;
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  border-radius: 12px;
  /* The admin's page background, so the white card reads as it does in the app. */
  background: #f1f1f1;
}

.card {
  position: relative;
  width: 100%;
  max-width: 300px;
  transition: outline-color 0.15s;
  outline: 2px dashed transparent;
  outline-offset: 4px;
}

.card.show-padding {
  box-shadow: inset 0 0 0 var(--pad) rgba(0, 122, 92, 0.14) !important;
}

.is-active {
  outline: 2px dashed var(--vp-c-brand-1) !important;
  outline-offset: 3px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.text {
  margin: 4px 0 0;
}

.footer {
  display: flex;
  justify-content: flex-end;
}

.chip,
.button {
  display: inline-block;
  white-space: nowrap;
}

.legend {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.hint {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.legend ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.legend li {
  margin: 0;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  width: 100%;
  padding: 5px 8px;
  border-radius: 6px;
  text-align: left;
}

.legend-item:hover,
.legend-item.is-active {
  background: var(--vp-c-default-soft);
  outline: none !important;
}

.legend-item:focus-visible {
  outline: 2px solid var(--vp-c-brand-1) !important;
}

.legend-label {
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.legend-item code {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  background: none;
  padding: 0;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .CssVariablesSpecimen {
    grid-template-columns: 1fr;
  }
}
</style>
