- **Work with password managers.** Set a fitting `autocomplete` value, such as `new-password` or `current-password`, so password managers can help merchants generate and save strong passwords.
- **State the rules up front.** List every password requirement before merchants start typing, instead of revealing them only after an invalid entry. This avoids frustration and abandoned forms.
- **Guide merchants creating a password.** Give live feedback on password strength and explain what would make it stronger, rather than simply enforcing rules without context.
- **Let merchants paste.** Password managers and similar tools depend on pasting, and blocking it pushes merchants toward weaker passwords they can type from memory.
- **Treat client-side checks as feedback only.** Always validate the password on your server, because browser constraints are easy to bypass. Client-side validation is there to respond quickly, not to provide security.

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

See [Shopify's best practices for `<s-password-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices) for the full guidance.
