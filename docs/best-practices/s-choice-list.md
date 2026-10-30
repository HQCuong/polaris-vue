- **Match the selection mode to the options.** Keep single selection for options that exclude each other, like payment methods or shipping speeds, and set `multiple` when merchants can pick more than one.
- **Make choice labels describe the outcome.** "Email notifications for new orders" says more than "Email". Keep labels short, but clear enough to stand on their own.
- **Phrase the `label` as a question or statement.** A title such as "Which shipping method?" or "Select notification preferences" tells merchants more than a vague word like "Options" or "Settings".
- **Explain complex choices in the `details` slot.** Add details to an individual `SChoice` when merchants need to understand what picking it implies.
- **Make `error` messages specific.** Tell merchants exactly what's missing, for example "Select at least one notification preference", instead of a generic "Required field".

```vue
<SChoiceList label="Which shipping method?">
  <SChoice value="standard">Standard shipping</SChoice>
  <SChoice value="express">
    Express shipping
    <template #details>
      <SText>Costs more, but orders arrive in 1–2 business days.</SText>
    </template>
  </SChoice>
</SChoiceList>
```

See [Shopify's best practices for `<s-choice-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices) for the full guidance.
