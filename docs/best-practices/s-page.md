- **Give every page a title.** Set `heading` to a title that describes the page the merchant is on.
- **Add breadcrumbs inside a flow.** When the page is one step in a larger flow, put links back in the `breadcrumb-actions` slot.
- **Keep header actions page-wide.** Only place actions in the header when they apply to the whole page, not to one part of it.
- **Limit the number of actions.** Use at most one primary action and three secondary actions on a page.
- **Leave the bottom of the page free of actions.** Don't place any actions at the end of the page.

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

See [Shopify's best practices for `<s-page>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices) for the full guidance.
