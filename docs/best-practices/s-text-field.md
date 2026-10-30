- **Make the expected input obvious.** Write a `label` and `placeholder` that tell merchants what to enter and in which format. Vague wording leads to guessing, validation errors and frustration.
- **Add context with a prefix or suffix.** Use `prefix` and `suffix` to show the kind of value and its format, for example whether merchants should type a whole URL or only a subdomain, or a full price or just the amount.
- **Base constraints on real requirements.** Set `minLength`, `maxLength` and validation rules according to actual business needs rather than arbitrary numbers, and tell merchants what they are.
- **Give feedback early and specifically.** Let merchants know whether their input is valid while they type, not only on submit. When it isn't, use `error` to explain what's wrong and how to fix it.

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

See [Shopify's best practices for `<s-text-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices) for the full guidance.
