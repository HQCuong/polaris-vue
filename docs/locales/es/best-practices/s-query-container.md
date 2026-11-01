- **Adáptate al contenedor, no al viewport.** Un query container permite que los componentes respondan al ancho de su contenedor. Esto ayuda a los componentes que aparecen en lugares de distintos anchos, como una tarjeta de producto en una barra lateral o en la columna principal.
- **Nombra los contenedores cuando haya más de uno.** Si varios query containers necesitan consultas diferentes, da a cada uno un `containerName` descriptivo para poder dirigirte a él; los contenedores sin nombre responden todos a las mismas consultas.
- **Pon los valores responsivos en las props.** El contenedor proporciona el contexto que los componentes de Polaris usan para resolver valores responsivos de las props, como `padding="@container (inline-size > 500px) large-500, none"`, así que no tienes que escribir tú mismo el CSS de las container queries.
- **Úsalos solo donde sea necesario.** Cada query container obliga al navegador a seguir su tamaño y aplicar estilos condicionales, así que añade uno donde necesites un comportamiento responsivo basado en el contenedor en lugar de envolver cada elemento.

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

Consulta [las buenas prácticas de Shopify para `<s-query-container>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices) (en inglés) para ver todas las recomendaciones.
