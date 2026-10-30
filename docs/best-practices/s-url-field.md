- **Validate URLs yourself.** The browser's built-in URL validation is minimal and varies between browsers, so add your own checks for structure, allowed protocols and the formats your use case accepts.
- **Show the format you expect.** Tell merchants whether to include a protocol, which protocols are allowed and what kind of URL you want. A complete example URL in the `placeholder` makes this clear.
- **Decide how to handle a missing protocol.** Merchants often leave off `https://`. Choose whether to add it for them, accept URLs without it, or show an `error` that explains what's missing.
- **Pick length limits for where the URL is used.** Browsers and servers handle different maximum lengths, so set `maxLength` based on the URL's destination rather than an arbitrary number, and mention the limit when it matters.
- **Explain what the URL is for.** Use the `label` and `details` to make the purpose clear, since a product image URL, a social profile link and an external reference each call for something different.

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

See [Shopify's best practices for `<s-url-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices) for the full guidance.
