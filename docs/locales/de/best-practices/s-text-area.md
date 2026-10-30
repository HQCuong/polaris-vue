- **Größe an die erwartete Antwort anpassen.** Die Anzahl sichtbarer `rows` signalisiert, wie viel geschrieben werden soll: Ein kurzes Feld lädt zu einer knappen Antwort ein, ein höheres verlangt mehr Details.
- **Längenbegrenzungen am tatsächlichen Bedarf ausrichten.** Wählen Sie `minLength` und `maxLength` danach, was der Inhalt wirklich erfordert, und nennen Sie Händlern diese Grenzen vorab.
- **Den Placeholder als Beispiel nutzen.** Schreiben Sie einen `placeholder`, der die erwartete Art von Inhalt, Format und Tonfall zeigt, statt den Zweck des Felds zu wiederholen.
- **Zeigen, wie viel Platz bleibt.** Wenn Sie eine Maximallänge erzwingen, zeigen Sie Händlern, wie viele Zeichen noch übrig sind, damit sie ihren Inhalt ohne Überschreitung unterbringen.

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-text-area>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices) (auf Englisch).
