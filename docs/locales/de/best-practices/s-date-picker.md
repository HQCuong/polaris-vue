- **Mit einem sinnvollen Datum beginnen.** Füllen Sie `value` vor, damit Händler schneller auswählen können.
- **Abkürzungen für häufige Auswahlen anbieten.** Voreinstellungen wie „Today“, „Last 7 days“ oder „This month“ ersparen Händlern das Durchklicken des Kalenders.
- **`type="range"` für Start- und Enddatum verwenden.** Bereichsauswahl eignet sich für Berichte, Analysen und andere zeitraumbasierte Filter.
- **Nicht zutreffende Daten sperren.** Verwenden Sie `allow` und `disallow`, damit Händler keine Daten wählen können, die für Ihren Anwendungsfall ungültig sind.
- **Platz um den Picker lassen.** Geben Sie ihm genug Raum, damit er Bildschirmtastaturen oder anderen interaktiven Elementen nicht im Weg ist.
- **Weit entfernte Daten einplanen.** Monatsweises Blättern wird über einige Jahre hinaus mühsam. Bieten Sie für Daten außerhalb eines Zeitfensters von etwa 5–10 Jahren Voreinstellungen an oder lassen Sie Händler das Jahr direkt eingeben.

```vue
<SDatePicker type="range" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-date-picker>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker#best-practices) (auf Englisch).
