- **배너 하나에는 한 가지 내용만 담으세요.** 각 배너에는 하나의 메시지나 하나의 필수 조치만 담아, 판매자가 무엇에 관한 배너인지 헷갈리지 않게 합니다.
- **빠르게 훑어볼 수 있게 작성하세요.** 판매자가 메시지와 다음에 할 일을 한눈에 파악할 수 있을 만큼 텍스트를 짧게 유지합니다.
- **판매자에게 다음 단계를 제시하세요.** `tone="info"`, `tone="warning"`, `tone="critical"` 배너에는 어떻게 진행해야 하는지 구체적으로 알려 주는 행동 유도 버튼을 포함해야 합니다.
- **판매자가 배너를 닫을 수 있게 하세요.** 메시지에 즉각적인 조치가 필요한 경우가 아니라면 `dismissible`을 설정하고, 닫을 방법 없이 화면에 계속 남는 배너는 피합니다.
- **범위에 따라 배너를 배치하세요.** 페이지 전체에 관한 메시지라면 배너를 어떤 섹션에도 넣지 말고, 특정 섹션의 콘텐츠에 관한 메시지라면 해당 섹션 안에 넣습니다.

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

전체 가이드는 [`<s-banner>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices)(영어)를 참고하세요.
