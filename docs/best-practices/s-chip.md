- **Use chips to describe, not to act.** Chips work well for tags, statuses and categories that tell merchants something about the content. They aren't buttons, so when a chip needs to be clicked or dismissed, use `SClickableChip` instead.
- **Keep labels short.** Brief text like "Featured" or "On sale" can be read at a glance, while long labels slow scanning and may get cut off.
- **Match the visual weight to the content.** Use `color="subdued"` for secondary metadata and the default color for ordinary tags and categories.
- **Place chips next to what they describe.** Keep them beside the item they label, and in lists put them in the same position on every row so merchants can scan quickly.
- **Add an icon when it helps.** An `SIcon` in the `graphic` slot can make a status or familiar category easier to recognize.

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

See [Shopify's best practices for `<s-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices) for the full guidance.
