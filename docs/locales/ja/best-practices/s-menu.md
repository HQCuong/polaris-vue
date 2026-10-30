- **メニューは二次的なアクションに使う。** 「Save」のようなプライマリアクションはページ上に表示したままにします。メニューは、使用頻度の低いアクションや、「Archive」や「Export data」のような常設のスペースを必要としない破壊的なアクションに適しています。
- **ラベルは動詞と名詞で書く。** 「Edit details」や「Export as CSV」のようなラベルは、何が起きるかを正確に伝えます。「Options」「More」「Settings」のような曖昧なラベルは避けます。
- **長いメニューはセクションに分ける。** メニューの項目が 4 つ以上になったら、関連するアクションを `heading` 付きの `SSection` にまとめます。たとえば、日常的なアクションは「Manage」、破壊的なアクションは「Danger zone」とします。
- **ラベルを補うアイコンを追加する。** 編集の `edit`、削除の `delete`、エクスポートの `download` のようなアイコンは、マーチャントがアクションを認識する助けになりますが、テキストを補強するものであり、テキストの代わりにはなりません。
- **無効にするのは、いま使えないものだけにする。** すでに返金済みの注文の返金のように、現在のコンテキストで適用できないアクションの項目には `disabled` を設定します。決して適用されないアクションは、メニューに含めないでください。

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

詳しいガイダンスについては、[`<s-menu>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices)（英語）を参照してください。
