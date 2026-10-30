- **Für langsamere asynchrone Vorgänge zeigen.** Verwenden Sie einen Spinner, wenn etwa das Speichern eines Formulars, das Laden von Daten oder das Verarbeiten einer Aktion länger als etwa 500 ms dauert. Bei Aktionen, die sofort fertig sind, flackert ein Spinner nur und lenkt ab.
- **Auf den ladenden Bereich beschränken.** Platzieren Sie den Spinner in dem Teil der Seite, der lädt, etwa in einem speichernden Button oder einer Section, die ihre Daten lädt, statt die gesamte Oberfläche zu blockieren.
- **Sagen, was lädt.** Setzen Sie immer `accessibilityLabel`, zum Beispiel „Loading products“ oder „Saving changes“, damit Screenreader-Nutzer wissen, was passiert.
- **Das Ergebnis anschließend melden.** Sobald der Spinner verschwindet, zeigen Sie eine klare Erfolgs- oder Fehlermeldung, damit Händler wissen, dass der Vorgang abgeschlossen ist und wie er ausging.

```vue
<SSpinner accessibilityLabel="Loading products" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-spinner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices) (auf Englisch).
