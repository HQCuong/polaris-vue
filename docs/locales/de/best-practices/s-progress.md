- **Für messbare Arbeit verwenden.** Ein Fortschrittsbalken passt, wenn sich die Arbeit als Teil eines Ganzen ausdrücken lässt. Ist nicht absehbar, wie lange etwas dauert oder wie weit es ist, ist ein Spinner die leichtere Wahl.
- **Benennen, was fortschreitet.** Geben Sie `accessibilityLabel` eine präzise Beschreibung, zum Beispiel „Importing products“ oder „Storage used“. Screenreader lesen den Balken unter diesem Label vor, und ohne Angabe gibt es keinen Standardwert.
- **Text ergänzen, wenn die Zahlen zählen.** Der Balken zeigt selbst kein Label und keinen Prozentwert. Setzen Sie daher Text daneben, wenn Händler die Zahlen brauchen, und halten Sie diesen Text mit `value` synchron.
- **`max` auf die tatsächliche Gesamtmenge setzen.** Verwenden Sie die echte Anzahl oder Obergrenze, etwa die Zahl der Dateien oder die Größe eines Kontingents, statt alles in Prozent umzurechnen. So lässt sich `value` einfach aktualisieren, während die Arbeit fortschreitet.
- **Tone nur für Probleme verwenden.** Reservieren Sie `tone="critical"` und `tone="warning"` für Fortschritt, der auf ein Problem hinweist, etwa ein ausgeschöpftes Limit. Normale laufende Arbeit bleibt beim Standard-Tone.

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-progress>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices) (auf Englisch).
