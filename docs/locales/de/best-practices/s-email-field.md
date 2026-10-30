- **Ein konkretes `label` verwenden.** Bezeichnungen wie „Customer email“ oder „Order notification email“ sind klarer als ein schlichtes „Email“ oder „Email address“.
- **Kontext in `details` ergänzen.** Erklären Sie, warum die Adresse benötigt wird oder wie sie verwendet wird, zum Beispiel „Required for digital receipts“.
- **Format im `placeholder` zeigen.** Eine Beispieladresse wie „you@example.com“ zeigt, was einzugeben ist; wiederholen Sie nicht einfach das Label.
- **`error`-Meldungen umsetzbar formulieren.** Sagen Sie Händlern, wie sie die Adresse korrigieren, zum Beispiel „Enter a valid email address“.

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-email-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices) (auf Englisch).
