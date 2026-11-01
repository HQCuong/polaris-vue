- **No combines los interruptores con un botón de guardar.** Un interruptor surte efecto en el momento en que se activa o desactiva, así que añadir un botón de guardar deja a los comerciantes sin saber cuándo se aplica realmente su cambio.
- **Haz que el ajuste sea evidente.** Escribe un `label` que indique a los comerciantes qué controla el interruptor y qué significan activado y desactivado, para que no tengan que accionarlo solo para averiguarlo.
- **Describe las consecuencias.** Usa `details` para explicar qué cambia al accionar el interruptor, sobre todo en ajustes que afectan a funciones o datos importantes, para que los comerciantes decidan con confianza.
- **Agrupa y ordena los interruptores relacionados.** Cuando una página tiene varios interruptores, mantén juntos los ajustes relacionados en un orden lógico para que los comerciantes puedan encontrarlos y configurarlos fácilmente.
- **Explica por qué un interruptor no está disponible.** Cuando un interruptor está `disabled` por permisos, dependencias o límites del plan, indica a los comerciantes el motivo, si es temporal y qué deben hacer para desbloquearlo.

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

Consulta [las buenas prácticas de Shopify para `<s-switch>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices) (en inglés) para ver todas las recomendaciones.
