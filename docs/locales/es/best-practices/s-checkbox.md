- **Mantén cada casilla independiente.** Los comerciantes deben poder marcar cualquier combinación de opciones sin que una casilla afecte a otra.
- **Da a cada casilla un `label` descriptivo.** Esto es especialmente importante cuando una casilla activa o desactiva un ajuste, para que los comerciantes sepan exactamente qué están activando.
- **Ordena las opciones de forma lógica.** Ordénalas alfabéticamente, numéricamente o por fecha para que los comerciantes encuentren rápidamente la que buscan.
- **Reserva `indeterminate` para un "seleccionar todo" parcial.** Úsalo en una casilla "seleccionar todo" cuando solo algunos de los elementos de su grupo estén marcados.
- **Añade `details` cuando el contexto ayude.** Úsalo para explicar mejor lo que hace una opción, solo cuando la etiqueta por sí sola no sea suficiente.

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

Consulta [las buenas prácticas de Shopify para `<s-checkbox>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices) (en inglés) para ver todas las recomendaciones.
