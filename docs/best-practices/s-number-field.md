- **Keep it to purely numeric values.** Reach for it for things like quantities, measurements or percentages. If a value can include letters or symbols, such as a product code or phone number, use `STextField` instead.
- **Show the unit.** Use `prefix` or `suffix` to say what the number measures, so merchants aren't left guessing whether they're typing dollars, kilograms or a percentage.
- **Set limits that match your business rules.** Give `min` and `max` values that reflect what's actually allowed, which steers merchants toward valid entries before they submit the form.
- **Validate and explain errors.** Check every numeric entry, and when one fails, use `error` to say exactly what's wrong and how to fix it rather than showing a generic message.

```vue
<SNumberField label="Discount" suffix="%" :min="0" :max="100" />
```

See [Shopify's best practices for `<s-number-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field#best-practices) for the full guidance.
