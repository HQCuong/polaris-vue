- **Mit Passwortmanagern zusammenarbeiten.** Setzen Sie einen passenden `autocomplete`-Wert wie `new-password` oder `current-password`, damit Passwortmanager Händlern helfen können, starke Passwörter zu erzeugen und zu speichern.
- **Regeln vorab nennen.** Führen Sie alle Passwortanforderungen auf, bevor Händler mit der Eingabe beginnen, statt sie erst nach einer ungültigen Eingabe zu zeigen. Das vermeidet Frust und abgebrochene Formulare.
- **Händler beim Erstellen eines Passworts anleiten.** Geben Sie Live-Feedback zur Passwortstärke und erklären Sie, was es stärker machen würde, statt Regeln ohne Kontext durchzusetzen.
- **Einfügen erlauben.** Passwortmanager und ähnliche Werkzeuge sind auf Einfügen angewiesen. Wird es blockiert, greifen Händler zu schwächeren Passwörtern, die sie aus dem Gedächtnis tippen können.
- **Clientseitige Prüfungen nur als Feedback betrachten.** Validieren Sie das Passwort immer auf Ihrem Server, da sich Browser-Einschränkungen leicht umgehen lassen. Clientseitige Validierung dient der schnellen Rückmeldung, nicht der Sicherheit.

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-password-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices) (auf Englisch).
