- **Don't pair switches with a save button.** A switch takes effect the moment it's toggled, so adding a save button leaves merchants unsure when their change actually applies.
- **Make the setting obvious.** Write a `label` that tells merchants what the switch controls and what on and off mean, so they don't have to flip it just to find out.
- **Describe the consequences.** Use `details` to explain what changes when the switch is toggled, especially for settings that affect important features or data, so merchants can decide with confidence.
- **Group and order related switches.** When a page has several switches, keep related settings together in a logical order so merchants can find and configure them easily.
- **Explain why a switch is unavailable.** When a switch is `disabled` because of permissions, dependencies or plan limits, tell merchants why, whether it's temporary, and what they need to do to unlock it.

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

See [Shopify's best practices for `<s-switch>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices) for the full guidance.
