- **Label with a clear verb.** Say exactly what the button does, as in "Save", "Edit" or "Add tags". Use sentence case, skip filler words like "a" or "the", and leave out punctuation.
- **Save `tone="critical"` for destructive actions.** Use it only when an action is hard or impossible to reverse, and in general match the tone to how much the action matters.
- **Make the hierarchy obvious.** Give the main action `variant="primary"`, supporting actions `variant="secondary"`, and supplementary ones `variant="tertiary"`, so merchants can tell which action matters most.
- **Place buttons consistently.** Put buttons in the same spots across your app so merchants learn where to look for them.
- **Label icon-only buttons.** If a button has an icon and no text, give it an `accessibilityLabel` that tells screen reader users what it does.

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

See [Shopify's best practices for `<s-button>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices) for the full guidance.
