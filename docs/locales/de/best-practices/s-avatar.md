- **Größe an den Kontext anpassen.** Wählen Sie für dichte Layouts wie Tabellen und Listen eine kleinere `size` und auf Profilseiten, auf denen die Person im Mittelpunkt steht, eine größere.
- **Hilfreichen Alternativtext schreiben.** Setzen Sie `alt` auf die Person oder Sache, die der Avatar darstellt, etwa den Namen einer Person oder Firma. Steht dieser Name bereits als Text neben dem Avatar, verwenden Sie stattdessen ein leeres `alt`.
- **Neben dem Dargestellten platzieren.** Setzen Sie den Avatar direkt neben den Namen oder die Entität, für die er steht, damit der Zusammenhang in Listen, Tabellen und Cards klar ist.

```vue
<SAvatar alt="Sarah Chen" initials="SC" size="large" />
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-avatar>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar#best-practices) (auf Englisch).
