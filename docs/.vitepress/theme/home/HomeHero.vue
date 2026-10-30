<script setup lang="ts">
// Homepage hero, replacing VitePress's default `hero` frontmatter block. The
// default hero can't hold the Built for Shopify pill or the typing code card,
// and its <h1> concatenates `name` + `text`; here the page's single <h1> is the
// headline itself.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useStrings } from '../i18n'

const t = useStrings()

const BFS_REQUIREMENTS = 'https://shopify.dev/docs/apps/launch/built-for-shopify/requirements'

// The code card types itself out. The server-rendered HTML has the full
// snippet (a ghost layer that also reserves the card's final size, so typing
// never shifts the layout); after hydration an overlay reveals it character
// by character.
type Token = { text: string; cls?: 'tag' | 'attr' | 'str' }

const CODE: Token[] = [
  { text: '<STextField', cls: 'tag' },
  { text: ' ' },
  { text: 'v-model', cls: 'attr' },
  { text: '=' },
  { text: '"name"', cls: 'str' },
  { text: ' ' },
  { text: '/>', cls: 'tag' },
  { text: '\n' },
  { text: '<SButton', cls: 'tag' },
  { text: ' ' },
  { text: 'variant', cls: 'attr' },
  { text: '=' },
  { text: '"primary"', cls: 'str' },
  { text: '>', cls: 'tag' },
  { text: 'Save' },
  { text: '</SButton>', cls: 'tag' },
]
const TOTAL = CODE.reduce((n, token) => n + token.text.length, 0)

const typing = ref(false)
const typed = ref(TOTAL)
let timer: ReturnType<typeof setTimeout> | undefined

const visible = computed(() => {
  let left = typed.value
  const out: Token[] = []
  for (const token of CODE) {
    if (left <= 0) break
    out.push({ ...token, text: token.text.slice(0, left) })
    left -= token.text.length
  }
  return out
})

function tick(): void {
  typed.value++
  if (typed.value < TOTAL) {
    // A little jitter reads as a person typing rather than a progress bar.
    timer = setTimeout(tick, 28 + Math.random() * 45)
  }
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  typing.value = true
  typed.value = 0
  timer = setTimeout(tick, 700)
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="HomeHero">
    <div class="backdrop" aria-hidden="true">
      <div class="grid" />
      <div class="glow" />
    </div>

    <div class="container">
      <a class="pill rise" :href="BFS_REQUIREMENTS" target="_blank" rel="noopener">
        <!-- Our own outline diamond, deliberately not Shopify's badge artwork:
             the library is not certified by Shopify. -->
        <svg class="diamond" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 2.5h8l2.5 3.5L8 13.5 1.5 6z" />
          <path d="M1.5 6h13M6 2.5 8 6l2-3.5M8 6v7.5" />
        </svg>
        <span>{{ t.pill.lead }} <strong>{{ t.pill.emphasis }}</strong></span>
        <span class="chevron" aria-hidden="true">›</span>
      </a>

      <!-- No opacity animation on the <h1>: it is the LCP element, and an element
           at opacity 0 does not count as painted. -->
      <h1 class="headline">
        {{ t.headline.first }}<br />
        <span class="accent">{{ t.headline.second }}</span>
      </h1>

      <p class="tagline rise">
        {{ t.tagline.before }}<span class="nowrap">s-button</span>, <span class="nowrap">s-text-field</span>,
        <span class="nowrap">s-modal</span>{{ t.tagline.after }}
      </p>

      <div class="actions rise">
        <a class="action primary" :href="`${t.linkPrefix}/guide/getting-started`">{{ t.getStarted }}</a>
        <a class="action link" :href="`${t.linkPrefix}/components/`">{{ t.components }} <span aria-hidden="true">›</span></a>
      </div>

      <div class="code rise" :class="{ typing }" :aria-label="t.codeLabel">
        <pre class="ghost"><code><span v-for="(tok, i) in CODE" :key="i" :class="tok.cls">{{ tok.text }}</span></code></pre>
        <pre v-if="typing" class="typed" aria-hidden="true"><code><span v-for="(tok, i) in visible" :key="i" :class="tok.cls">{{ tok.text }}</span><span class="cursor" /></code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.HomeHero {
  position: relative;
  overflow: hidden;
  margin-top: calc(var(--vp-nav-height) * -1);
  padding: calc(var(--vp-nav-height) + 56px) 24px 72px;
  text-align: center;
}

@media (min-width: 768px) {
  .HomeHero {
    padding: calc(var(--vp-nav-height) + 88px) 48px 96px;
  }
}

/* --- Backdrop: a faint grid fading out from the centre, and a glow rising
 * from below. Both are decorative and sit behind the content. --- */
.backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Fade the bottom out so the glow doesn't end in a hard line where the hero
   * section clips it. */
  mask-image: linear-gradient(to bottom, #000 65%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, #000 65%, transparent);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--home-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--home-grid-line) 1px, transparent 1px);
  background-size: 28px 28px;
  background-position: center top;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%);
}

