- **Keep paragraphs short.** Aim for two to four sentences in plain language without jargon. Merchants tend to scan, so split long content into smaller pieces.
- **Use tone to signal intent.** `tone="critical"` suits errors, `"caution"` warnings and `"success"` confirmations. Always back the color with clear wording rather than relying on it alone.
- **Design for accessibility.** Add screen-reader-only text (`accessibilityVisibility="exclusive"`) for context that sighted merchants pick up from layout or icons, and make sure toned text keeps enough contrast to read.
- **Clamp lines with care.** `lineClamp` helps in tight spots like cards or previews, but never let truncation hide critical information.

See [Shopify's best practices for `<s-paragraph>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/paragraph#best-practices) for the full guidance.
