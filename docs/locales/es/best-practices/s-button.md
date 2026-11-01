- **Usa un verbo claro como etiqueta.** Di exactamente lo que hace el botón, como "Save", "Edit" o "Add tags". Usa mayúscula solo al inicio, omite palabras de relleno como "a" o "the" y no uses puntuación.
- **Reserva `tone="critical"` para acciones destructivas.** Úsalo solo cuando una acción sea difícil o imposible de revertir y, en general, ajusta el tono a la importancia de la acción.
- **Haz que la jerarquía sea evidente.** Asigna `variant="primary"` a la acción principal, `variant="secondary"` a las acciones de apoyo y `variant="tertiary"` a las complementarias, para que los comerciantes sepan qué acción es la más importante.
- **Coloca los botones de forma coherente.** Pon los botones en los mismos lugares en toda tu app para que los comerciantes aprendan dónde buscarlos.
- **Etiqueta los botones que solo tienen icono.** Si un botón tiene un icono y no tiene texto, dale un `accessibilityLabel` que indique a los usuarios de lectores de pantalla lo que hace.

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

Consulta [las buenas prácticas de Shopify para `<s-button>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices) (en inglés) para ver todas las recomendaciones.
