<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Floating "back to top" button on every page, shown once the reader has
// scrolled past roughly one screen. Same frosted glass as the nav bar.
const visible = ref(false)

function onScroll(): void {
  visible.value = window.scrollY > 600
}

function toTop(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <button
    class="BackToTop"
    :class="{ visible }"
    type="button"
    aria-label="Back to top"
    :tabindex="visible ? 0 : -1"
    @click="toTop"
  >
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  </button>
</template>

<style scoped>
.BackToTop {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: var(--vp-z-index-backdrop);
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--glass-nav-border);
  border-radius: 50%;
  background: var(--glass-nav-bg);
  box-shadow:
    inset 0 1px 0 var(--glass-nav-highlight),
    0 8px 24px -8px rgba(0, 0, 0, 0.25);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  color: var(--vp-c-text-1);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px) scale(0.9);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    color 0.2s,
    border-color 0.2s;
}

.BackToTop.visible {
  opacity: 1;
  pointer-events: auto;
  transform: none;
}

.BackToTop:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.BackToTop:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.BackToTop svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (min-width: 768px) {
  .BackToTop {
    right: 32px;
    bottom: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .BackToTop {
    transition: none;
  }
}
</style>
