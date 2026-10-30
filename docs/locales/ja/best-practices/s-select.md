- **決まった選択肢のセットに使う。** セレクトは、マーチャントがあらかじめ定義されたリストから選ぶ場合に適しています。独自の値を入力する必要がある場合や、長いリストから探す必要がある場合は、入力に応じて候補を提示するテキストフィールドや、検索できるドロップダウンのほうが適しています。
- **選択肢の順序を意図的に決める。** 関連する選択肢をグループ化し、よく使われるものを先頭に置き、自然な順序がない場合はアルファベット順に並べて、マーチャントがすばやく選択肢を見つけられるようにします。
- **ざっと見てわかるラベルを書く。** 各選択肢に十分な文脈を持たせ、マーチャントがいくつも開いて読まなくても選択肢を区別できるようにします。
- **初期状態は意図して選ぶ。** 明らかなデフォルトがある場合は選択肢をあらかじめ選択しておき、マーチャントに意識して選んでほしい場合は `placeholder` を使います。初期状態を曖昧なままにしないでください。
- **検証の問題を説明する。** 選択が必須の場合や無効な場合は、`error` で何をすべきかを具体的に伝えます。状況に合わせたメッセージは、汎用的なものよりもマーチャントがフォームを早く完了する助けになります。

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

詳しいガイダンスについては、[`<s-select>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices)（英語）を参照してください。
