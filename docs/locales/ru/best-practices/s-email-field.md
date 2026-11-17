- **Используйте конкретный `label`.** Названия вроде «Customer email» или «Order notification email» понятнее, чем простое «Email» или «Email address».
- **Добавляйте контекст в `details`.** Объясните, зачем нужен адрес или как он используется, например «Required for digital receipts».
- **Показывайте формат в `placeholder`.** Пример адреса вроде «you@example.com» показывает, что вводить; не повторяйте просто подпись.
- **Делайте сообщения `error` конструктивными.** Подскажите продавцам, как исправить адрес, например «Enter a valid email address».

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

Полное руководство см. в [рекомендациях Shopify для `<s-email-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices) (на английском).
