- **Zusammengehörige Inhalte gruppieren.** Geben Sie jeder Section eine einzige, stimmige Aufgabe, ob zusammengehörige Informationen oder zusammengehörige Bedienelemente; dann dient sie als visueller Container und gibt der Seitenstruktur Bedeutung.
- **Aussagekräftige Überschriften schreiben.** Händler überfliegen die `heading`, um sich zu orientieren. Sagen Sie daher, was enthalten ist, statt auf einen allgemeinen Titel auszuweichen.
- **Nur so tief verschachteln, wie der Inhalt es braucht.** Eine verschachtelte Section wirkt sich auf die Überschriftenhierarchie und die Gliederung der Seite aus, nicht auf das Aussehen. Bleiben Sie bei höchstens zwei oder drei Ebenen und verschachteln Sie nur, wenn die zusätzliche Struktur den Inhalt klarer macht.
- **Padding weglassen, wenn Inhalte randlos sein sollen.** Verwenden Sie `padding="none"` für Tabellen oder Bilder, die die Section ausfüllen sollen, und prüfen Sie dann, ob der innere Inhalt selbst genug Abstand behält.
- **`accessibilityLabel` ergänzen, wenn die Überschrift nicht reicht.** Lässt die sichtbare Überschrift den Zweck der Section für Screenreader-Nutzer unklar, geben Sie ihnen ein Label, das den fehlenden Kontext ergänzt.
- **Den richtigen Header-Slot wählen.** Details, die die Überschrift selbst ergänzen, etwa ein Tooltip oder eine Anzahl, gehören in `accessory`. Informationen zur Section als Ganzes, etwa ein Status-Badge, gehören in `supplemental`. Aktionen wie ein Button oder Menü gehören in `accessory`, da `supplemental` keine aufnimmt.

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-section>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices) (auf Englisch).
