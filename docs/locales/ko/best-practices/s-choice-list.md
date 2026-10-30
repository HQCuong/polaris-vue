- **옵션에 맞는 선택 모드를 사용하세요.** 결제 수단이나 배송 속도처럼 서로 배타적인 옵션에는 단일 선택을 유지하고, 판매자가 여러 개를 고를 수 있다면 `multiple`을 설정합니다.
- **선택지 레이블은 결과를 설명하게 하세요.** "Email notifications for new orders"가 "Email"보다 더 많은 것을 알려 줍니다. 레이블은 짧게 유지하되, 그것만으로도 의미가 통할 만큼 명확해야 합니다.
- **`label`은 질문이나 서술문으로 작성하세요.** "Which shipping method?"나 "Select notification preferences" 같은 제목이 "Options"나 "Settings" 같은 모호한 단어보다 판매자에게 더 많은 정보를 줍니다.
- **복잡한 선택지는 `details` 슬롯에서 설명하세요.** 판매자가 그 옵션을 선택했을 때의 의미를 이해해야 한다면 개별 `SChoice`에 details를 추가합니다.
- **`error` 메시지를 구체적으로 작성하세요.** 일반적인 "Required field" 대신 "Select at least one notification preference"처럼 무엇이 빠졌는지 정확히 알려 줍니다.

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

전체 가이드는 [`<s-choice-list>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices)(영어)를 참고하세요.
