- **Давайте каждой странице заголовок.** Задайте в `heading` заголовок, описывающий страницу, на которой находится продавец.
- **Добавляйте навигационную цепочку внутри процесса.** Если страница является одним из шагов более крупного процесса, поместите ссылки возврата в слот `breadcrumb-actions`.
- **Оставляйте в шапке только действия для всей страницы.** Размещайте действия в шапке, только если они относятся ко всей странице, а не к одной её части.
- **Ограничивайте число действий.** Используйте на странице не больше одного основного действия и трёх второстепенных.
- **Не размещайте действия внизу страницы.** Не помещайте никаких действий в конец страницы.

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

Полное руководство см. в [рекомендациях Shopify для `<s-page>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices) (на английском).
