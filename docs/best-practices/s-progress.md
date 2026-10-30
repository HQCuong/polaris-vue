- **Use it for work you can measure.** Reach for a progress bar when you can express the work as part of a whole. When you can't tell how long something will take or how far along it is, a spinner is the lighter choice.
- **Name what's progressing.** Give `accessibilityLabel` a precise description, for example "Importing products" or "Storage used". Screen readers read the bar out under that label, and there's no default if you leave it off.
- **Add text when the numbers matter.** The bar shows no label or percentage itself, so put text next to it when merchants need the figures, and keep that text in step with `value`.
- **Set `max` to the real total.** Use the true count or cap, such as how many files there are or how big a quota is, rather than turning it all into a percentage. That makes `value` simple to update as work finishes.
- **Use tone only to signal trouble.** Reserve `tone="critical"` and `tone="warning"` for progress that points to a problem, such as a limit that's been used up. Leave ordinary in-progress work on the default tone.

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

See [Shopify's best practices for `<s-progress>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices) for the full guidance.
