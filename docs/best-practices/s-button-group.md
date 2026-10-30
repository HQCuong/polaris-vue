- **Keep related actions together.** Group calls to action that belong to the same task so merchants can see their options and how they relate.
- **Keep a visual hierarchy.** Use `variant="primary"` on the button for the main action and `variant="secondary"` or `variant="tertiary"` on the supporting ones to steer attention.
- **Don't add too many buttons.** A long row of choices overwhelms merchants and makes it harder to decide.
- **Use a segmented group for toggles.** For closely related options, such as switching views or filters, set `gap="none"` to join the buttons into one segmented control.
- **Set destructive actions apart.** Place them deliberately and give them `tone="critical"` so they're harder to trigger by accident.

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

See [Shopify's best practices for `<s-button-group>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices) for the full guidance.
