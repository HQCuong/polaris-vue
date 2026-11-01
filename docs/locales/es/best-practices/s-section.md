- **Agrupa el contenido que va junto.** Da a cada sección una única función coherente, ya sea información relacionada o controles relacionados; así funciona como contenedor visual y aporta significado a la estructura de la página.
- **Escribe encabezados descriptivos.** Los comerciantes leen el `heading` por encima para orientarse, así que indica qué contiene la sección en lugar de recurrir a un título genérico.
- **Anida solo tanto como el contenido lo requiera.** Una sección anidada afecta a la jerarquía de encabezados y al esquema de la página, no a su aspecto. Limítate a dos o tres niveles como máximo, y anida solo cuando la estructura adicional haga más claro el contenido.
- **Quita el padding cuando el contenido deba ir de borde a borde.** Usa `padding="none"` para elementos como tablas o imágenes que deban llenar la sección, y luego comprueba que el contenido interior mantenga suficiente espaciado propio.
- **Añade un `accessibilityLabel` cuando el encabezado no sea suficiente.** Cuando el encabezado visible no deje clara la función de la sección para quienes usan lectores de pantalla, dales una etiqueta que aporte el contexto que falta.
- **Elige el slot de encabezado adecuado.** Coloca los detalles que modifican el propio encabezado, como un tooltip o un contador, en `accessory`. Coloca la información sobre la sección en su conjunto, como un badge de estado, en `supplemental`. Las acciones, como un botón o un menú, van en `accessory`, ya que `supplemental` no las admite.

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

Consulta [las buenas prácticas de Shopify para `<s-section>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices) (en inglés) para ver todas las recomendaciones.
