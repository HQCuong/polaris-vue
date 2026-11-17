- **Используйте меню для второстепенных действий.** Основные действия вроде «Save» держите видимыми на самой странице. Меню подходят для действий, которые продавцы выполняют реже, или деструктивных, таких как «Archive» или «Export data», которым не нужно постоянное место.
- **Формулируйте подписи как глагол плюс существительное.** Подписи вроде «Edit details» или «Export as CSV» точно говорят, что произойдёт; избегайте расплывчатых, таких как «Options», «More» или «Settings».
- **Делите длинные меню на секции.** Когда в меню четыре и более элемента, сгруппируйте связанные действия в `SSection` с `heading`, например «Manage» для повседневных действий и «Danger zone» для деструктивных.
- **Добавляйте значки, которые подкрепляют подпись.** Значки вроде `edit` для редактирования, `delete` для удаления или `download` для экспорта помогают продавцам узнавать действие, но они должны усиливать текст, а не заменять его.
- **Отключайте только то, что временно недоступно.** Задайте `disabled` для элемента, когда действие неприменимо в текущем контексте, например возврат средств по заказу, по которому они уже возвращены. Если действие неприменимо никогда, не включайте его в меню.

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

Полное руководство см. в [рекомендациях Shopify для `<s-menu>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices) (на английском).
