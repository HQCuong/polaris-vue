- **Dateibeschränkungen mit `accept` festlegen.** Legen Sie klar fest, welche Dateitypen die Drop Zone annimmt.
- **`droprejected` mit einer hilfreichen Meldung behandeln.** Scheitert eine Datei an der Validierung, reagieren Sie auf das Event und erklären Sie Händlern, was schiefgelaufen ist.
- **`disabled` während der Verarbeitung erwägen.** Wird die Drop Zone während eines Uploads deaktiviert, können Händler in der Zwischenzeit keine weiteren Dateien hinzufügen.

```vue
<SDropZone label="Product images" accept="image/*" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-drop-zone>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices) (auf Englisch).
