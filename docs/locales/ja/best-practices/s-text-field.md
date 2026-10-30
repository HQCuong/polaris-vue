- **期待される入力をわかりやすくする。** 何をどの形式で入力すればよいかをマーチャントに伝える `label` と `placeholder` を書きます。曖昧な文言は、推測、検証エラー、ストレスにつながります。
- **プレフィックスやサフィックスで文脈を加える。** `prefix` と `suffix` を使って、URL 全体を入力するのかサブドメインだけなのか、価格全体なのか金額だけなのかなど、値の種類と形式を示します。
- **制約は実際の要件に基づける。** `minLength`、`maxLength`、検証ルールは、任意の数値ではなく実際のビジネス上の必要性に応じて設定し、その内容をマーチャントに伝えます。
- **早めに、具体的なフィードバックを返す。** 送信時だけでなく入力中にも、入力が有効かどうかをマーチャントに知らせます。無効な場合は、`error` で何が問題でどう直せばよいかを説明します。

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

詳しいガイダンスについては、[`<s-text-field>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices)（英語）を参照してください。
