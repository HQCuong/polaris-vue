- **Usa los menús para acciones secundarias.** Mantén visibles en la propia página las acciones principales como "Save". Los menús son adecuados para acciones que los comerciantes usan con menos frecuencia o para acciones destructivas, como "Archive" o "Export data", que no necesitan un espacio permanente.
- **Escribe las etiquetas como un verbo más un sustantivo.** Etiquetas como "Edit details" o "Export as CSV" dicen exactamente lo que ocurrirá; evita las vagas como "Options", "More" o "Settings".
- **Divide los menús largos en secciones.** Cuando un menú tenga cuatro elementos o más, agrupa las acciones relacionadas en un `SSection` con un `heading`, por ejemplo "Manage" para las acciones habituales y "Danger zone" para las destructivas.
- **Añade iconos que refuercen la etiqueta.** Iconos como `edit` para editar, `delete` para eliminar o `download` para exportar ayudan a los comerciantes a reconocer una acción, pero deben reforzar el texto, nunca sustituirlo.
- **Desactiva solo lo que no está disponible por ahora.** Define `disabled` en un elemento cuando la acción no se aplique en el contexto actual, como reembolsar un pedido que ya está reembolsado. Si una acción nunca se aplica, déjala fuera del menú.

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

Consulta [las buenas prácticas de Shopify para `<s-menu>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices) (en inglés) para ver todas las recomendaciones.
