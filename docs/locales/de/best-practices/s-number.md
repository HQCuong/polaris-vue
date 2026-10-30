- **Nur die Zahl umschließen.** Setzen Sie den Zahlenwert selbst in `SNumber` und die umgebenden Wörter in `SText` oder `SParagraph`. Tabellarische Ziffern richten Zahlen sauber aus, lassen normale Wörter aber ungleichmäßig wirken.
- **Werte zuerst in der App formatieren.** `SNumber` steuert, wie Ziffern aussehen, nicht wie der Wert formatiert ist. Fügen Sie Währungssymbole, Dezimalstellen und Tausendertrennzeichen daher selbst passend zur Locale des Händlers hinzu.
- **Tone nur verwenden, wenn die Zahl einen Status hat.** Setzen Sie `tone`, wenn die Zahl selbst etwas signalisiert, etwa ausverkauften Bestand. Bekommt jede Zahl einen Tone, sticht keine mehr hervor.
- **Zahlen nach Wichtigkeit dimensionieren.** Geben Sie der Zahl, die Händler zuerst lesen sollen, etwa einer Gesamtsumme, eine größere `fontSize` und belassen Sie sekundäre Zahlen in der Standardgröße.

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-number>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices) (auf Englisch).
