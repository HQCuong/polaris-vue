- **Reserve modals for decisions that need focus.** Open one when merchants must make a specific choice or acknowledge something critical. If the task or tool could live directly on the page, keep it there instead.
- **Use them sparingly.** Every modal interrupts the merchant, so treat it as a last resort for important moments rather than a default pattern.
- **Make the main action stand out.** Give the modal one clear, prominent call to action in the `primary-action` slot.
- **Label actions with specific verbs.** Buttons like "Delete", "Save" or "Continue" tell merchants what will happen; avoid generic labels such as "Yes", "OK" or "Submit".
- **Spell out the consequences of destructive actions.** When the action deletes or discards something, describe in the modal body what merchants will lose.
- **Don't nest modals.** Avoid opening a second modal from inside one that is already open.

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

See [Shopify's best practices for `<s-modal>`](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices) for the full guidance.
