- **Usa un `label` específico.** Nombres como "Customer email" u "Order notification email" son más claros que un simple "Email" o "Email address".
- **Añade contexto en `details`.** Explica por qué se necesita la dirección o cómo se usa, por ejemplo "Required for digital receipts".
- **Muestra el formato en `placeholder`.** Una dirección de ejemplo como "you@example.com" muestra qué escribir; no te limites a repetir la etiqueta.
- **Haz que los mensajes de `error` sean útiles.** Indica a los comerciantes cómo corregir la dirección, por ejemplo "Enter a valid email address".

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

Consulta [las buenas prácticas de Shopify para `<s-email-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices) (en inglés) para ver todas las recomendaciones.
