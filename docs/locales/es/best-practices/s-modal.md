- **Reserva los modales para decisiones que requieren atención.** Abre uno cuando los comerciantes deban tomar una decisión concreta o reconocer algo crítico. Si la tarea o la herramienta puede estar directamente en la página, déjala allí.
- **Úsalos con moderación.** Cada modal interrumpe al comerciante, así que trátalo como un último recurso para los momentos importantes y no como un patrón predeterminado.
- **Haz que la acción principal destaque.** Dale al modal una única llamada a la acción clara y destacada en el slot `primary-action`.
- **Etiqueta las acciones con verbos específicos.** Botones como "Delete", "Save" o "Continue" indican a los comerciantes lo que ocurrirá; evita etiquetas genéricas como "Yes", "OK" o "Submit".
- **Explica las consecuencias de las acciones destructivas.** Cuando la acción elimina o descarta algo, describe en el cuerpo del modal lo que los comerciantes van a perder.
- **No anides modales.** Evita abrir un segundo modal desde uno que ya está abierto.

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

Consulta [las buenas prácticas de Shopify para `<s-modal>`](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices) (en inglés) para ver todas las recomendaciones.
