- **Einen semantischen `type` wählen.** Wählen Sie `"strong"`, um Schlüsselwörter oder Wendungen hervorzuheben, `"address"` für eine Post- oder E-Mail-Adresse und `"redundant"` für Text, der Screenreader-Nutzern Kontext gibt, wenn derselbe Inhalt bereits auf dem Bildschirm steht. Der richtige Typ lässt assistive Technologien ausdrücken, was der Text bedeutet.
- **Sparsam hervorheben.** Wenden Sie `type="strong"` auf Schlüsselwörter oder Zahlen innerhalb eines Satzes an, nicht auf ganze Sätze; zu viel Hervorhebung verliert ihre Wirkung und erschwert das Überfliegen.
- **Tone für Inline-Status verwenden.** Tones wie `"critical"`, `"success"` oder `"caution"` lenken die Aufmerksamkeit auf einen Status, sollten aber mit klarer Formulierung kombiniert werden, statt die Botschaft allein der Farbe zu überlassen.
- **Wichtiges nicht abschwächen.** `color="subdued"` passt zu Zeitstempeln und Metadaten, sollte aber nicht für kritische Informationen verwendet werden, die Händler lesen müssen.

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-text>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices) (auf Englisch).
