- **Jeder Seite einen Titel geben.** Setzen Sie `heading` auf einen Titel, der die Seite beschreibt, auf der sich der Händler befindet.
- **Innerhalb eines Ablaufs Breadcrumbs hinzufügen.** Ist die Seite ein Schritt in einem größeren Ablauf, setzen Sie Links zurück in den Slot `breadcrumb-actions`.
- **Header-Aktionen seitenweit halten.** Platzieren Sie Aktionen nur dann im Header, wenn sie für die ganze Seite gelten, nicht nur für einen Teil davon.
- **Anzahl der Aktionen begrenzen.** Verwenden Sie höchstens eine primäre und drei sekundäre Aktionen pro Seite.
- **Das Seitenende frei von Aktionen halten.** Platzieren Sie keine Aktionen am Ende der Seite.

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-page>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices) (auf Englisch).
