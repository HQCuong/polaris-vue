- **Подбирайте режим выбора под варианты.** Оставляйте одиночный выбор для взаимоисключающих вариантов, таких как способы оплаты или скорость доставки, и задавайте `multiple`, когда продавцы могут выбрать больше одного.
- **Пусть подписи вариантов описывают результат.** «Email notifications for new orders» говорит больше, чем «Email». Делайте подписи короткими, но достаточно ясными, чтобы они были понятны сами по себе.
- **Формулируйте `label` как вопрос или утверждение.** Заголовок вроде «Which shipping method?» или «Select notification preferences» сообщает продавцам больше, чем расплывчатое слово «Options» или «Settings».
- **Поясняйте сложные варианты в слоте `details`.** Добавьте детали к отдельному `SChoice`, когда продавцам нужно понять, что повлечёт его выбор.
- **Делайте сообщения `error` конкретными.** Сообщайте продавцам, чего именно не хватает, например «Select at least one notification preference», вместо общего «Required field».

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

Полное руководство см. в [рекомендациях Shopify для `<s-choice-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices) (на английском).
