- **Verwenden, wenn die Reihenfolge Bedeutung hat.** Nummerierte Listen vermitteln Reihenfolge, Priorität oder Rangfolge und eignen sich daher für Schritt-für-Schritt-Anleitungen oder gereihte Empfehlungen. Ist die Reihenfolge egal, verwenden Sie stattdessen `SUnorderedList`.
- **Einträge einheitlich formulieren.** Geben Sie jedem Eintrag dieselbe Grammatik und Struktur, damit sich die Liste leicht liest. Wechselnde Stile von Eintrag zu Eintrag machen das Lesen mühsamer.
- **Jeden Eintrag kurz halten.** Listen funktionieren, weil sie sich schnell überfliegen lassen. Werden Einträge lang oder kompliziert, erwägen Sie, sie in eigene Abschnitte auszulagern.
- **Nicht zu tief verschachteln.** Eine Verschachtelungsebene kann zusammengehörige Punkte ordnen, aber mehr als zwei Ebenen werden schwer nachvollziehbar und deuten darauf hin, dass der Inhalt eine andere Struktur braucht.

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-ordered-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices) (auf Englisch).
