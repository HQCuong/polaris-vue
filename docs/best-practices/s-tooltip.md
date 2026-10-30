- **Use tooltips for extra, non-essential detail.** They suit information that adds understanding but isn't required. Never hide errors, essential information or required instructions in a tooltip.
- **Pair them with icon-only buttons.** An icon button needs a tooltip to explain what it does; include the action and, if there is one, its keyboard shortcut.
- **Keep the text brief.** A short phrase or sentence is ideal. If the content runs long, it probably deserves a more visible spot in the UI.
- **Treat many tooltips as a warning sign.** If the interface needs lots of them to make sense, improve the labels, layout or information architecture instead.
- **Remember touch devices.** Tooltips only work on desktop and don't appear on touch screens, so show important information by default on mobile.

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

See [Shopify's best practices for `<s-tooltip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices) for the full guidance.
