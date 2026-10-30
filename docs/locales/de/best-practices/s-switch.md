- **Switches nicht mit einem Speichern-Button kombinieren.** Ein Switch wirkt sofort beim Umschalten. Ein zusätzlicher Speichern-Button lässt Händler im Unklaren, wann ihre Änderung tatsächlich greift.
- **Die Einstellung offensichtlich machen.** Schreiben Sie ein `label`, das Händlern sagt, was der Switch steuert und was Ein und Aus bedeuten, damit sie ihn nicht erst umlegen müssen, um es herauszufinden.
- **Die Folgen beschreiben.** Erklären Sie mit `details`, was sich beim Umschalten ändert, besonders bei Einstellungen, die wichtige Funktionen oder Daten betreffen, damit Händler sicher entscheiden können.
- **Zusammengehörige Switches gruppieren und ordnen.** Hat eine Seite mehrere Switches, halten Sie zusammengehörige Einstellungen in logischer Reihenfolge beieinander, damit Händler sie leicht finden und konfigurieren können.
- **Erklären, warum ein Switch nicht verfügbar ist.** Ist ein Switch wegen Berechtigungen, Abhängigkeiten oder Tarifgrenzen `disabled`, sagen Sie Händlern, warum, ob es vorübergehend ist und was sie tun müssen, um ihn freizuschalten.

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-switch>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices) (auf Englisch).
