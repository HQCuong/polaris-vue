- **Pick a semantic `type`.** Choose `"strong"` to mark key words or phrases, `"address"` for a postal or email address, and `"redundant"` for text that gives screen reader users context when the same content already appears on screen. Picking the right type lets assistive technology express what the text means.
- **Emphasize sparingly.** Apply `type="strong"` to key words or numbers within a sentence, not to whole sentences; too much emphasis loses its effect and makes text harder to scan.
- **Use tone for inline status.** Tones like `"critical"`, `"success"` or `"caution"` draw attention to a status, but pair them with clear wording rather than letting color carry the message.
- **Don't subdue what matters.** `color="subdued"` suits timestamps and metadata, but avoid it for critical information merchants must read.

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

See [Shopify's best practices for `<s-text>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices) for the full guidance.
