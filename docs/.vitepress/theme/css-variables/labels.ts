import { computed } from 'vue'
import { useData } from 'vitepress'

// UI strings for the CSS variables page components. Each locale's theme.json carries them
// under `cssVariables` (exposed as themeConfig.cssVariables in config.ts); anything missing
// falls back to English. `{count}`, `{query}`, `{value}`, `{package}` and `{version}` are
// placeholders.
export const ENGLISH = {
  variable: 'Variable',
  value: 'Value',
  preview: 'Preview',
  copy: 'Copy',
  copied: 'Copied',
  base: 'base',
  search: 'Search variables',
  searchPlaceholder: 'Filter by name or value: critical, 400, #fff',
  clear: 'Clear',
  theme: 'Theme',
  baseTheme: 'Base',
  copyAs: 'Copy as',
  count: '{count} variables',
  countOne: '1 variable',
  empty: 'No variable matches {query}. Try a shorter term.',
  copiedAnnounce: 'Copied {value}',
  showValue: 'Show value',
  differs: 'Value differs between Base and admin-next',
  specimenLabel: 'Example card built from Polaris CSS variables',
  specimenTitle: 'Order #1024',
  specimenText: '3 items, ready to ship',
  specimenChip: 'Paid',
  specimenButton: 'Fulfill items',
  specimenHint: 'Hover or focus a variable to see where the card uses it. Click to copy.',
  legendSurface: 'Card background',
  legendShadow: 'Card edge and shadow',
  legendRadius: 'Corner radius',
  legendPadding: 'Padding',
  legendText: 'Title text',
  legendChip: 'Status chip',
  legendDivider: 'Divider',
  legendButton: 'Button',
  migrationShared: '{count} names exist in both.',
  migrationLegacyOnly: 'In {package} {version}, not defined by the web components runtime ({count})',
  migrationRuntimeOnly: 'Defined by the web components runtime, not in {package} ({count})',
}

export type Labels = typeof ENGLISH

export function useLabels() {
  const { theme } = useData<{ cssVariables?: Partial<Labels> }>()
  return computed<Labels>(() => ({ ...ENGLISH, ...theme.value.cssVariables }))
}

export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}
