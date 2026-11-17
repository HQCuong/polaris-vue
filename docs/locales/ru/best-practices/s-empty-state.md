- **Объясните причину, затем решение.** Голый заголовок «No products» оставляет продавцов в догадках. Используйте `heading`, чтобы сказать, почему здесь пусто, а следующий шаг пусть предложит действие.
- **Начинайте с одного основного действия.** Используйте слот `primary-action` для единственного шага, который выводит продавцов из пустого состояния, а остальные варианты размещайте в `secondary-actions`.
- **Формулируйте отфильтрованные результаты иначе.** Пустой ресурс и фильтр, которому ничего не соответствует, — разные ситуации. Для отфильтрованных результатов подскажите продавцам, как изменить фильтр.
- **Относитесь к графике как к дополнению.** Работу выполняют заголовок и действие, поэтому в плотных макетах оставляйте слот `graphic` пустым, а если используете его, ограничьтесь одним значком или изображением.

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

Полное руководство см. в [рекомендациях Shopify для `<s-empty-state>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices) (на английском).
