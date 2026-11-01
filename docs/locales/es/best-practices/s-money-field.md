- **Define `min` y `max` con límites realistas.** Por ejemplo, el precio de un producto puede usar un `min` de 0.01 para que no pueda ser cero, un descuento puede ir de 0 al total del pedido y un reembolso puede limitarse al importe pagado. Comprueba siempre también los valores con tus reglas de negocio.
- **Indica el límite exacto en `error`.** En lugar de "Invalid amount", escribe algo como "Price must be at least $0.01" para que los comerciantes sepan qué restricción no han cumplido.
- **No incluyas símbolos de moneda en `label` ni en `placeholder`.** Añadir "$" o un símbolo similar puede entrar en conflicto con el formato de moneda que el campo ya gestiona.
- **Nombra el importe según su propósito.** "Product base price" o "Discount amount" dicen más a los comerciantes que "Amount" o "Price".
- **Rellena previamente `value` al editar.** Muestra el importe actual para los valores existentes; para las entradas nuevas, considera un valor predeterminado razonable como 0.00 o un precio habitual.

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

Consulta [las buenas prácticas de Shopify para `<s-money-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices) (en inglés) para ver todas las recomendaciones.
