- **Adapt to the container, not the viewport.** A query container lets components respond to the width of their container. That helps components that show up in places of different widths, like a product card in a sidebar or in the main column.
- **Name containers when there's more than one.** If several query containers need different queries, give each a descriptive `containerName` so you can target it; unnamed containers all answer the same queries.
- **Put responsive values on props.** The container provides the context Polaris components use to resolve responsive prop values, such as `padding="@container (inline-size > 500px) large-500, none"`, so you don't write container query CSS yourself.
- **Use them only where needed.** Every query container makes the browser track its size and apply conditional styles, so add one where you need container-based responsiveness rather than wrapping every element.

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

See [Shopify's best practices for `<s-query-container>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices) for the full guidance.
