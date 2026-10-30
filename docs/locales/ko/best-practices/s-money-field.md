- **`min`과 `max`를 현실적인 한도로 설정하세요.** 예를 들어 상품 가격은 0이 될 수 없도록 `min`을 0.01로, 할인은 0부터 주문 총액까지로, 환불은 결제 금액을 상한으로 둘 수 있습니다. 값은 항상 비즈니스 규칙에 따라서도 검사합니다.
- **`error`에 정확한 한도를 밝히세요.** "Invalid amount" 대신 "Price must be at least $0.01"처럼 말해 판매자가 어떤 제약을 어겼는지 알 수 있게 합니다.
- **`label`과 `placeholder`에 통화 기호를 넣지 마세요.** "$" 같은 기호를 추가하면 필드가 이미 처리하는 통화 형식과 충돌할 수 있습니다.
- **금액의 용도에 따라 레이블을 붙이세요.** "Product base price"나 "Discount amount"가 "Amount"나 "Price"보다 판매자에게 더 많은 정보를 줍니다.
- **편집할 때는 `value`를 미리 채우세요.** 기존 값에는 현재 금액을 보여 주고, 새 항목에는 0.00이나 일반적인 가격 같은 합리적인 기본값을 고려합니다.

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

전체 가이드는 [`<s-money-field>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices)(영어)를 참고하세요.
