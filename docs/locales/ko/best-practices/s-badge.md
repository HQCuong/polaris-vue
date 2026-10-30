- **맥락에 맞는 크기를 고르세요.** 표 셀, 목록 항목 등 여러 배지가 함께 놓이는 곳에서는 `size="base"`를 사용합니다. `size="large"`는 페이지 상단에 표시되는 주요 상태처럼 강조할 가치가 있는 단일 배지에만 사용합니다.
- **레이블은 한두 단어로 유지하세요.** "Fulfilled"나 "Out of stock" 같은 짧은 레이블은 빠르게 훑어볼 수 있습니다. 상태는 과거형으로 작성해 "Refund"가 아니라 "Refunded"처럼 씁니다.
- **상태에 맞는 tone을 사용하세요.** 조치가 필요한 오류나 긴급한 문제에는 `tone="critical"`, 주의가 필요한 문제에는 `tone="warning"`, 긍정적인 확인에는 `tone="success"`, 중립적인 상태에는 `tone="info"`를 사용합니다. 같은 상태에는 앱 전체에서 같은 tone을 지정합니다.
- **배지는 설명하는 대상 옆에 두세요.** 목록 항목에서는 배지를 제목 가까이에 둡니다. 표에서는 판매자가 훑어볼 수 있도록 배지에 별도 열을 할당합니다.
- **배지는 시스템 상태에만 사용하세요.** 배지는 시스템이 설정하는 정적 표시기이므로, 판매자가 만드는 태그나 판매자가 제거할 수 있는 항목에는 사용하지 않습니다.

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

전체 가이드는 [`<s-badge>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices)(영어)를 참고하세요.
