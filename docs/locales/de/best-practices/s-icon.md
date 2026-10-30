- **Icons informieren, nicht dekorieren.** Ein Icon sollte erklären, was eine Aktion tut, oder einen Zustand zeigen, etwa ein Löschen-Icon an einer Löschaktion oder ein Häkchen für etwas Erledigtes. Fügen Sie Icons nicht nur der Optik wegen hinzu.
- **Einheitlich bleiben.** Steht ein Icon einmal für eine Aktion oder ein Konzept, sollte das in der gesamten App so bleiben. Bedeutet `edit` an einer Stelle Bearbeiten, verwenden Sie es überall zum Bearbeiten.
- **Icons möglichst mit Text kombinieren.** Für sich allein können selbst vertraute Icons unterschiedlich verstanden werden. Verwenden Sie ein Icon nur dort allein, wo der Platz knapp ist, etwa bei einem Icon-Button mit `accessibilityLabel`.
- **Allgemein bekannte Icons wählen.** Bevorzugen Sie Icons mit etablierter Bedeutung wie `search`, `delete` und `plus`. Muss ein Icon erklärt werden, wählen Sie ein anderes.
- **`tone` Bedeutung tragen lassen.** Verwenden Sie `tone="critical"` für destruktive Aktionen, `tone="success"` für positive Zustände und `tone="warning"` für Vorsicht. Tones sollen etwas mitteilen, nicht dekorieren.

```vue
<SIcon type="alert-triangle" tone="warning" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-icon>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices) (auf Englisch).
