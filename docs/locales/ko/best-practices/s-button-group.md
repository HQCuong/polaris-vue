- **관련된 액션을 함께 묶으세요.** 같은 작업에 속하는 행동 유도 버튼을 묶어, 판매자가 선택지와 그 관계를 한눈에 볼 수 있게 합니다.
- **시각적 위계를 유지하세요.** 주요 액션 버튼에는 `variant="primary"`를, 보조 버튼에는 `variant="secondary"`나 `variant="tertiary"`를 사용해 시선을 이끕니다.
- **버튼을 너무 많이 넣지 마세요.** 선택지가 길게 늘어서면 판매자가 부담을 느끼고 결정하기 어려워집니다.
- **토글에는 세그먼트 그룹을 사용하세요.** 보기나 필터 전환처럼 밀접하게 관련된 옵션에는 `gap="none"`을 설정해 버튼들을 하나의 세그먼트 컨트롤로 합칩니다.
- **파괴적인 액션은 따로 두세요.** 신중하게 배치하고 `tone="critical"`을 지정해 실수로 실행하기 어렵게 만듭니다.

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

전체 가이드는 [`<s-button-group>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices)(영어)를 참고하세요.
