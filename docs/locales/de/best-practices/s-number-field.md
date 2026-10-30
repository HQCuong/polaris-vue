- **Nur für rein numerische Werte verwenden.** Es eignet sich für Mengen, Maße oder Prozentwerte. Kann ein Wert Buchstaben oder Symbole enthalten, etwa ein Produktcode oder eine Telefonnummer, verwenden Sie stattdessen `STextField`.
- **Die Einheit anzeigen.** Verwenden Sie `prefix` oder `suffix`, um zu zeigen, was die Zahl misst, damit Händler nicht rätseln, ob sie Dollar, Kilogramm oder einen Prozentwert eingeben.
- **Grenzen passend zu Ihren Geschäftsregeln setzen.** Geben Sie `min` und `max` Werte, die widerspiegeln, was tatsächlich erlaubt ist. So werden Händler schon vor dem Absenden zu gültigen Eingaben geführt.
- **Validieren und Fehler erklären.** Prüfen Sie jede numerische Eingabe und sagen Sie bei einem Fehler mit `error` genau, was falsch ist und wie es sich beheben lässt, statt eine allgemeine Meldung anzuzeigen.

```vue
<SNumberField label="Discount" suffix="%" :min="0" :max="100" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-number-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field#best-practices) (auf Englisch).
