- **Chips zum Beschreiben, nicht zum Handeln.** Chips eignen sich für Tags, Status und Kategorien, die Händlern etwas über den Inhalt sagen. Sie sind keine Buttons; muss ein Chip anklickbar oder entfernbar sein, verwenden Sie stattdessen `SClickableChip`.
- **Labels kurz halten.** Knappe Texte wie „Featured“ oder „On sale“ sind auf einen Blick lesbar, während lange Labels das Überfliegen bremsen und abgeschnitten werden können.
- **Visuelles Gewicht an den Inhalt anpassen.** Verwenden Sie `color="subdued"` für sekundäre Metadaten und die Standardfarbe für gewöhnliche Tags und Kategorien.
- **Chips neben dem Beschriebenen platzieren.** Halten Sie sie neben dem Element, das sie kennzeichnen, und setzen Sie sie in Listen in jeder Zeile an dieselbe Position, damit Händler schnell überfliegen können.
- **Icon ergänzen, wenn es hilft.** Ein `SIcon` im Slot `graphic` kann einen Status oder eine vertraute Kategorie leichter erkennbar machen.

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices) (auf Englisch).
