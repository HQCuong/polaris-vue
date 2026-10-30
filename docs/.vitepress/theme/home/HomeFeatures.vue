<script setup lang="ts">
import componentsSidebar from '../../components-sidebar.json'
import { useStrings } from '../i18n'

const t = useStrings()

// Same titles and details the default `features` frontmatter rendered, and the
// titles stay <h2> as VPFeature had them, so the page's heading outline is
// unchanged for search engines.
const componentCount = componentsSidebar.reduce((sum, group) => sum + group.items.length, 0)
</script>

<template>
  <section class="HomeFeatures">
    <!-- Keeps the old hero keyword phrase visible on the page (the new <h1> is
         the Apple-style headline). -->
    <p class="kicker">{{ t.kicker }}</p>
    <p class="line">{{ t.featuresLine }}</p>

    <div class="bento">
      <article class="tile wide">
        <div class="body">
          <div class="stat">{{ componentCount }}</div>
          <h2 class="title">{{ t.features.typed.title }}</h2>
        <p class="details">{{ t.features.typed.details }}</p>
        </div>
        <!-- Editor autocomplete for SButton's real `variant` union. -->
        <div class="visual editor" aria-hidden="true">
          <div class="editor-line">
            <span class="c-tag">&lt;SButton</span> <span class="c-attr">variant</span>=<span class="c-str">"</span><span class="caret" />
          </div>
          <ul class="suggest">
            <li>auto</li>
            <li class="active">primary</li>
            <li>secondary</li>
            <li>tertiary</li>
          </ul>
        </div>
      </article>

      <article class="tile">
        <div class="stat">17</div>
        <h2 class="title">{{ t.features.vModel.title }}</h2>
        <p class="details">{{ t.features.vModel.details }}</p>
      </article>

      <article class="tile">
        <h2 class="title">{{ t.features.degrades.title }}</h2>
        <p class="details">{{ t.features.degrades.details }}</p>
      </article>

      <article class="tile wide">
        <div class="body">
          <h2 class="title">{{ t.features.synced.title }}</h2>
        <p class="details">{{ t.features.synced.details }}</p>
        </div>
        <!-- The codegen pipeline, manifest to wrappers. -->
        <div class="visual flow" aria-hidden="true">
          <span class="node">custom-elements.json</span>
          <span class="arrow">↓</span>
          <span class="node cmd">npm run generate</span>
          <span class="arrow">↓</span>
          <span class="node out">{{ t.typedWrappers(componentCount) }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.HomeFeatures {
  max-width: 1152px;
  margin: 0 auto;
  padding: 24px 24px 0;
  text-align: center;
}

@media (min-width: 768px) {
  .HomeFeatures {
    padding: 48px 48px 0;
  }
}

.kicker {
  margin: 0;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
}

.line {
  margin: 8px 0 0;
  color: var(--vp-c-text-1);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

@media (min-width: 768px) {
  .line {
    font-size: 44px;
  }
}

.bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 40px;
  text-align: left;
}

@media (min-width: 768px) {
  .bento {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Wide tiles pair the text with a small visual, so they don't read as a
   * narrow paragraph lost in a big box. */
  .tile.wide {
    grid-column: span 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: center;
  }
}

.visual {
  margin-top: 20px;
}

@media (min-width: 768px) {
  .visual {
    margin-top: 0;
  }
}

.editor {
  padding: 16px 18px;
  border: 1px solid var(--home-tile-border);
  border-radius: 14px;
  background: var(--vp-c-bg-alt);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
}

.c-tag {
  color: var(--home-code-tag);
}

.c-attr {
  color: var(--home-code-attr);
}

.c-str {
  color: var(--home-code-str);
}

.caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--vp-c-brand-1);
  animation: home-blink 1.1s steps(1) infinite;
}

.suggest {
  width: fit-content;
  min-width: 160px;
  margin: 8px 0 0 70px;
  padding: 4px;
  border: 1px solid var(--home-tile-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  box-shadow: 0 10px 24px -12px rgba(0, 0, 0, 0.25);
  list-style: none;
}

.suggest li {
  margin: 0;
  padding: 2px 10px;
  border-radius: 5px;
  color: var(--vp-c-text-2);
}

.suggest li.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}

.flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}

.node {
  padding: 6px 14px;
  border: 1px solid var(--home-tile-border);
  border-radius: 999px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.node.cmd {
  color: var(--vp-c-brand-1);
}

.node.out {
  border-color: var(--home-pill-border);
  background: var(--vp-c-brand-soft);
}

.arrow {
  color: var(--vp-c-text-3);
  line-height: 1;
}

@keyframes home-blink {
  50% {
    opacity: 0;
  }
}

.tile {
  padding: 28px;
  border: 1px solid var(--home-tile-border);
  border-radius: 20px;
  background: var(--home-tile-bg);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.tile:hover {
  transform: translateY(-3px);
  border-color: var(--home-pill-border);
  box-shadow: var(--home-tile-shadow);
}

.stat {
  margin-bottom: 12px;
  background: var(--home-accent-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
}

.title {
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.details {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }

  .tile {
    transition: none;
  }

  .tile:hover {
    transform: none;
  }
}
</style>
