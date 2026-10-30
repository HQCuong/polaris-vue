- **Abstände spiegeln Beziehungen.** Ein kleiner `gap` signalisiert, dass Elemente zusammengehören, ein größerer trennt eigenständige Gruppen. Wählen Sie den Abstand passend zur Hierarchie Ihrer Inhalte.
- **Mit Umbrüchen in Inline-Stacks rechnen.** Mit `direction="inline"` rücken Elemente in eine neue Zeile, wenn der Platz nicht reicht. Das ist meist gewünscht; brauchen Sie aber genaue Kontrolle über Zeilenumbrüche oder mehrere Zeilen, greifen Sie zu einem anderen Layoutansatz.
- **Ausrichtung bewusst festlegen.** Die Standardausrichtung passt für die meisten Layouts. Passen Sie `alignItems` oder `justifyContent` an, wenn Elemente unterschiedlich groß sind oder eine bestimmte Position brauchen.

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-stack>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices) (auf Englisch).
