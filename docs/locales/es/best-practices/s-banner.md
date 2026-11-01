- **Un solo tema por banner.** Cada banner debe transmitir un único mensaje o una única acción requerida, para que los comerciantes no se pregunten de qué se trata.
- **Escribe para una lectura rápida.** Mantén el texto lo bastante corto para que los comerciantes entiendan el mensaje y qué hacer a continuación de un vistazo.
- **Indica a los comerciantes el siguiente paso.** Los banners con `tone="info"`, `tone="warning"` o `tone="critical"` deben incluir una llamada a la acción que diga concretamente cómo continuar.
- **Permite que los comerciantes cierren los banners.** Define `dismissible` salvo que el mensaje requiera una acción inmediata, y evita los banners que permanecen en pantalla sin ninguna forma de cerrarlos.
- **Coloca los banners según su alcance.** Pon un banner fuera de cualquier sección para un mensaje sobre toda la página, o dentro de una sección cuando se refiera al contenido de esa sección.

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

Consulta [las buenas prácticas de Shopify para `<s-banner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices) (en inglés) para ver todas las recomendaciones.
