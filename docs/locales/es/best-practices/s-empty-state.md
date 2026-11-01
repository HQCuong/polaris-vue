- **Explica la causa y luego la solución.** Un simple encabezado "No products" deja a los comerciantes adivinando. Usa el `heading` para explicar por qué no hay nada y deja que la acción indique el siguiente paso.
- **Destaca una única acción principal.** Usa el slot `primary-action` para el paso que saca a los comerciantes del estado vacío y coloca las demás opciones en `secondary-actions`.
- **Redacta de otra forma los resultados filtrados.** Un recurso sin contenido y un filtro que no encontró nada son situaciones distintas. Para los resultados filtrados, indica a los comerciantes cómo ajustar el filtro.
- **Trata la ilustración como un extra.** El encabezado y la acción hacen el trabajo, así que deja vacío el slot `graphic` en diseños densos y, cuando lo uses, limítalo a un solo icono o imagen.

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

Consulta [las buenas prácticas de Shopify para `<s-empty-state>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices) (en inglés) para ver todas las recomendaciones.
