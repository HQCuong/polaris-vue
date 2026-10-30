- **Group content that belongs together.** Give every section a single, coherent job, whether that's related information or related controls; it then works as a visual container and adds meaning to the page structure.
- **Write descriptive headings.** Merchants skim the `heading` to find their way, so state what's inside rather than falling back on a generic title.
- **Nest only as deep as the content needs.** A nested section affects the heading hierarchy and the outline of the page rather than how it looks. Keep it to two or three levels at most, and nest only when the extra structure makes the content clearer.
- **Drop the padding when content should span edge to edge.** Use `padding="none"` for things like tables or images that ought to fill the section, then check that the inner content keeps enough spacing of its own.
- **Add an `accessibilityLabel` when the heading isn't enough.** When the on-screen heading leaves the section's purpose unclear for people using screen readers, give them a label that fills in the missing context.
- **Pick the right header slot.** Put details that modify the heading itself, like a tooltip or a count, in `accessory`. Put information about the section as a whole, like a status badge, in `supplemental`. Actions such as a button or menu belong in `accessory`, since `supplemental` doesn't take them.

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

See [Shopify's best practices for `<s-section>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices) for the full guidance.
