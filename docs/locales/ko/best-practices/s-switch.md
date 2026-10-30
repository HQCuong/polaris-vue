- **switch를 저장 버튼과 함께 쓰지 마세요.** switch는 전환하는 즉시 적용되므로, 저장 버튼을 추가하면 판매자가 변경 사항이 언제 실제로 적용되는지 헷갈리게 됩니다.
- **어떤 설정인지 분명히 하세요.** switch가 무엇을 제어하고 켜짐과 꺼짐이 무엇을 뜻하는지 알려 주는 `label`을 작성해, 판매자가 알아보려고 직접 전환해 볼 필요가 없게 합니다.
- **결과를 설명하세요.** `details`로 switch를 전환하면 무엇이 바뀌는지 설명합니다. 특히 중요한 기능이나 데이터에 영향을 주는 설정이라면 판매자가 확신을 갖고 결정할 수 있게 합니다.
- **관련된 switch를 묶고 정렬하세요.** 페이지에 switch가 여러 개 있다면 관련 설정을 논리적인 순서로 함께 두어 판매자가 쉽게 찾고 설정할 수 있게 합니다.
- **switch를 사용할 수 없는 이유를 설명하세요.** 권한, 의존 관계, 요금제 한도 때문에 switch가 `disabled` 상태라면 그 이유와 일시적인지 여부, 그리고 사용하려면 무엇을 해야 하는지 판매자에게 알려 줍니다.

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

전체 가이드는 [`<s-switch>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices)(영어)를 참고하세요.
