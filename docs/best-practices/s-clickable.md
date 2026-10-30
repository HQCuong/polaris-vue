- **Label elements without visible text.** If nothing inside the clickable area is readable text, set `accessibilityLabel` so screen reader users know what it's for.
- **Pick the mode that fits.** Use it as a button to trigger actions, give it an `href` to navigate, and set `type="submit"` when it submits a form.
- **Explain disabled states.** When you set `disabled`, make the state visually clear and add text telling merchants why the element can't be used.

See [Shopify's best practices for `<s-clickable>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable#best-practices) for the full guidance.
