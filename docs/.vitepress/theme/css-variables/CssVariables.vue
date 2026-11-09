<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'

import { groupOf } from '../../../../scripts/token-groups.mjs'
import { useLabels } from './labels'
import { copy, differs, matches, namesIn, resolved, state, valueOf } from './store'

// The variables of one group (tokens/tokens.json), rendered at build time so every name and
// value is in the static HTML. The page owns the group headings; this component owns the
// content and picks a renderer per group. Search, theme and copy format come from the
// page-wide store that <CssVariablesToolbar> edits; without a toolbar the defaults apply.
const props = defineProps<{
  /** Group key from scripts/token-groups.mjs (`color-bg`, `space`, …). */
  group: string
}>()

const t = useLabels()

type Kind = 'colors' | 'text' | 'bars' | 'boxes' | 'shadows' | 'fonts' | 'motion' | 'table'

const kind = computed<Kind>(() => {
  const g = props.group
  if (g === 'color-text') return 'text'
  if (g.startsWith('color')) return 'colors'
  if (g === 'space') return 'bars'
  if (g === 'border-radius' || g === 'border-width') return 'boxes'
  if (g === 'shadow') return 'shadows'
  if (g === 'font') return 'fonts'
  if (g === 'motion') return 'motion'
  return 'table'
})

// Colors cluster by tone, then by family (the name without its interaction state), then by
// state, so `…-critical`, `…-critical-hover`, `…-critical-active` sit together.
const TONES = ['critical', 'caution', 'warning', 'success', 'info', 'highlight', 'magic', 'ai', 'emphasis', 'brand', 'inverse', 'transparent']
const STATES = ['hover', 'active', 'selected', 'pressed', 'disabled']

function colorKey(name: string): [number, string, number] {
  const segments = name.slice('--p-color-'.length).split('-')
  const toneIndex = TONES.findIndex((tone) => segments.includes(tone))
  const last = segments.at(-1) ?? ''
  const stateIndex = STATES.indexOf(last)
  const family = stateIndex === -1 ? segments.join('-') : segments.slice(0, -1).join('-')
  return [toneIndex + 1, family, stateIndex + 1]
}

const groupNames = computed(() => {
  const list = namesIn(props.group)
  if (kind.value !== 'colors' && kind.value !== 'text') return list
  return list.toSorted((a, b) => {
    const [ta, fa, sa] = colorKey(a)
    const [tb, fb, sb] = colorKey(b)
    return ta - tb || fa.localeCompare(fb, 'en', { numeric: true }) || sa - sb
  })
})

const visible = computed(() => new Set(groupNames.value.filter(matches)))

// Text colors are shown on the surface they're meant for: `…-on-bg-fill` on the matching
// fill, `…-inverse` on the inverse fill, everything else on the default surface.
function textBackground(name: string): string {
  if (name.includes('-on-bg-fill')) {
    const fill = name.replace('--p-color-text', '--p-color-bg-fill').replace('-on-bg-fill', '')
    const fallback = '--p-color-bg-fill-inverse'
    return resolved(fill) || resolved(fallback)
  }
  if (name.includes('-on-accent')) {
    const fill = name.replace('--p-color-text', '--p-color-bg').replace('-on-accent', '-accent')
    return resolved(fill) || resolved('--p-color-bg-accent')
  }
  if (name.includes('inverse')) return resolved('--p-color-bg-fill-inverse')
  return resolved('--p-color-bg-surface')
}

function fontStyle(name: string): Record<string, string> {
  const value = resolved(name)
  if (name.startsWith('--p-font-size-')) return { fontSize: value }
  if (name.startsWith('--p-font-weight-')) return { fontWeight: value }
  if (name.startsWith('--p-font-family-')) return { fontFamily: value }
  if (name.startsWith('--p-font-letter-spacing-')) return { letterSpacing: value }
  if (name.startsWith('--p-font-line-height-')) return { lineHeight: value }
  if (name.startsWith('--p-font-feature-')) return { fontFeatureSettings: value }
  return {}
}

