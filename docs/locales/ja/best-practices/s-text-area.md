- **想定される回答に合わせてサイズを決める。** 表示される `rows` の数は、どれくらい書けばよいかを示します。小さなエリアは短い回答を、高さのあるエリアはより詳しい内容を求めていることを伝えます。
- **実際の必要性に基づいて文字数の制限を設定する。** `minLength` と `maxLength` はコンテンツに実際に必要な量に基づいて決め、その制限をマーチャントに前もって伝えます。
- **プレースホルダーは例として使う。** `placeholder` には、フィールドの用途を繰り返すのではなく、期待するコンテンツの種類、形式、トーンを示すテキストを書きます。
- **残りの文字数を表示する。** 最大文字数を設けている場合は、残りの文字数をマーチャントが確認できるようにし、上限を超えずに内容を収められるようにします。

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

詳しいガイダンスについては、[`<s-text-area>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices)（英語）を参照してください。
