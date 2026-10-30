import { computed } from 'vue'
import { useData } from 'vitepress'

import type enTheme from '../../locales/en/theme.json'

// Strings for the theme's own components (homepage sections, back-to-top), one
// docs/locales/<code>/theme.json per language. Page content is translated as
// markdown under docs/<code>/; these are the bits that live in .vue files.
type Theme = typeof enTheme
type SidebarGroup = { text: string; items: { text: string; link: string }[] }

const themes = import.meta.glob<Theme>('../../locales/*/theme.json', { eager: true, import: 'default' })
const sidebars = import.meta.glob<SidebarGroup[]>('../components-sidebar*.json', {
  eager: true,
  import: 'default',
})

function codeOf(path: string): string {
  return path.split('/').at(-2) ?? 'en'
}

const byLang = new Map(Object.entries(themes).map(([path, theme]) => [theme.lang, { code: codeOf(path), theme }]))

function format(template: string, count: number): string {
  return template.replace('{count}', String(count))
}

export function useStrings() {
  const { lang } = useData()
  return computed(() => {
    const fallback = { code: 'en', theme: themes['../../locales/en/theme.json'] }
    const { code, theme } = byLang.get(lang.value) ?? fallback
    const isRoot = code === 'en'
    return {
      ...theme.home,
      linkPrefix: isRoot ? '' : `/${code}`,
      sidebar: sidebars[isRoot ? '../components-sidebar.json' : `../components-sidebar.${code}.json`],
      typedWrappers: (count: number) => format(theme.home.typedWrappers, count),
      componentsLine: (count: number) => format(theme.home.componentsLine, count),
      backToTop: theme.backToTop,
    }
  })
}
