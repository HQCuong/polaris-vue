- **구체적인 `label`을 사용하세요.** "Customer email"이나 "Order notification email" 같은 이름이 단순한 "Email"이나 "Email address"보다 명확합니다.
- **`details`에 맥락을 추가하세요.** "Required for digital receipts"처럼 주소가 왜 필요한지 또는 어떻게 사용되는지 설명합니다.
- **`placeholder`에서 형식을 보여 주세요.** "you@example.com" 같은 예시 주소로 무엇을 입력해야 하는지 보여 주고, 레이블을 그대로 반복하지 않습니다.
- **`error` 메시지는 해결 방법을 담아 작성하세요.** "Enter a valid email address"처럼 판매자에게 주소를 어떻게 고쳐야 하는지 알려 줍니다.

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

전체 가이드는 [`<s-email-field>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices)(영어)를 참고하세요.
