- **Use it for a known set of choices.** A select works when merchants pick from a predefined list. When merchants need to enter a custom value or hunt through a long list, a text field that suggests matches as they type, or a dropdown they can search, is a better fit.
- **Order options deliberately.** Group related options, put the most common ones first, or sort alphabetically when there's no natural order, so merchants find their choice quickly.
- **Write labels that are easy to scan.** Give each option enough context that merchants can tell options apart without opening and reading through several of them.
- **Choose the starting state on purpose.** Preselect an option when there's an obvious default, and use a `placeholder` when merchants should make a deliberate choice. Don't leave the initial state ambiguous.
- **Explain validation problems.** When a selection is required or invalid, use `error` to tell merchants specifically what to do, since tailored messages help them finish forms faster than generic ones.

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

See [Shopify's best practices for `<s-select>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices) for the full guidance.
