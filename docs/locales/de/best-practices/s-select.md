- **Für eine bekannte Menge an Optionen verwenden.** Ein Select passt, wenn Händler aus einer vordefinierten Liste wählen. Müssen Händler einen eigenen Wert eingeben oder eine lange Liste durchsuchen, ist ein Textfeld mit Vorschlägen während der Eingabe oder ein durchsuchbares Dropdown besser geeignet.
- **Optionen bewusst ordnen.** Gruppieren Sie zusammengehörige Optionen, setzen Sie die häufigsten an den Anfang oder sortieren Sie alphabetisch, wenn es keine natürliche Reihenfolge gibt, damit Händler ihre Wahl schnell finden.
- **Leicht überfliegbare Labels schreiben.** Geben Sie jeder Option genug Kontext, damit Händler sie unterscheiden können, ohne die Liste zu öffnen und mehrere durchzulesen.
- **Den Ausgangszustand bewusst wählen.** Wählen Sie eine Option vor, wenn es einen offensichtlichen Standard gibt, und verwenden Sie einen `placeholder`, wenn Händler eine bewusste Wahl treffen sollen. Lassen Sie den Anfangszustand nicht mehrdeutig.
- **Validierungsprobleme erklären.** Ist eine Auswahl erforderlich oder ungültig, sagen Sie Händlern mit `error` konkret, was zu tun ist, denn passgenaue Meldungen helfen ihnen, Formulare schneller abzuschließen als allgemeine.

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-select>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices) (auf Englisch).
