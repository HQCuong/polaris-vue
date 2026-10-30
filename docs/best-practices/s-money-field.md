- **Set `min` and `max` to realistic limits.** For example, a product price can use a `min` of 0.01 so it can't be zero, a discount can range from 0 to the order total, and a refund can be capped at the amount paid. Always check values against your business rules too.
- **Name the exact limit in `error`.** Instead of "Invalid amount", say something like "Price must be at least $0.01" so merchants know which constraint they broke.
- **Keep currency symbols out of `label` and `placeholder`.** Adding "$" or similar can clash with the currency formatting the field already handles.
- **Label the amount by its purpose.** "Product base price" or "Discount amount" tells merchants more than "Amount" or "Price".
- **Pre-fill `value` when editing.** Show the current amount for existing values; for new entries, consider a sensible default such as 0.00 or a typical price.

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

See [Shopify's best practices for `<s-money-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices) for the full guidance.
