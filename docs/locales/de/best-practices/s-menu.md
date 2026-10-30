- **Menüs für sekundäre Aktionen verwenden.** Halten Sie primäre Aktionen wie „Save“ direkt auf der Seite sichtbar. Menüs eignen sich für seltener genutzte oder destruktive Aktionen wie „Archive“ oder „Export data“, die keinen festen Platz brauchen.
- **Labels als Verb plus Nomen formulieren.** Labels wie „Edit details“ oder „Export as CSV“ sagen genau, was passiert; vermeiden Sie vage Labels wie „Options“, „More“ oder „Settings“.
- **Längere Menüs in Sections aufteilen.** Ab vier Einträgen gruppieren Sie zusammengehörige Aktionen in einer `SSection` mit `heading`, zum Beispiel „Manage“ für alltägliche und „Danger zone“ für destruktive Aktionen.
- **Icons ergänzen, die das Label unterstützen.** Icons wie `edit` zum Bearbeiten, `delete` zum Löschen oder `download` zum Exportieren helfen Händlern, eine Aktion zu erkennen, sollten den Text aber verstärken, nie ersetzen.
- **Nur vorübergehend Unverfügbares deaktivieren.** Setzen Sie `disabled` an einem Eintrag, wenn die Aktion im aktuellen Kontext nicht zutrifft, etwa beim Erstatten einer bereits erstatteten Bestellung. Trifft eine Aktion nie zu, lassen Sie sie ganz aus dem Menü weg.

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-menu>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices) (auf Englisch).
