- **Tooltips für zusätzliche, nicht wesentliche Details.** Sie eignen sich für Informationen, die das Verständnis fördern, aber nicht erforderlich sind. Verstecken Sie niemals Fehler, wesentliche Informationen oder notwendige Anweisungen in einem Tooltip.
- **Mit Icon-Buttons kombinieren.** Ein Icon-Button braucht einen Tooltip, der erklärt, was er tut; nennen Sie die Aktion und, falls vorhanden, ihr Tastenkürzel.
- **Den Text knapp halten.** Ideal ist eine kurze Wendung oder ein kurzer Satz. Wird der Inhalt lang, verdient er vermutlich einen sichtbareren Platz in der UI.
- **Viele Tooltips als Warnsignal verstehen.** Braucht die Oberfläche viele davon, um verständlich zu sein, verbessern Sie lieber Labels, Layout oder Informationsarchitektur.
- **An Touch-Geräte denken.** Tooltips funktionieren nur auf dem Desktop und erscheinen nicht auf Touchscreens. Zeigen Sie wichtige Informationen auf Mobilgeräten daher standardmäßig an.

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-tooltip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices) (auf Englisch).
