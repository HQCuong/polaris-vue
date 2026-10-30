- **Labels kurz halten.** Ziel sind ein bis drei Wörter, zum Beispiel „Electronics“ oder „Summer sale“.
- **`color` nach Wichtigkeit wählen.** Verwenden Sie `color="subdued"` für sekundäre Chips und behalten Sie den Standardwert `"base"` für normale Auswahlen bei.
- **Entfernen gut sichtbar machen.** Ist ein Chip `removable`, prüfen Sie, dass sein Entfernen-Button sichtbar ist und klare Hover- und Fokuszustände hat.
- **Zusammengehörige Chips gruppieren.** Ordnen Sie sie in einem inline `SStack` an, damit sie horizontal mit gleichmäßigen Abständen ausgerichtet sind.

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-clickable-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices) (auf Englisch).
