- **Use a specific `label`.** Names like "Customer email" or "Order notification email" are clearer than a plain "Email" or "Email address".
- **Add context in `details`.** Explain why the address is needed or how it's used, for example "Required for digital receipts".
- **Show the format in `placeholder`.** An example address like "you@example.com" shows what to type; don't just repeat the label.
- **Make `error` messages actionable.** Tell merchants how to fix the address, for example "Enter a valid email address".

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

See [Shopify's best practices for `<s-email-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices) for the full guidance.
