- **Elige el tamaño según el contexto.** Usa `size="base"` en celdas de tabla, elementos de lista o en cualquier lugar donde haya varios badges juntos. Reserva `size="large"` para un único badge que merezca destacar, como el estado principal que se muestra en la parte superior de una página.
- **Limita las etiquetas a una o dos palabras.** Las etiquetas cortas como "Fulfilled" u "Out of stock" se leen de un vistazo. Escribe los estados en pasado, es decir, "Refunded" en lugar de "Refund".
- **Ajusta el tono al estado.** Usa `tone="critical"` para errores o problemas urgentes que requieren acción, `tone="warning"` para problemas que requieren atención, `tone="success"` para confirmaciones positivas y `tone="info"` para estados neutros. Da el mismo tono al mismo estado en toda tu app.
- **Mantén los badges junto a lo que describen.** En un elemento de lista, coloca el badge cerca del título. En una tabla, dale a los badges su propia columna para que los comerciantes puedan recorrerla rápidamente.
- **Usa los badges solo para estados del sistema.** Los badges son indicadores estáticos definidos por el sistema, así que no los uses para etiquetas que crean los comerciantes ni para elementos que pueden eliminar.

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

Consulta [las buenas prácticas de Shopify para `<s-badge>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices) (en inglés) para ver todas las recomendaciones.
