- **Zum Filtern vor Ort verwenden.** Es eignet sich, um den Inhalt eines bestimmten Abschnitts oder einer Liste einzugrenzen. Globale Navigation oder komplexe, mehrstufige Suchen erfordern ein robusteres Suchmuster.
- **Sagen, was durchsucht wird.** Schreiben Sie ein konkretes `label` und einen `placeholder`, die Händlern sagen, welche Inhalte die Suche abdeckt und nach welchen Attributen sie suchen können.
- **Während der Eingabe reagieren.** Aktualisieren Sie Ergebnisse oder gefilterte Inhalte nach Möglichkeit schon während der Eingabe, damit Händler ihre Suche verfeinern können und darauf vertrauen, dass sie funktioniert.
- **Geleerte und leere Suchen einplanen.** Wird das Feld geleert, zeigen Sie wieder die vollständige Liste. Gibt es keine Treffer, zeigen Sie eine Meldung, die eine andere Aktion oder eine breitere Suche vorschlägt.
- **Auf genügend Eingabe warten.** Vermeiden Sie Suchen, die zu viele oder bedeutungslose Ergebnisse liefern würden; ab zwei oder drei Zeichen gibt es genug, um nützliche Treffer zu liefern.

```vue
<SSearchField label="Search products" placeholder="Search by title, SKU or vendor" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-search-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/search-field#best-practices) (auf Englisch).
