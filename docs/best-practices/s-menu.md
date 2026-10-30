- **Use menus for secondary actions.** Keep primary actions like "Save" visible in the page itself. Menus suit actions merchants use less often or destructive ones, such as "Archive" or "Export data", that don't need permanent space.
- **Write labels as a verb plus a noun.** Labels like "Edit details" or "Export as CSV" say exactly what happens; avoid vague ones like "Options", "More" or "Settings".
- **Split longer menus into sections.** Once a menu has four or more items, group related actions in an `SSection` with a `heading`, for example "Manage" for everyday actions and "Danger zone" for destructive ones.
- **Add icons that support the label.** Icons like `edit` for editing, `delete` for deleting or `download` for exporting help merchants recognize an action, but they should reinforce the text, never stand in for it.
- **Disable only what's unavailable for now.** Set `disabled` on an item when the action doesn't apply in the current context, like refunding an order that's already refunded. If an action never applies, leave it out of the menu.

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

See [Shopify's best practices for `<s-menu>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices) for the full guidance.
