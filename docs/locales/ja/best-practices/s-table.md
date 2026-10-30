- **マーチャントが比較するデータにテーブルを使う。** テーブルは、同じ属性を持ち、横に並べて見比べる必要がある多数のレコードに適しています。比較するもののない単純なリストには、よりシンプルなコンポーネントを選びます。
- **モバイルのリストレイアウトを考慮する。** モバイルではテーブルがリストに変わるため、ヘッダーと値がグリッドではなく、縦に積まれたラベルと値のペアとしても読みやすいかを確認します。
- **列の数を少なく保つ。** 列が多いとテーブルは見渡しにくくなり、横スクロールが必要になります。マーチャントのタスクに必要な列だけを表示し、残りは必要に応じて表示することを検討します。
- **わかりやすい列ヘッダーを書く。** 各 `STableHeader` は短くわかりやすくし、その列にどんなデータが入っているかをマーチャントが正確に把握できるようにします。
- **大規模なデータセットに備える。** 大きなテーブルはパフォーマンスと使いやすさを損ないます。行数がおおよそ 50〜100 を超えたら `paginate` を有効にするか、マーチャントが目的のレコードにすばやくたどり着けるよう、フィルターや検索の追加を検討します。

```vue
<STable paginate hasNextPage>
  <STableHeaderRow>
    <STableHeader>Product</STableHeader>
    <STableHeader format="numeric">Inventory</STableHeader>
  </STableHeaderRow>
  <STableBody>
    <STableRow>
      <STableCell>Snowboard</STableCell>
      <STableCell>24</STableCell>
    </STableRow>
  </STableBody>
</STable>
```

詳しいガイダンスについては、[`<s-table>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices)（英語）を参照してください。
