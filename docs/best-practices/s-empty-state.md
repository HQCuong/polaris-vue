- **Explain the cause, then the fix.** A bare "No products" heading leaves merchants guessing. Use the `heading` to say why nothing is there, and let the action carry the next step.
- **Lead with one primary action.** Use the `primary-action` slot for the one step that gets merchants out of the empty state, and place other options in `secondary-actions`.
- **Word filtered results differently.** A resource with nothing in it and a filter that matched nothing are different situations. For filtered results, tell merchants how to adjust the filter.
- **Treat the graphic as extra.** The heading and action do the work, so leave the `graphic` slot empty in dense layouts, and when you do use it, limit it to one icon or image.

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

See [Shopify's best practices for `<s-empty-state>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices) for the full guidance.
