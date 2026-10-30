- **Cover one thing per banner.** Each banner should carry a single message or a single required action, so merchants aren't left wondering what it's about.
- **Write for a quick scan.** Keep the text short enough that merchants grasp the message and what to do next at a glance.
- **Give merchants a next step.** Banners with `tone="info"`, `tone="warning"` or `tone="critical"` should include a call to action that says specifically how to proceed.
- **Let merchants close banners.** Set `dismissible` unless the message needs immediate action, and avoid banners that stay on screen with no way to close them.
- **Place banners by scope.** Put a banner outside any section for a message about the whole page, or inside a section when it concerns that section's content.

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

See [Shopify's best practices for `<s-banner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices) for the full guidance.
