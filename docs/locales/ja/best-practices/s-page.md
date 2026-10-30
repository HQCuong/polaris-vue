- **すべてのページにタイトルを付ける。** `heading` に、マーチャントが今いるページを表すタイトルを設定します。
- **フローの中ではパンくずリストを追加する。** ページが大きなフローの 1 ステップである場合は、`breadcrumb-actions` スロットに戻るためのリンクを置きます。
- **ヘッダーのアクションはページ全体に関するものにする。** ヘッダーにアクションを置くのは、ページの一部ではなく、ページ全体に適用される場合だけにします。
- **アクションの数を制限する。** 1 つのページで使うのは、プライマリアクション 1 つとセカンダリアクション 3 つまでにします。
- **ページの末尾にはアクションを置かない。** ページの最後にはアクションを配置しないでください。

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

詳しいガイダンスについては、[`<s-page>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices)（英語）を参照してください。
