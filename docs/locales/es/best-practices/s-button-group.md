- **Mantén juntas las acciones relacionadas.** Agrupa las llamadas a la acción que pertenecen a la misma tarea para que los comerciantes vean sus opciones y cómo se relacionan.
- **Mantén una jerarquía visual.** Usa `variant="primary"` en el botón de la acción principal y `variant="secondary"` o `variant="tertiary"` en las acciones de apoyo para dirigir la atención.
- **No añadas demasiados botones.** Una fila larga de opciones abruma a los comerciantes y dificulta la decisión.
- **Usa un grupo segmentado para alternar opciones.** Para opciones muy relacionadas, como cambiar de vista o de filtro, define `gap="none"` para unir los botones en un único control segmentado.
- **Separa las acciones destructivas.** Colócalas de forma deliberada y dales `tone="critical"` para que sean más difíciles de activar por accidente.

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

Consulta [las buenas prácticas de Shopify para `<s-button-group>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices) (en inglés) para ver todas las recomendaciones.
