- **Use icons to inform, not decorate.** An icon should explain what an action does or show a state, like a delete icon on a delete action or a check for something completed. Don't add icons just for looks.
- **Be consistent.** Once an icon stands for an action or concept, keep it that way across your whole app. If `edit` means editing in one place, use it for editing in every place.
- **Pair icons with text when you can.** On their own, even familiar icons can be read in more than one way. Use an icon alone only where space is tight, such as an icon-only button with an `accessibilityLabel`.
- **Pick widely recognized icons.** Favor icons with settled meanings, like `search`, `delete` and `plus`. If an icon needs explaining, choose a different one.
- **Let `tone` carry meaning.** Use `tone="critical"` for destructive actions, `tone="success"` for positive states and `tone="warning"` for caution. Tones should communicate something, not decorate.

```vue
<SIcon type="alert-triangle" tone="warning" />
```

See [Shopify's best practices for `<s-icon>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices) for the full guidance.
