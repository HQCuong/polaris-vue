- **Benennen, wofür die Farbe ist.** Verwenden Sie ein `label` wie „Button background color“ oder „Heading text color“ statt eines allgemeinen „Color“.
- **Beim Bearbeiten die aktuelle Farbe zeigen.** Setzen Sie `value` auf die bestehende Farbe, damit Händler den Ausgangswert ihrer Änderung sehen.

```vue
<SColorField label="Button background color" value="#1a1a1a" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-color-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field#best-practices) (auf Englisch).