function fontSample(name: string): string {
  if (name.startsWith('--p-font-family-')) return 'The quick brown fox'
  if (name.startsWith('--p-font-letter-spacing-')) return 'Letter spacing'
  if (name.startsWith('--p-font-feature-')) return '0123 Il1 ag'
  return 'Aa'
}

function motionStyle(name: string): Record<string, string> | null {
  const value = resolved(name)
  if (name.startsWith('--p-motion-duration-')) return { transitionDuration: value }
  if (/^--p-motion-(ease|linear)/.test(name)) return { transitionTimingFunction: value }
  return null
}

function tablePreview(name: string): Record<string, string> | null {
  const value = resolved(name)
  if (groupOf(name) === 'width' || groupOf(name) === 'breakpoints') return { width: `min(${value}, 100%)` }
  if (groupOf(name) === 'height') return { height: `min(${value}, 4rem)`, width: '1.5rem' }
  return null
}

/** `--p-color-bg` → ['--', 'p-', 'color-', 'bg'], for a <wbr> after each hyphen run. */
function hyphenParts(name: string): string[] {
  return name.match(/[^-]*-+|[^-]+$/g) ?? [name]
}

// Hide this group's heading (and any intro paragraph under it) when the search leaves the
// group empty. The heading is markdown, so it's found by walking back from this element.
const root = ref<HTMLElement | null>(null)
onMounted(() => {
  if (!root.value) return
  const start = root.value.parentElement?.tagName === 'P' ? root.value.parentElement : root.value
  const intro: HTMLElement[] = []
  for (let el = start.previousElementSibling; el; el = el.previousElementSibling) {
    intro.push(el as HTMLElement)
    if (/^H[1-6]$/.test(el.tagName)) break
  }
  watchEffect(() => {
    const hide = visible.value.size === 0
    for (const el of intro) el.style.display = hide ? 'none' : ''
  })
})
</script>

