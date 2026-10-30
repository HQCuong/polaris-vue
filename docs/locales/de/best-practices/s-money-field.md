- **`min` und `max` auf realistische Grenzen setzen.** Ein Produktpreis kann zum Beispiel ein `min` von 0.01 haben, damit er nicht null sein kann, ein Rabatt kann von 0 bis zur Bestellsumme reichen, und eine Erstattung kann auf den gezahlten Betrag begrenzt werden. Prüfen Sie Werte außerdem immer gegen Ihre Geschäftsregeln.
- **Die genaue Grenze in `error` nennen.** Statt „Invalid amount“ sagen Sie etwa „Price must be at least $0.01“, damit Händler wissen, gegen welche Einschränkung sie verstoßen haben.
- **Währungssymbole aus `label` und `placeholder` heraushalten.** Ein „$“ oder Ähnliches kann mit der Währungsformatierung kollidieren, die das Feld bereits übernimmt.
- **Den Betrag nach seinem Zweck benennen.** „Product base price“ oder „Discount amount“ sagt Händlern mehr als „Amount“ oder „Price“.
- **`value` beim Bearbeiten vorbelegen.** Zeigen Sie bei bestehenden Werten den aktuellen Betrag; erwägen Sie bei neuen Einträgen einen sinnvollen Standardwert wie 0.00 oder einen typischen Preis.

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-money-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices) (auf Englisch).
