- **Делайте подписи короткими.** Ориентир — от одного до трёх слов, например «Electronics» или «Summer sale».
- **Выбирайте `color` по важности.** Используйте `color="subdued"` для второстепенных чипов и оставляйте значение по умолчанию `"base"` для обычных вариантов выбора.
- **Сделайте удаление заметным.** Когда чип `removable`, убедитесь, что кнопка удаления видна и имеет понятные состояния наведения и фокуса.
- **Группируйте связанные чипы.** Располагайте их во встроенном `SStack`, чтобы они выстраивались по горизонтали с равными промежутками.

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

Полное руководство см. в [рекомендациях Shopify для `<s-clickable-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices) (на английском).
