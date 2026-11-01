- **Usa los tooltips para detalles adicionales y no esenciales.** Son adecuados para información que ayuda a comprender pero no es imprescindible. Nunca ocultes errores, información esencial ni instrucciones obligatorias en un tooltip.
- **Combínalos con botones solo de icono.** Un botón de icono necesita un tooltip que explique lo que hace; incluye la acción y, si existe, su atajo de teclado.
- **Mantén el texto breve.** Lo ideal es una frase corta. Si el contenido se alarga, probablemente merece un lugar más visible en la interfaz.
- **Considera la abundancia de tooltips una señal de alerta.** Si la interfaz necesita muchos para entenderse, mejora en su lugar las etiquetas, el diseño o la arquitectura de la información.
- **Ten en cuenta los dispositivos táctiles.** Los tooltips solo funcionan en escritorio y no aparecen en pantallas táctiles, así que muestra la información importante de forma predeterminada en móvil.

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

Consulta [las buenas prácticas de Shopify para `<s-tooltip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices) (en inglés) para ver todas las recomendaciones.
