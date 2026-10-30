- **ビューポートではなくコンテナに合わせる。** クエリコンテナを使うと、コンポーネントがコンテナの幅に応じて変化できます。サイドバーとメインカラムの両方に表示される商品カードのように、幅の異なる場所に現れるコンポーネントに役立ちます。
- **複数ある場合はコンテナに名前を付ける。** 複数のクエリコンテナで異なるクエリが必要な場合は、それぞれにわかりやすい `containerName` を付けて対象を指定できるようにします。名前のないコンテナは、すべて同じクエリに反応します。
- **レスポンシブな値は props に指定する。** コンテナは、`padding="@container (inline-size > 500px) large-500, none"` のようなレスポンシブな prop の値を Polaris コンポーネントが解決するためのコンテキストを提供するため、コンテナクエリの CSS を自分で書く必要はありません。
- **必要な場所にだけ使う。** クエリコンテナがあるたびにブラウザはそのサイズを追跡し、条件付きのスタイルを適用します。すべての要素をラップするのではなく、コンテナに基づくレスポンシブ対応が必要な場所にだけ追加します。

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

詳しいガイダンスについては、[`<s-query-container>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices)（英語）を参照してください。
