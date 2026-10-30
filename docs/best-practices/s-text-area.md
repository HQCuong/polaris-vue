- **Size it for the expected answer.** The number of visible `rows` signals how much to write: a short area invites a brief reply, while a taller one asks for more detail.
- **Set length limits that reflect real needs.** Choose `minLength` and `maxLength` based on what the content actually requires, and tell merchants about those limits up front.
- **Use the placeholder as an example.** Write `placeholder` text that shows the kind of content, format and tone you expect, rather than repeating what the field is for.
- **Show how much room is left.** When you enforce a maximum length, let merchants see how many characters remain so they can fit their content without going over.

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

See [Shopify's best practices for `<s-text-area>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices) for the full guidance.
