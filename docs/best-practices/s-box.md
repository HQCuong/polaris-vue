- **Reach for it as a generic container.** `SBox` handles spacing, borders and backgrounds for grouping content. When you need a specific arrangement such as rows or columns, use `SStack` or `SGrid` instead.
- **Check for a more meaningful component first.** If something like `SSection` or `SBanner` already describes what the content is, prefer it. Purpose-built components carry clearer intent and better accessibility.
- **Plan for smaller screens.** A layout that looks right on desktop can break on mobile, so adjust spacing and layout with responsive values instead of locking in fixed sizes.
- **Describe regions and interactive content.** When a box marks a distinct region or holds interactive content, set `accessibilityRole` and `accessibilityLabel` so screen reader users can understand and move through the structure.
- **Keep nesting shallow.** Stacking boxes inside boxes makes the markup complex and the styling hard to maintain. Look for a simpler structure or a better-suited layout component.

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

See [Shopify's best practices for `<s-box>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices) for the full guidance.
