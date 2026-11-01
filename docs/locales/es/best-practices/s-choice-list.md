- **Ajusta el modo de selección a las opciones.** Mantén la selección única para opciones que se excluyen entre sí, como métodos de pago o velocidades de envío, y define `multiple` cuando los comerciantes puedan elegir más de una.
- **Haz que las etiquetas de cada opción describan el resultado.** "Email notifications for new orders" dice más que "Email". Mantén las etiquetas cortas, pero lo bastante claras para entenderse por sí solas.
- **Formula el `label` como una pregunta o una afirmación.** Un título como "Which shipping method?" o "Select notification preferences" dice más a los comerciantes que una palabra vaga como "Options" o "Settings".
- **Explica las opciones complejas en el slot `details`.** Añade detalles a un `SChoice` concreto cuando los comerciantes necesiten entender lo que implica elegirlo.
- **Haz que los mensajes de `error` sean específicos.** Indica a los comerciantes exactamente qué falta, por ejemplo "Select at least one notification preference", en lugar de un genérico "Required field".

```vue
<SChoiceList label="Which shipping method?">
  <SChoice value="standard">Standard shipping</SChoice>
  <SChoice value="express">
    Express shipping
    <template #details>
      <SText>Costs more, but orders arrive in 1–2 business days.</SText>
    </template>
  </SChoice>
</SChoiceList>
```

Consulta [las buenas prácticas de Shopify para `<s-choice-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices) (en inglés) para ver todas las recomendaciones.
