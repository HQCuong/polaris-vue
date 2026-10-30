- **Als generischen Container einsetzen.** `SBox` kümmert sich um Abstände, Rahmen und Hintergründe, um Inhalte zu gruppieren. Für eine bestimmte Anordnung wie Zeilen oder Spalten eignen sich `SStack` oder `SGrid` besser.
- **Zuerst nach einer aussagekräftigeren Komponente suchen.** Beschreibt etwa `SSection` oder `SBanner` den Inhalt bereits, ist diese Komponente vorzuziehen. Spezialisierte Komponenten vermitteln die Absicht klarer und bieten bessere Barrierefreiheit.
- **Kleinere Bildschirme einplanen.** Ein Layout, das auf dem Desktop passt, kann mobil zerfallen. Passen Sie Abstände und Layout daher mit responsiven Werten an, statt feste Größen vorzugeben.
- **Bereiche und interaktive Inhalte beschreiben.** Markiert eine Box einen eigenständigen Bereich oder enthält sie interaktive Inhalte, setzen Sie `accessibilityRole` und `accessibilityLabel`, damit Screenreader-Nutzer die Struktur verstehen und sich darin bewegen können.
- **Flach verschachteln.** Boxen in Boxen machen das Markup komplex und das Styling schwer wartbar. Suchen Sie nach einer einfacheren Struktur oder einer besser geeigneten Layout-Komponente.

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-box>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices) (auf Englisch).