<template>
  <div ref="root" class="CssVariables" :class="`kind-${kind}`" v-show="visible.size > 0">
    <!-- Colors: swatch tiles -->
    <!-- Colors: compact swatch tiles; the whole tile is the copy button. -->
    <ul v-if="kind === 'colors' || kind === 'text'" class="tiles colors">
      <li v-for="name in groupNames" v-show="visible.has(name)" :key="name">
        <button
          type="button"
          class="tile color-tile"
          :aria-label="`${t.copy} ${name}`"
          :title="name"
          @click="copy(name)"
        >
          <span v-if="kind === 'colors'" class="swatch checker" aria-hidden="true">
            <span :style="{ background: resolved(name) }" />
          </span>
          <span v-else class="swatch text-sample" aria-hidden="true" :style="{ background: textBackground(name) }">
            <span :style="{ color: resolved(name) }">Aa</span>
          </span>
          <span v-if="state.copied === name" class="copied-badge">{{ t.copied }}</span>
          <span class="tile-meta">
            <!-- Break only after hyphens, so the full name is always visible. -->
            <code class="name wrap"><template v-for="(part, i) in hyphenParts(name)" :key="i">{{ part }}<wbr /></template></code>
            <span class="value-line">
              <code class="value">{{ valueOf(name) }}</code>
              <span v-if="differs(name)" class="differs" :title="t.differs" />
            </span>
          </span>
        </button>
      </li>
    </ul>

    <!-- Shadows and radius/width boxes: small tiles -->
    <ul v-else-if="kind === 'shadows' || kind === 'boxes'" class="tiles small">
      <li v-for="name in groupNames" v-show="visible.has(name)" :key="name" class="tile">
        <span class="stage" aria-hidden="true">
          <span
            v-if="kind === 'shadows'"
            class="shadow-box"
            :style="{ boxShadow: resolved(name), background: resolved('--p-color-bg-surface') }"
          />
          <span
            v-else-if="group === 'border-radius'"
            class="radius-box"
            :style="{ borderRadius: resolved(name) }"
          />
          <span v-else class="width-box" :style="{ borderTopWidth: resolved(name) }" />
        </span>
        <span class="tile-meta">
          <span class="name-line">
            <code class="name" :title="name">{{ name }}</code>
          </span>
          <details v-if="kind === 'shadows' && valueOf(name).length > 24" class="value-details">
            <summary>
              {{ t.showValue }}
              <span v-if="differs(name)" class="differs" role="img" :title="t.differs" :aria-label="t.differs" />
            </summary>
            <code class="value">{{ valueOf(name) }}</code>
          </details>
          <span v-else class="value-line">
            <code class="value">{{ valueOf(name) }}</code>
            <span v-if="differs(name)" class="differs" role="img" :title="t.differs" :aria-label="t.differs" />
          </span>
        </span>
        <button type="button" class="copy" :aria-label="`${t.copy} ${name}`" @click="copy(name)">
          {{ state.copied === name ? t.copied : t.copy }}
        </button>
      </li>
    </ul>

    <!-- Space, font and motion: rows with a live sample -->
    <ul v-else-if="kind === 'bars' || kind === 'fonts' || kind === 'motion'" class="rows">
      <li v-for="name in groupNames" v-show="visible.has(name)" :key="name" class="row">
        <span class="row-meta">
          <span class="row-name">
            <code class="name" :title="name">{{ name }}</code>
          </span>
          <span class="value-line">
            <code class="value">{{ valueOf(name) }}</code>
            <span v-if="differs(name)" class="differs" role="img" :title="t.differs" :aria-label="t.differs" />
          </span>
        </span>
        <span class="row-sample" aria-hidden="true">
          <span v-if="kind === 'bars'" class="bar" :style="{ width: `min(${resolved(name)}, 100%)` }" />
          <span v-else-if="kind === 'fonts'" class="font-sample" :style="fontStyle(name)">{{ fontSample(name) }}</span>
          <span v-else-if="motionStyle(name)" class="track">
            <span class="dot" :style="motionStyle(name) ?? {}" />
          </span>
        </span>
        <button type="button" class="copy" :aria-label="`${t.copy} ${name}`" @click="copy(name)">
          {{ state.copied === name ? t.copied : t.copy }}
        </button>
      </li>
    </ul>

    <!-- Everything else: a compact table -->
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{{ t.variable }}</th>
            <th>{{ t.value }}</th>
            <th>{{ t.preview }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="name in groupNames" v-show="visible.has(name)" :key="name">
            <td class="cell-name">
              <code class="name">{{ name }}</code>
              <button type="button" class="copy" :aria-label="`${t.copy} ${name}`" @click="copy(name)">
                {{ state.copied === name ? t.copied : t.copy }}
              </button>
            </td>
            <td class="cell-value">
              <code class="value">{{ valueOf(name) }}</code>
              <span v-if="differs(name)" class="differs" role="img" :title="t.differs" :aria-label="t.differs" />
            </td>
            <td class="cell-preview">
              <span v-if="tablePreview(name)" class="bar" :style="tablePreview(name) ?? {}" aria-hidden="true" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.CssVariables {
  margin: 16px 0 32px;
  --cv-radius: 10px;
}

ul.tiles,
ul.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.tiles > li,
ul.rows > li {
  margin: 0;
}

code.name,
code.value {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  background: none;
  padding: 0;
  color: var(--vp-c-text-1);
}

code.value {
  color: var(--vp-c-text-2);
  overflow-wrap: anywhere;
}

/* Names never wrap; long ones scroll inside their own box. */
.name-line,
.row-name,
.cell-name {
  display: block;
  white-space: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
}

.differs {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 6px;
  vertical-align: middle;
  border-radius: 50%;
  border: 1.5px solid var(--vp-c-text-2);
  background: linear-gradient(90deg, var(--vp-c-text-2) 50%, transparent 50%);
}

.copy {
  flex: none;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

.copy:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.copy:focus-visible,
.value-details summary:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/* ---- Tiles ---- */
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.tiles.small {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--cv-radius);
  background: var(--vp-c-bg-soft);
}

/* Compact color tiles: ~4 per row on desktop, 2 on phones. */
.tiles.colors {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}

.color-tile {
  position: relative;
  width: 100%;
  height: 100%;
  gap: 6px;
  padding: 6px 6px 8px;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: copy;
}

.color-tile:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.color-tile .swatch {
  height: 40px;
}

.color-tile .text-sample > span {
  font-size: 20px;
}

.color-tile code.name.wrap {
  display: block;
  font-size: 11.5px;
  line-height: 1.35;
  white-space: normal;
}

.color-tile code.value {
  font-size: 11.5px;
}

.copied-badge {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  pointer-events: none;
}

.tile:hover {
  border-color: var(--vp-c-brand-soft);
}

.tile .copy {
  align-self: flex-start;
}

.tile-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.swatch {
  display: block;
  height: 56px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.swatch > span {
  display: block;
  width: 100%;
  height: 100%;
}

/* Checkerboard behind the color, so transparent values read as transparent. */
.checker {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #e6e6e6 25%, transparent 25%),
    linear-gradient(-45deg, #e6e6e6 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e6e6e6 75%),
    linear-gradient(-45deg, transparent 75%, #e6e6e6 75%);
  background-size: 12px 12px;
  background-position:
    0 0,
    0 6px,
    6px -6px,
    -6px 0;
}

.text-sample {
  display: flex;
  align-items: center;
  padding: 0 14px;
}

.text-sample > span {
  width: auto;
  height: auto;
  font-size: 26px;
  font-weight: 600;
  line-height: 1;
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  border-radius: 6px;
  background: var(--vp-c-bg);
}

.shadows .stage,
.kind-shadows .stage {
  background: #f1f1f1;
}

.shadow-box {
  width: 64px;
  height: 40px;
  border-radius: 8px;
}

.radius-box {
  width: 64px;
  height: 44px;
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.width-box {
  width: 64px;
  border-top-style: solid;
  border-top-color: var(--vp-c-text-1);
}

.value-details summary {
  cursor: pointer;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.value-details code {
  display: block;
  margin-top: 4px;
}

/* ---- Rows ---- */
.rows {
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--cv-radius);
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.row:first-child {
  border-top: none;
}

.row-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.row-sample {
  min-width: 0;
  overflow: hidden;
}

.bar {
  display: block;
  height: 10px;
  min-width: 1px;
  max-width: 100%;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
}

.font-sample {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 18px;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.font-sample[style*='line-height'] {
  font-size: 13px;
  background: var(--vp-c-brand-soft);
}

.track {
  position: relative;
  display: block;
  height: 12px;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
}

.dot {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  transition-property: left;
  transition-duration: 600ms;
  transition-timing-function: ease;
}

.row:hover .dot,
.row:focus-within .dot {
  left: calc(100% - 11px);
}

@media (prefers-reduced-motion: reduce) {
  .dot {
    transition: none;
  }

  .row:hover .dot,
  .row:focus-within .dot {
    left: 1px;
  }
}

/* ---- Compact table ---- */
.table-wrap {
  overflow-x: auto;
}

.table-wrap table {
  display: table;
  width: 100%;
  margin: 0;
  font-size: 13px;
}

.table-wrap td {
  vertical-align: middle;
}

.cell-name .copy {
  display: block;
  margin-top: 4px;
}

.cell-value {
  min-width: 140px;
}

.cell-preview {
  width: 88px;
}

/* ---- Narrow screens ---- */
@media (max-width: 640px) {
  .tiles,
  .tiles.colors {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .tiles.small {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .row {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'meta copy'
      'sample sample';
    row-gap: 6px;
  }

  .row-meta {
    grid-area: meta;
  }

  .row-sample {
    grid-area: sample;
  }

  .row .copy {
    grid-area: copy;
  }

  .row-sample:empty {
    display: none;
  }

  .table-wrap table,
  .table-wrap tbody,
  .table-wrap tr,
  .table-wrap td {
    display: block;
    width: auto;
  }

  .table-wrap thead {
    display: none;
  }

  .table-wrap tr {
    margin-bottom: 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    padding: 4px 0;
  }

  .table-wrap tr:nth-child(2n) {
    background: transparent;
  }

  .table-wrap td {
    border: none;
    padding: 6px 12px;
  }

  .cell-value {
    min-width: 0;
  }

  .cell-preview:empty {
    display: none;
  }
}
</style>
