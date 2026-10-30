- **측정할 수 있는 작업에 사용하세요.** 작업을 전체 중 일부로 표현할 수 있을 때 progress bar를 사용합니다. 얼마나 걸릴지, 얼마나 진행되었는지 알 수 없다면 spinner가 더 가벼운 선택입니다.
- **무엇이 진행 중인지 밝히세요.** `accessibilityLabel`에 "Importing products"나 "Storage used"처럼 정확한 설명을 지정합니다. 스크린 리더는 이 레이블로 progress bar를 읽어 주며, 생략하면 기본값이 없습니다.
- **숫자가 중요하면 텍스트를 추가하세요.** progress bar 자체에는 레이블이나 백분율이 표시되지 않으므로, 판매자에게 수치가 필요하다면 옆에 텍스트를 두고 그 텍스트를 `value`와 맞춰 갱신합니다.
- **`max`를 실제 총량으로 설정하세요.** 모든 것을 백분율로 바꾸지 말고 파일 개수나 할당량 크기처럼 실제 개수나 상한을 사용합니다. 그러면 작업이 끝날 때마다 `value`를 간단히 갱신할 수 있습니다.
- **tone은 문제를 알릴 때만 사용하세요.** `tone="critical"`과 `tone="warning"`은 한도를 모두 사용한 경우처럼 문제를 나타내는 진행 상황에만 사용합니다. 일반적인 진행 중 작업은 기본 tone으로 둡니다.

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

전체 가이드는 [`<s-progress>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices)(영어)를 참고하세요.
