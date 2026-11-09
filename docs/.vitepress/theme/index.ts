import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent, h } from 'vue'

import BackToTop from './BackToTop.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'layout-bottom': () => h(BackToTop) }),
  // Global so docs/guide/css-variables.md and its translations can use them without imports.
  // Async so tokens.json (~90 kB) loads only on that page, not in every page's theme chunk;
  // SSR still renders the tables into the static HTML.
  enhanceApp({ app }) {
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
  },
} satisfies Theme
