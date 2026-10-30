- **URL은 직접 검증하세요.** 브라우저의 기본 URL 검증은 최소한이며 브라우저마다 다르므로, 구조, 허용되는 프로토콜, 사용 사례에서 받아들이는 형식에 대한 검사를 직접 추가합니다.
- **기대하는 형식을 보여 주세요.** 프로토콜을 포함해야 하는지, 어떤 프로토콜이 허용되는지, 어떤 종류의 URL을 원하는지 판매자에게 알려 줍니다. `placeholder`에 완전한 예시 URL을 넣으면 이를 분명히 할 수 있습니다.
- **프로토콜이 빠진 경우의 처리를 정하세요.** 판매자는 `https://`를 빠뜨리는 경우가 많습니다. 자동으로 붙여 줄지, 프로토콜 없는 URL을 허용할지, 무엇이 빠졌는지 설명하는 `error`를 보여 줄지 결정합니다.
- **URL이 사용되는 곳에 맞게 길이 제한을 정하세요.** 브라우저와 서버가 처리하는 최대 길이는 서로 다르므로, 임의의 숫자가 아니라 URL의 목적지에 따라 `maxLength`를 설정하고, 중요한 경우 그 제한을 알려 줍니다.
- **URL의 용도를 설명하세요.** 상품 이미지 URL, 소셜 프로필 링크, 외부 참조는 각각 요구하는 것이 다르므로, `label`과 `details`로 목적을 분명히 합니다.

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

전체 가이드는 [`<s-url-field>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices)(영어)를 참고하세요.
