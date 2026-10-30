- **Größe passend zum Kontext wählen.** Verwenden Sie `size="base"` in Tabellenzellen, Listeneinträgen oder überall dort, wo mehrere Badges nebeneinanderstehen. `size="large"` ist einem einzelnen Badge vorbehalten, das hervorgehoben werden soll, etwa dem Hauptstatus oben auf einer Seite.
- **Labels auf ein oder zwei Wörter beschränken.** Kurze Labels wie „Fulfilled“ oder „Out of stock“ lassen sich schnell erfassen. Formulieren Sie Status in der Vergangenheitsform, also „Refunded“ statt „Refund“.
- **Tone passend zum Status wählen.** Verwenden Sie `tone="critical"` für Fehler oder dringende Probleme, die ein Handeln erfordern, `tone="warning"` für Probleme, die Aufmerksamkeit brauchen, `tone="success"` für positive Bestätigungen und `tone="info"` für neutrale Status. Derselbe Status sollte in der gesamten App denselben Tone haben.
- **Badges neben dem Beschriebenen platzieren.** In einem Listeneintrag gehört das Badge neben den Titel. In einer Tabelle bekommen Badges eine eigene Spalte, damit Händler sie schnell überfliegen können.
- **Badges nur für Systemstatus verwenden.** Badges sind statische, vom System gesetzte Indikatoren. Für Tags, die Händler selbst anlegen, oder für entfernbare Elemente sind sie nicht gedacht.

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-badge>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices) (auf Englisch).
