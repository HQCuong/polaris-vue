- **State file limits with `accept`.** Set clear restrictions on the file types the drop zone takes.
- **Handle `droprejected` with a helpful message.** When a file fails validation, listen for the event and tell merchants what went wrong.
- **Consider `disabled` while processing.** Turning off the drop zone during an upload keeps merchants from adding more files in the meantime.

```vue
<SDropZone label="Product images" accept="image/*" />
```

See [Shopify's best practices for `<s-drop-zone>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices) for the full guidance.
