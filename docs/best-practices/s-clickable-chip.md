- **Keep labels short.** One to three words is the target, for example "Electronics" or "Summer sale".
- **Choose `color` by importance.** Use `color="subdued"` for secondary chips and keep the default `"base"` for standard selections.
- **Make removal easy to spot.** When a chip is `removable`, check that its remove button is visible and has clear hover and focus states.
- **Group related chips.** Lay them out in an inline `SStack` so they line up horizontally with even spacing.

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

See [Shopify's best practices for `<s-clickable-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices) for the full guidance.
