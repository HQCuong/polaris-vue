import type { Theme } from 'vitepress'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent, h } from 'vue'

import { TOKEN_GROUPS } from '../../../scripts/token-groups.mjs'
import BackToTop from './BackToTop.vue'
import './custom.css'

// CSS variables used to be one page, /guide/css-variables, which docs/public/_redirects now
// sends to /css-variables/. A redirect keeps the hash, so an old deep link such as
// /guide/css-variables#color-bg lands on the Overview. These anchors moved to the other
// two pages: the "All variables" heading and its group headings, and the migration heading.
const MOVED_ANCHORS: Record<string, string> = {
  'all-variables': 'reference',
  ...Object.fromEntries([...TOKEN_GROUPS.map(([group]) => group), 'other'].map((id) => [id, 'reference'])),
  'migrating-from-polaris-tokens': 'migration',
}

function movedAnchorTarget(href: string): string | null {
  const url = new URL(href, location.origin)
  const overview = /^((?:\/[a-z]{2})?\/css-variables)\/?$/.exec(url.pathname)
  if (!overview || url.hash === '') return null
  const page = MOVED_ANCHORS[decodeURIComponent(url.hash.slice(1))]
  return page ? `${overview[1]}/${page}${url.hash}` : null
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'layout-bottom': () => h(BackToTop) }),
  // Global so the docs/css-variables/ pages and their translations can use them without imports.
  // Async so tokens.json (~90 kB) loads only on those pages, not in every page's theme chunk;
  // SSR still renders the tables into the static HTML.
  enhanceApp({ app, router }) {
    app.component('CssVariables', defineAsyncComponent(() => import('./css-variables/CssVariables.vue')))
    app.component(
      'CssVariablesToolbar',
      defineAsyncComponent(() => import('./css-variables/CssVariablesToolbar.vue')),
    )
    app.component(
      'CssVariablesSpecimen',
      defineAsyncComponent(() => import('./css-variables/CssVariablesSpecimen.vue')),
    )
    app.component(
      'CssVariablesMigration',
      defineAsyncComponent(() => import('./css-variables/CssVariablesMigration.vue')),
    )

    if (!inBrowser) return
    // The first call is the initial page load, before the app hydrates the Overview's static
    // HTML. That load carries on, so hydration matches, while a full replace loads the right
    // page. Later calls are in-app navigations, which go straight to the right page instead.
    let initialLoad = true
    const previous = router.onBeforeRouteChange
    router.onBeforeRouteChange = async (href) => {
      const first = initialLoad
      initialLoad = false
      const target = movedAnchorTarget(href)
      if (!target) return previous?.(href)
      if (first) {
        location.replace(target)
        return previous?.(href)
      }
      await router.go(target)
      return false
    }
  },
} satisfies Theme