.glow {
  position: absolute;
  left: 50%;
  bottom: -320px;
  width: min(1100px, 140vw);
  height: 560px;
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--home-glow-strong), var(--home-glow-soft), transparent);
  filter: blur(12px);
  transform: translateX(-50%);
  animation: home-breathe 8s ease-in-out infinite;
}

.container {
  position: relative;
  max-width: 880px;
  margin: 0 auto;
}

/* --- Built for Shopify pill --- */
.pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  padding: 6px 14px 6px 10px;
  border: 1px solid var(--home-pill-border);
  border-radius: 999px;
  background: var(--home-pill-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  transition: border-color 0.25s, background-color 0.25s;
}

.pill:hover {
  border-color: var(--vp-c-brand-1);
}

.pill strong {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.pill .chevron {
  color: var(--vp-c-brand-1);
  transition: transform 0.25s;
}

.pill:hover .chevron {
  transform: translateX(2px);
}

.diamond {
  flex: none;
  width: 15px;
  height: 15px;
  stroke: var(--vp-c-brand-1);
  stroke-width: 1.4;
  stroke-linejoin: round;
}

/* A highlight that sweeps across the pill every few seconds. */
.pill::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60px;
  width: 48px;
  background: linear-gradient(90deg, transparent, var(--home-pill-sheen), transparent);
  animation: home-pill-sheen 6s ease-in-out 1.5s infinite;
}

/* --- Headline --- */
.headline {
  margin: 24px 0 0;
  text-wrap: balance;
  color: var(--vp-c-text-1);
  font-size: 44px;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.035em;
}

@media (min-width: 640px) {
  .headline {
    font-size: 64px;
  }
}

@media (min-width: 960px) {
  .headline {
    font-size: 80px;
  }
}

.accent {
  background: var(--home-accent-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: home-sheen 8s linear infinite;
}

.tagline {
  max-width: 620px;
  margin: 24px auto 0;
  color: var(--vp-c-text-2);
  font-size: 18px;
  line-height: 1.6;
}

/* Tag names would otherwise break at their hyphen ("s-" / "button"). */
.nowrap {
  white-space: nowrap;
}

/* --- Actions --- */
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px 20px;
  margin-top: 32px;
}

.action {
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.25s, color 0.25s;
}

.action.primary {
  padding: 11px 24px;
  border-radius: 999px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

.action.primary:hover {
  background: var(--vp-button-brand-hover-bg);
}

.action.link {
  color: var(--vp-c-brand-1);
}

.action.link:hover {
  color: var(--vp-c-brand-2);
}

/* --- Code card --- */
.code {
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin: 48px auto 0;
  border: 1px solid var(--home-glass-border);
  border-radius: 16px;
  background: var(--home-glass-bg);
  box-shadow: var(--home-glass-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-align: left;
  overflow-x: auto;
}

.code pre {
  margin: 0;
  white-space: pre;
  padding: 18px 22px;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.code.typing .ghost {
  visibility: hidden;
}

.typed {
  position: absolute;
  inset: 0;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 1.15em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--vp-c-brand-1);
  opacity: 0.8;
  animation: home-cursor 1.1s steps(1) infinite;
}

@keyframes home-cursor {
  50% {
    opacity: 0;
  }
}

.code .tag {
  color: var(--home-code-tag);
}

.code .attr {
  color: var(--home-code-attr);
}

.code .str {
  color: var(--home-code-str);
}

/* --- Load-in: transform plus opacity on secondary elements only. They keep
 * their box from the first paint, so nothing shifts. --- */
.rise {
  animation: home-rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.tagline.rise {
  animation-delay: 0.1s;
}

.actions.rise {
  animation-delay: 0.2s;
}

.code.rise {
  animation-delay: 0.32s;
}

@keyframes home-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}

@keyframes home-breathe {
  50% {
    opacity: 0.75;
    transform: translateX(-50%) scale(1.06);
  }
}

@keyframes home-sheen {
  to {
    background-position: -200% 0;
  }
}

@keyframes home-pill-sheen {
  0%,
  70% {
    left: -60px;
  }
  100% {
    left: 110%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow,
  .accent,
  .pill::after,
  .rise,
  .cursor {
    animation: none;
  }
}
</style>
