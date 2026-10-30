- **tooltip은 부가적이고 필수적이지 않은 세부 정보에 사용하세요.** 이해를 돕지만 꼭 필요하지는 않은 정보에 적합합니다. 오류, 필수 정보, 필수 안내는 절대 tooltip에 숨기지 마세요.
- **아이콘만 있는 버튼과 함께 사용하세요.** 아이콘 버튼에는 기능을 설명하는 tooltip이 필요합니다. 액션과, 있다면 키보드 단축키를 함께 넣습니다.
- **텍스트를 짧게 유지하세요.** 짧은 구절이나 한 문장이 이상적입니다. 내용이 길어진다면 UI에서 더 잘 보이는 자리에 둘 만한 내용일 가능성이 큽니다.
- **tooltip이 많다면 경고 신호로 여기세요.** 인터페이스를 이해하는 데 tooltip이 많이 필요하다면 대신 레이블, 레이아웃, 정보 구조를 개선합니다.
- **터치 기기를 기억하세요.** tooltip은 데스크톱에서만 동작하고 터치 화면에서는 나타나지 않으므로, 모바일에서는 중요한 정보를 기본으로 표시합니다.

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

전체 가이드는 [`<s-tooltip>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices)(영어)를 참고하세요.
