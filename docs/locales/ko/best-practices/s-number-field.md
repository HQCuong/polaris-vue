- **순수한 숫자 값에만 사용하세요.** 수량, 측정값, 백분율 같은 값에 사용합니다. 상품 코드나 전화번호처럼 문자나 기호가 포함될 수 있는 값이라면 대신 `STextField`를 사용합니다.
- **단위를 표시하세요.** `prefix`나 `suffix`로 숫자가 무엇을 측정하는지 알려, 판매자가 달러를 입력하는지 킬로그램이나 백분율을 입력하는지 추측하지 않게 합니다.
- **비즈니스 규칙에 맞는 한도를 설정하세요.** 실제로 허용되는 범위를 반영한 `min`과 `max` 값을 지정하면, 판매자가 폼을 제출하기 전에 유효한 값을 입력하도록 이끌 수 있습니다.
- **검증하고 오류를 설명하세요.** 모든 숫자 입력을 검사하고, 실패하면 일반적인 메시지 대신 `error`로 무엇이 잘못되었고 어떻게 고치면 되는지 정확히 알려 줍니다.

```vue
<SNumberField label="Discount" suffix="%" :min="0" :max="100" />
```

전체 가이드는 [`<s-number-field>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field#best-practices)(영어)를 참고하세요.
