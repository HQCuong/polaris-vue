- **Erst die Ursache, dann die Lösung.** Eine bloße Überschrift wie „No products“ lässt Händler rätseln. Erklären Sie mit `heading`, warum nichts da ist, und lassen Sie die Aktion den nächsten Schritt tragen.
- **Mit einer primären Aktion führen.** Verwenden Sie den Slot `primary-action` für den einen Schritt, der Händler aus dem leeren Zustand herausführt, und platzieren Sie weitere Optionen in `secondary-actions`.
- **Gefilterte Ergebnisse anders formulieren.** Eine Ressource ohne Inhalt und ein Filter ohne Treffer sind verschiedene Situationen. Sagen Sie Händlern bei gefilterten Ergebnissen, wie sie den Filter anpassen können.
- **Die Grafik als Zugabe behandeln.** Überschrift und Aktion leisten die eigentliche Arbeit. Lassen Sie den Slot `graphic` in dichten Layouts daher leer und beschränken Sie ihn sonst auf ein Icon oder Bild.

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-empty-state>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices) (auf Englisch).
