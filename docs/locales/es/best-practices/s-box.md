- **Úsalo como contenedor genérico.** `SBox` gestiona el espaciado, los bordes y los fondos para agrupar contenido. Cuando necesites una disposición concreta, como filas o columnas, usa en su lugar `SStack` o `SGrid`.
- **Busca primero un componente con más significado.** Si un componente como `SSection` o `SBanner` ya describe qué es el contenido, prefiérelo. Los componentes específicos expresan una intención más clara y ofrecen mejor accesibilidad.
- **Piensa en las pantallas pequeñas.** Un diseño que se ve bien en escritorio puede romperse en móvil, así que ajusta el espaciado y la disposición con valores responsivos en lugar de fijar tamaños fijos.
- **Describe las regiones y el contenido interactivo.** Cuando una box marca una región diferenciada o contiene contenido interactivo, define `accessibilityRole` y `accessibilityLabel` para que los usuarios de lectores de pantalla puedan entender la estructura y desplazarse por ella.
- **Limita el anidamiento.** Apilar boxes dentro de boxes complica el marcado y hace que los estilos sean difíciles de mantener. Busca una estructura más sencilla o un componente de diseño más adecuado.

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

Consulta [las buenas prácticas de Shopify para `<s-box>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices) (en inglés) para ver todas las recomendaciones.
