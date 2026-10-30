- **Modals für Entscheidungen reservieren, die Fokus brauchen.** Öffnen Sie eines, wenn Händler eine bestimmte Wahl treffen oder etwas Kritisches bestätigen müssen. Kann die Aufgabe oder das Werkzeug direkt auf der Seite stehen, belassen Sie es dort.
- **Sparsam einsetzen.** Jedes Modal unterbricht den Händler. Betrachten Sie es daher als letztes Mittel für wichtige Momente, nicht als Standardmuster.
- **Die Hauptaktion hervorheben.** Geben Sie dem Modal im Slot `primary-action` einen klaren, gut sichtbaren Call to Action.
- **Aktionen mit konkreten Verben beschriften.** Buttons wie „Delete“, „Save“ oder „Continue“ sagen Händlern, was passieren wird; vermeiden Sie allgemeine Labels wie „Yes“, „OK“ oder „Submit“.
- **Folgen destruktiver Aktionen klar benennen.** Löscht oder verwirft die Aktion etwas, beschreiben Sie im Modal-Text, was Händler verlieren.
- **Modals nicht verschachteln.** Öffnen Sie kein zweites Modal aus einem bereits geöffneten heraus.

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-modal>`](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices) (auf Englisch).
