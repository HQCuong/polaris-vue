- **URLs selbst validieren.** Die eingebaute URL-Validierung des Browsers ist minimal und unterscheidet sich zwischen Browsern. Ergänzen Sie daher eigene Prüfungen für Struktur, erlaubte Protokolle und die Formate, die Ihr Anwendungsfall akzeptiert.
- **Das erwartete Format zeigen.** Sagen Sie Händlern, ob ein Protokoll anzugeben ist, welche Protokolle erlaubt sind und welche Art von URL Sie erwarten. Eine vollständige Beispiel-URL im `placeholder` macht das deutlich.
- **Festlegen, wie ein fehlendes Protokoll behandelt wird.** Händler lassen `https://` oft weg. Entscheiden Sie, ob Sie es automatisch ergänzen, URLs ohne Protokoll akzeptieren oder einen `error` anzeigen, der erklärt, was fehlt.
- **Längenbegrenzungen nach Verwendungsort wählen.** Browser und Server unterstützen unterschiedliche Maximallängen. Setzen Sie `maxLength` daher nach dem Ziel der URL statt nach einer willkürlichen Zahl, und nennen Sie die Grenze, wenn sie relevant ist.
- **Erklären, wofür die URL ist.** Machen Sie den Zweck mit `label` und `details` klar, denn eine Produktbild-URL, ein Social-Media-Profillink und ein externer Verweis erfordern jeweils etwas anderes.

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-url-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices) (auf Englisch).
