- **URL は自分で検証する。** ブラウザに組み込まれた URL の検証は最小限で、ブラウザによっても異なるため、構造、許可するプロトコル、ユースケースで受け付ける形式について独自のチェックを追加します。
- **期待する形式を示す。** プロトコルを含めるべきか、どのプロトコルが許可されるか、どんな種類の URL が必要かをマーチャントに伝えます。`placeholder` に完全な URL の例を入れると、それが明確になります。
- **プロトコルがない場合の扱いを決める。** マーチャントは `https://` を省略しがちです。自動で補うのか、プロトコルなしの URL を受け付けるのか、何が足りないかを説明する `error` を表示するのかを決めます。
- **URL の使われ方に合わせて長さの制限を選ぶ。** ブラウザやサーバーによって扱える最大長は異なるため、`maxLength` は任意の数値ではなく URL の用途先に基づいて設定し、重要な場合はその制限を明示します。
- **URL の用途を説明する。** 商品画像の URL、SNS のプロフィールリンク、外部の参照先では、それぞれ求められるものが異なるため、`label` と `details` で用途を明確にします。

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

詳しいガイダンスについては、[`<s-url-field>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices)（英語）を参照してください。
