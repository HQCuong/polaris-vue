- **Use it when the sequence means something.** Numbered lists convey order, priority or ranking, so they fit step-by-step instructions or ranked recommendations. If the order is irrelevant, use `SUnorderedList` instead.
- **Write items the same way.** Give every item matching grammar and structure so the list reads easily. Switching styles from item to item makes readers work harder.
- **Keep each item short.** Lists work because they're quick to scan. If items grow long or involved, consider breaking them out into their own sections.
- **Don't nest too deeply.** One level of nesting can organize related points, but going past two levels gets hard to follow and suggests the content needs a different structure.

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

See [Shopify's best practices for `<s-ordered-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices) for the full guidance.
