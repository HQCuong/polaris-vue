- **Die erwartete Eingabe offensichtlich machen.** Schreiben Sie ein `label` und einen `placeholder`, die Händlern sagen, was in welchem Format einzugeben ist. Vage Formulierungen führen zu Raten, Validierungsfehlern und Frust.
- **Kontext mit Präfix oder Suffix ergänzen.** Verwenden Sie `prefix` und `suffix`, um Art und Format des Werts zu zeigen, etwa ob Händler eine vollständige URL oder nur eine Subdomain, einen vollständigen Preis oder nur den Betrag eingeben sollen.
- **Einschränkungen an echten Anforderungen ausrichten.** Legen Sie `minLength`, `maxLength` und Validierungsregeln nach tatsächlichen geschäftlichen Erfordernissen fest statt nach willkürlichen Zahlen, und teilen Sie sie Händlern mit.
- **Früh und konkret Feedback geben.** Zeigen Sie Händlern schon während der Eingabe, ob sie gültig ist, nicht erst beim Absenden. Ist sie es nicht, erklären Sie mit `error`, was falsch ist und wie es sich beheben lässt.

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-text-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices) (auf Englisch).
