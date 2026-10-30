- **Tabellen für Daten, die Händler vergleichen.** Tabellen eignen sich für viele Datensätze mit denselben Attributen, die nebeneinander überflogen werden müssen. Für eine einfache Liste ohne Vergleich wählen Sie eine einfachere Komponente.
- **Das mobile Listenlayout einplanen.** Mobil wird die Tabelle zu einer Liste. Prüfen Sie daher, ob Ihre Header und Werte auch als gestapelte Label-Wert-Paare statt als Raster gut lesbar sind.
- **Wenige Spalten verwenden.** Viele Spalten machen eine Tabelle schwer überfliegbar und erzwingen horizontales Scrollen. Zeigen Sie nur die Spalten, die Händler für ihre Aufgabe brauchen, und erwägen Sie, den Rest bei Bedarf einzublenden.
- **Klare Spaltenüberschriften schreiben.** Halten Sie jeden `STableHeader` kurz und aussagekräftig, damit Händler genau wissen, welche Daten die Spalte enthält.
- **Große Datenmengen einplanen.** Große Tabellen beeinträchtigen Performance und Benutzbarkeit. Aktivieren Sie `paginate` ab etwa 50 bis 100 Zeilen oder erwägen Sie Filter oder eine Suche, damit Händler schneller zu den richtigen Datensätzen gelangen.

```vue
<STable paginate hasNextPage>
  <STableHeaderRow>
    <STableHeader>Product</STableHeader>
    <STableHeader format="numeric">Inventory</STableHeader>
  </STableHeaderRow>
  <STableBody>
    <STableRow>
      <STableCell>Snowboard</STableCell>
      <STableCell>24</STableCell>
    </STableRow>
  </STableBody>
</STable>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-table>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices) (auf Englisch).
