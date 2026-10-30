- **Mit einem klaren Verb beschriften.** Sagen Sie genau, was der Button tut, etwa „Save“, „Edit“ oder „Add tags“. Verwenden Sie Satzschreibung (sentence case), lassen Sie Füllwörter wie „a“ oder „the“ weg und verzichten Sie auf Satzzeichen.
- **`tone="critical"` für destruktive Aktionen reservieren.** Verwenden Sie ihn nur, wenn sich eine Aktion schwer oder gar nicht rückgängig machen lässt, und wählen Sie den Tone generell danach, wie folgenreich die Aktion ist.
- **Hierarchie deutlich machen.** Geben Sie der Hauptaktion `variant="primary"`, unterstützenden Aktionen `variant="secondary"` und ergänzenden `variant="tertiary"`, damit Händler erkennen, welche Aktion am wichtigsten ist.
- **Buttons einheitlich platzieren.** Setzen Sie Buttons in der gesamten App an dieselben Stellen, damit Händler lernen, wo sie sie finden.
- **Reine Icon-Buttons beschriften.** Hat ein Button ein Icon, aber keinen Text, geben Sie ihm ein `accessibilityLabel`, das Screenreader-Nutzern sagt, was er tut.

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-button>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices) (auf Englisch).
