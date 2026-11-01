- **Muéstralo para operaciones asíncronas más lentas.** Usa un spinner cuando algo como guardar un formulario, obtener datos o procesar una acción tarde más de unos 500 ms. En acciones que terminan al instante, un spinner solo parpadea y distrae.
- **Mantenlo junto a lo que se está cargando.** Coloca el spinner en la parte de la página que se está cargando, como un botón que está guardando o una sección que obtiene sus datos, en lugar de bloquear toda la interfaz.
- **Indica qué se está cargando.** Define siempre `accessibilityLabel`, por ejemplo "Loading products" o "Saving changes", para que los usuarios de lectores de pantalla sepan qué está pasando.
- **Comunica el resultado después.** Cuando desaparezca el spinner, muestra un mensaje claro de éxito o de error para que los comerciantes sepan que la operación terminó y cómo salió.

```vue
<SSpinner accessibilityLabel="Loading products" />
```

Consulta [las buenas prácticas de Shopify para `<s-spinner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices) (en inglés) para ver todas las recomendaciones.
