- **범용 컨테이너로 사용하세요.** `SBox`는 콘텐츠를 묶기 위한 여백, 테두리, 배경을 처리합니다. 행이나 열 같은 특정 배치가 필요하다면 대신 `SStack`이나 `SGrid`를 사용합니다.
- **더 의미 있는 컴포넌트가 있는지 먼저 확인하세요.** `SSection`이나 `SBanner`처럼 콘텐츠의 성격을 이미 표현하는 컴포넌트가 있다면 그쪽을 우선합니다. 목적에 맞게 만들어진 컴포넌트는 의도가 더 분명하고 접근성도 더 좋습니다.
- **작은 화면을 고려하세요.** 데스크톱에서 잘 보이는 레이아웃도 모바일에서는 깨질 수 있으므로, 고정 크기에 의존하지 말고 반응형 값으로 여백과 레이아웃을 조정합니다.
- **영역과 인터랙티브 콘텐츠를 설명하세요.** 박스가 구분된 영역을 나타내거나 인터랙티브 콘텐츠를 담고 있다면 `accessibilityRole`과 `accessibilityLabel`을 설정해, 스크린 리더 사용자가 구조를 이해하고 탐색할 수 있게 합니다.
- **중첩을 얕게 유지하세요.** 박스 안에 박스를 계속 쌓으면 마크업이 복잡해지고 스타일을 유지하기 어려워집니다. 더 단순한 구조나 더 적합한 레이아웃 컴포넌트를 찾아보세요.

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

전체 가이드는 [`<s-box>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices)(영어)를 참고하세요.
