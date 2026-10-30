- **Wrap only the figure.** Put the numeric value itself in `SNumber` and leave the words around it in `SText` or `SParagraph`. Tabular digits align figures neatly but make regular words look uneven.
- **Format values in your app first.** `SNumber` controls how digits look, not how the value is formatted, so add currency symbols, decimals and thousands separators yourself to match the merchant's locale.
- **Use tone only when the figure has a status.** Set `tone` when the number itself signals something, such as stock that has run out. Toning every figure means none of them stands out.
- **Size figures by importance.** Give the number merchants should read first, like a total, a larger `fontSize`, and leave secondary figures at the default size.

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

See [Shopify's best practices for `<s-number>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices) for the full guidance.
