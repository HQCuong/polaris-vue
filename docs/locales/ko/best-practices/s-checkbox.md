- **각 체크박스를 독립적으로 유지하세요.** 판매자는 한 체크박스가 다른 체크박스에 영향을 주지 않는 상태에서 원하는 조합으로 옵션을 선택할 수 있어야 합니다.
- **모든 체크박스에 설명적인 `label`을 지정하세요.** 특히 체크박스가 설정을 켜고 끄는 경우에 중요하며, 판매자가 무엇을 활성화하는지 정확히 알 수 있어야 합니다.
- **옵션을 논리적인 순서로 정렬하세요.** 알파벳순, 숫자순 또는 시간순으로 정렬해 판매자가 원하는 옵션을 빠르게 찾게 합니다.
- **`indeterminate`는 부분적인 "전체 선택"에만 사용하세요.** 그룹의 일부 항목만 선택된 경우 "전체 선택" 체크박스에 사용합니다.
- **맥락이 도움이 될 때 `details`를 추가하세요.** 레이블만으로 충분하지 않을 때에만 옵션의 기능에 대한 추가 설명으로 사용합니다.

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

전체 가이드는 [`<s-checkbox>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices)(영어)를 참고하세요.
