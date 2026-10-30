- **原因を説明し、次に解決策を示す。** 「No products」という見出しだけでは、マーチャントは推測するしかありません。`heading` で何もない理由を伝え、アクションで次のステップを示します。
- **プライマリアクションは 1 つに絞る。** マーチャントが空の状態から抜け出すための 1 つのステップには `primary-action` スロットを使い、その他の選択肢は `secondary-actions` に置きます。
- **フィルター結果では言い回しを変える。** 何も登録されていないリソースと、フィルターに一致するものがない場合とは異なる状況です。フィルター結果では、フィルターの調整方法をマーチャントに伝えます。
- **グラフィックは補助として扱う。** 主な役割を果たすのは見出しとアクションなので、密度の高いレイアウトでは `graphic` スロットを空のままにし、使う場合もアイコンまたは画像 1 つに限ります。

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

詳しいガイダンスについては、[`<s-empty-state>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices)（英語）を参照してください。
