- **Show it for slower async work.** Use a spinner when something like saving a form, fetching data or processing an action takes longer than about 500ms. For actions that finish instantly, a spinner just flickers and distracts.
- **Keep it local to what's loading.** Place the spinner in the part of the page that's loading, such as a button that's saving or a section fetching its data, rather than blocking the whole interface.
- **Say what's loading.** Always set `accessibilityLabel`, for example "Loading products" or "Saving changes", so screen reader users know what's happening.
- **Report the outcome afterward.** Once the spinner goes away, show a clear success or error message so merchants know the operation finished and how it went.

```vue
<SSpinner accessibilityLabel="Loading products" />
```

See [Shopify's best practices for `<s-spinner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices) for the full guidance.
