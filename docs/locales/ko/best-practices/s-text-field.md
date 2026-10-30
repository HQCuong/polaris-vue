- **어떤 입력을 기대하는지 분명히 하세요.** 무엇을 어떤 형식으로 입력해야 하는지 알려 주는 `label`과 `placeholder`를 작성합니다. 모호한 문구는 추측, 검증 오류, 불만으로 이어집니다.
- **prefix나 suffix로 맥락을 더하세요.** `prefix`와 `suffix`로 값의 종류와 형식을 보여 줍니다. 예를 들어 판매자가 전체 URL을 입력해야 하는지 하위 도메인만 입력하면 되는지, 전체 가격인지 금액만인지를 알려 줄 수 있습니다.
- **제약은 실제 요구 사항에 근거하세요.** 임의의 숫자가 아니라 실제 비즈니스 요구에 따라 `minLength`, `maxLength`, 검증 규칙을 설정하고, 판매자에게 그 내용을 알려 줍니다.
- **피드백은 일찍, 구체적으로 주세요.** 제출할 때만이 아니라 입력하는 동안 입력이 유효한지 알려 줍니다. 유효하지 않다면 `error`로 무엇이 잘못되었고 어떻게 고치면 되는지 설명합니다.

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

전체 가이드는 [`<s-text-field>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices)(영어)를 참고하세요.
