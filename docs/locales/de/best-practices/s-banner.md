- **Ein Thema pro Banner.** Jedes Banner sollte genau eine Nachricht oder eine erforderliche Aktion enthalten, damit Händler nicht rätseln müssen, worum es geht.
- **Für schnelles Überfliegen schreiben.** Halten Sie den Text so kurz, dass Händler die Nachricht und den nächsten Schritt auf einen Blick erfassen.
- **Einen nächsten Schritt anbieten.** Banner mit `tone="info"`, `tone="warning"` oder `tone="critical"` sollten einen Call to Action enthalten, der konkret sagt, wie es weitergeht.
- **Banner schließbar machen.** Setzen Sie `dismissible`, sofern die Nachricht kein sofortiges Handeln erfordert, und vermeiden Sie Banner, die sich nicht schließen lassen.
- **Banner nach Geltungsbereich platzieren.** Ein Banner zur gesamten Seite gehört außerhalb jeder Section, ein Banner zum Inhalt einer Section in diese Section.

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-banner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices) (auf Englisch).
