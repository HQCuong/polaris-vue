- **숫자만 감싸세요.** 숫자 값 자체만 `SNumber`에 넣고, 주변 단어는 `SText`나 `SParagraph`에 둡니다. 고정폭 숫자(tabular digits)는 수치를 깔끔하게 정렬하지만 일반 단어는 고르지 않게 보이게 만듭니다.
- **값은 앱에서 먼저 서식을 지정하세요.** `SNumber`는 값의 서식이 아니라 숫자의 모양을 제어하므로, 판매자의 로캘에 맞게 통화 기호, 소수점, 천 단위 구분 기호를 직접 추가합니다.
- **수치에 상태가 있을 때만 tone을 사용하세요.** 품절된 재고처럼 숫자 자체가 무언가를 알릴 때 `tone`을 설정합니다. 모든 수치에 tone을 주면 어떤 것도 눈에 띄지 않습니다.
- **중요도에 따라 수치의 크기를 정하세요.** 합계처럼 판매자가 먼저 읽어야 할 숫자에는 더 큰 `fontSize`를 지정하고, 부차적인 수치는 기본 크기로 둡니다.

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

전체 가이드는 [`<s-number>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices)(영어)를 참고하세요.
