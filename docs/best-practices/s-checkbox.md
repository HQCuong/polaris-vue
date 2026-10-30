- **Keep each checkbox independent.** Merchants should be able to tick any combination of options without one checkbox affecting another.
- **Give every checkbox a descriptive `label`.** This matters most when a checkbox switches a setting on or off, so merchants know exactly what they're enabling.
- **Order options logically.** Sort them alphabetically, numerically or by time so merchants can find the one they want quickly.
- **Reserve `indeterminate` for partial "select all".** Use it on a "select all" checkbox when only some of the items in its group are checked.
- **Add `details` when context helps.** Use it for extra explanation of what an option does, only when the label alone isn't enough.

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

See [Shopify's best practices for `<s-checkbox>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices) for the full guidance.
