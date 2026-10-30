- **Start with a sensible date.** Pre-fill `value` with the existing date when editing, or with a likely choice when suggesting one.
- **Limit dates to what makes sense.** Narrow the dates merchants can pick with `allow` and `disallow`, such as restricting a scheduling field to upcoming dates or a business field to Monday through Friday.
- **Explain any limits in `details`.** Spell out requirements such as "Must be a future date" so merchants know the rules before they pick.
- **Make `error` messages actionable.** When a date is invalid, tell merchants how to fix it.

See [Shopify's best practices for `<s-date-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-field#best-practices) for the full guidance.
