- **Da un título a cada página.** Define `heading` con un título que describa la página en la que se encuentra el comerciante.
- **Añade migas de pan dentro de un flujo.** Cuando la página sea un paso de un flujo más amplio, coloca enlaces de regreso en el slot `breadcrumb-actions`.
- **Reserva las acciones del encabezado para toda la página.** Coloca acciones en el encabezado solo cuando se apliquen a toda la página, no a una parte de ella.
- **Limita el número de acciones.** Usa como máximo una acción principal y tres acciones secundarias por página.
- **No pongas acciones al final de la página.** No coloques ninguna acción en la parte inferior de la página.

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

Consulta [las buenas prácticas de Shopify para `<s-page>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices) (en inglés) para ver todas las recomendaciones.
