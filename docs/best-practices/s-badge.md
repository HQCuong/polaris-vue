- **Pick the size for the context.** Use `size="base"` in table cells, list items, or anywhere several badges sit together. Reserve `size="large"` for a single badge that deserves emphasis, such as the main status shown at the head of a page.
- **Keep labels to one or two words.** Short labels like "Fulfilled" or "Out of stock" scan quickly. Write statuses in the past tense, so "Refunded" rather than "Refund".
- **Match the tone to the status.** Use `tone="critical"` for errors or urgent issues that need action, `tone="warning"` for problems that need attention, `tone="success"` for positive confirmations, and `tone="info"` for neutral statuses. Give the same status the same tone everywhere in your app.
- **Keep badges next to what they describe.** In a list item, put the badge near the title. In a table, give badges their own column so merchants can scan it.
- **Use badges only for system statuses.** Badges are static indicators set by the system, so don't use them for tags merchants create or for items they can remove.

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

See [Shopify's best practices for `<s-badge>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices) for the full guidance.
