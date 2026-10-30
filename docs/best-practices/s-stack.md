- **Let spacing reflect relationships.** A small `gap` signals that items belong together, while a larger one sets distinct groups apart. Pick the spacing that matches your content hierarchy.
- **Expect inline stacks to wrap.** With `direction="inline"`, items move to a new line when they run out of room. That is usually what you want, but if you need exact control over line breaks or multiple rows, reach for a different layout approach.
- **Set alignment on purpose.** The default alignment suits most layouts. Adjust `alignItems` or `justifyContent` when items differ in size or need specific positioning.

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

See [Shopify's best practices for `<s-stack>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices) for the full guidance.
