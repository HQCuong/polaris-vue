- **An den Container anpassen, nicht an den Viewport.** Ein Query Container lässt Komponenten auf die Breite ihres Containers reagieren. Das hilft Komponenten, die an Stellen unterschiedlicher Breite erscheinen, etwa eine Produkt-Card in einer Sidebar oder in der Hauptspalte.
- **Container benennen, wenn es mehrere gibt.** Brauchen mehrere Query Container unterschiedliche Queries, geben Sie jedem einen aussagekräftigen `containerName`, um ihn gezielt anzusprechen; unbenannte Container reagieren alle auf dieselben Queries.
- **Responsive Werte in Props angeben.** Der Container liefert den Kontext, mit dem Polaris-Komponenten responsive Prop-Werte wie `padding="@container (inline-size > 500px) large-500, none"` auflösen, sodass Sie kein eigenes Container-Query-CSS schreiben müssen.
- **Nur dort einsetzen, wo nötig.** Jeder Query Container lässt den Browser seine Größe verfolgen und bedingte Styles anwenden. Fügen Sie daher nur dort einen hinzu, wo containerbasierte Responsivität gebraucht wird, statt jedes Element zu umschließen.

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-query-container>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices) (auf Englisch).
