- **モーダルは集中が必要な判断のためにとっておく。** マーチャントが特定の選択をする必要がある場合や、重要な事柄を確認する必要がある場合に開きます。タスクやツールをページ上に直接置けるなら、そこに置きます。
- **使用は控えめにする。** モーダルは毎回マーチャントの作業を中断させるため、デフォルトのパターンとしてではなく、重要な場面での最後の手段として扱います。
- **メインのアクションを目立たせる。** `primary-action` スロットに、明確で目立つコールトゥアクションを 1 つ置きます。
- **アクションには具体的な動詞でラベルを付ける。** 「Delete」「Save」「Continue」のようなボタンは何が起きるかをマーチャントに伝えます。「Yes」「OK」「Submit」のような汎用的なラベルは避けます。
- **破壊的なアクションの結果を明記する。** アクションが何かを削除または破棄する場合は、マーチャントが何を失うのかをモーダル本文で説明します。
- **モーダルをネストしない。** すでに開いているモーダルの中から、2 つ目のモーダルを開かないようにします。

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

詳しいガイダンスについては、[`<s-modal>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices)（英語）を参照してください。
