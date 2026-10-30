- **함께 속한 콘텐츠를 묶으세요.** 관련 정보든 관련 컨트롤이든 각 섹션에 하나의 일관된 역할을 부여합니다. 그러면 섹션이 시각적 컨테이너로 동작하고 페이지 구조에 의미를 더합니다.
- **설명적인 제목을 작성하세요.** 판매자는 `heading`을 훑어보며 길을 찾으므로, 일반적인 제목에 기대지 말고 안에 무엇이 있는지 밝힙니다.
- **콘텐츠에 필요한 만큼만 중첩하세요.** 중첩된 섹션은 모양이 아니라 제목 위계와 페이지 개요에 영향을 줍니다. 최대 두세 단계로 유지하고, 추가 구조가 콘텐츠를 더 명확하게 할 때만 중첩합니다.
- **콘텐츠가 가장자리까지 채워져야 한다면 padding을 없애세요.** 섹션을 가득 채워야 하는 표나 이미지 같은 콘텐츠에는 `padding="none"`을 사용하고, 안쪽 콘텐츠가 자체적으로 충분한 여백을 유지하는지 확인합니다.
- **제목만으로 부족하면 `accessibilityLabel`을 추가하세요.** 화면에 보이는 제목만으로는 스크린 리더 사용자에게 섹션의 목적이 분명하지 않을 때, 빠진 맥락을 채워 주는 레이블을 지정합니다.
- **알맞은 헤더 슬롯을 고르세요.** tooltip이나 개수처럼 제목 자체를 꾸미는 세부 정보는 `accessory`에 넣습니다. 상태 배지처럼 섹션 전체에 관한 정보는 `supplemental`에 넣습니다. 버튼이나 메뉴 같은 액션은 `supplemental`에 넣을 수 없으므로 `accessory`에 둡니다.

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

전체 가이드는 [`<s-section>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices)(영어)를 참고하세요.
