- **`min` と `max` を現実的な範囲に設定する。** たとえば、商品価格は 0 にならないよう `min` を 0.01 にし、割引は 0 から注文合計までの範囲にし、返金は支払額を上限にできます。値は必ずビジネスルールとも照らし合わせて確認してください。
- **`error` では具体的な制限を示す。** 「Invalid amount」ではなく、「Price must be at least $0.01」のように伝え、どの制約に違反したのかをマーチャントがわかるようにします。
- **`label` と `placeholder` に通貨記号を入れない。** 「$」などを追加すると、フィールドがすでに行っている通貨の書式設定と競合することがあります。
- **金額の用途をラベルにする。** 「Product base price」や「Discount amount」は、「Amount」や「Price」よりも多くをマーチャントに伝えます。
- **編集時は `value` をあらかじめ入れておく。** 既存の値には現在の金額を表示し、新規入力では 0.00 や一般的な価格など、妥当なデフォルト値を検討します。

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

詳しいガイダンスについては、[`<s-money-field>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices)（英語）を参照してください。
