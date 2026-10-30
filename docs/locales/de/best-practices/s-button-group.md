- **Zusammengehörige Aktionen bündeln.** Gruppieren Sie Calls to Action, die zur selben Aufgabe gehören, damit Händler ihre Optionen und deren Zusammenhang erkennen.
- **Visuelle Hierarchie wahren.** Verwenden Sie `variant="primary"` für den Button der Hauptaktion und `variant="secondary"` oder `variant="tertiary"` für die unterstützenden, um die Aufmerksamkeit zu lenken.
- **Nicht zu viele Buttons hinzufügen.** Eine lange Reihe von Optionen überfordert Händler und erschwert die Entscheidung.
- **Segmentierte Gruppe für Umschalter verwenden.** Für eng verwandte Optionen, etwa zum Wechseln von Ansichten oder Filtern, verbindet `gap="none"` die Buttons zu einem segmentierten Control.
- **Destruktive Aktionen absetzen.** Platzieren Sie sie mit Bedacht und geben Sie ihnen `tone="critical"`, damit sie nicht versehentlich ausgelöst werden.

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-button-group>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices) (auf Englisch).
