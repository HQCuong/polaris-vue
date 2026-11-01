- **Escribe párrafos cortos.** Apunta a entre dos y cuatro oraciones en lenguaje sencillo y sin jerga. Los comerciantes suelen leer en diagonal, así que divide el contenido largo en partes más pequeñas.
- **Usa el tono para señalar la intención.** `tone="critical"` es adecuado para errores, `"caution"` para advertencias y `"success"` para confirmaciones. Acompaña siempre el color con un texto claro en lugar de depender solo de él.
- **Diseña pensando en la accesibilidad.** Añade texto solo para lectores de pantalla (`accessibilityVisibility="exclusive"`) para el contexto que los comerciantes videntes obtienen del diseño o de los iconos, y asegúrate de que el texto con tono mantenga suficiente contraste para leerse.
- **Limita las líneas con cuidado.** `lineClamp` ayuda en espacios reducidos como tarjetas o vistas previas, pero nunca dejes que el truncado oculte información crítica.

Consulta [las buenas prácticas de Shopify para `<s-paragraph>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/paragraph#best-practices) (en inglés) para ver todas las recomendaciones.
