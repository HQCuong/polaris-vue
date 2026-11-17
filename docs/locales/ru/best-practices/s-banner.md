- **Один баннер — одна тема.** Каждый баннер должен содержать одно сообщение или одно необходимое действие, чтобы продавцам не приходилось гадать, о чём он.
- **Пишите для беглого просмотра.** Делайте текст достаточно коротким, чтобы продавец с одного взгляда понимал сообщение и что делать дальше.
- **Давайте продавцам следующий шаг.** Баннеры с `tone="info"`, `tone="warning"` или `tone="critical"` должны включать призыв к действию, который конкретно объясняет, как продолжить.
- **Позвольте продавцам закрывать баннеры.** Задавайте `dismissible`, если сообщение не требует немедленных действий, и избегайте баннеров, которые остаются на экране без возможности закрыть их.
- **Размещайте баннеры по области действия.** Ставьте баннер вне секций для сообщения обо всей странице или внутри секции, если он относится к её содержимому.

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

Полное руководство см. в [рекомендациях Shopify для `<s-banner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices) (на английском).
