- **選択モードを選択肢に合わせる。** 支払い方法や配送スピードのように互いに排他的な選択肢には単一選択を使い、マーチャントが複数選べる場合は `multiple` を設定します。
- **選択肢のラベルで結果を説明する。** 「Email」よりも「Email notifications for new orders」のほうが多くを伝えます。ラベルは短く、それでいて単独で意味が通じる明確さを保ちます。
- **`label` は質問または文の形にする。** 「Which shipping method?」や「Select notification preferences」のようなタイトルは、「Options」や「Settings」のような曖昧な語よりも多くをマーチャントに伝えます。
- **複雑な選択肢は `details` スロットで説明する。** その選択肢を選ぶと何が起きるかをマーチャントが理解する必要がある場合は、個々の `SChoice` に details を追加します。
- **`error` メッセージは具体的にする。** 汎用的な「Required field」ではなく、「Select at least one notification preference」のように、何が足りないのかを正確に伝えます。

```vue
<SChoiceList label="Which shipping method?">
  <SChoice value="standard">Standard shipping</SChoice>
  <SChoice value="express">
    Express shipping
    <template #details>
      <SText>Costs more, but orders arrive in 1–2 business days.</SText>
    </template>
  </SChoice>
</SChoiceList>
```

詳しいガイダンスについては、[`<s-choice-list>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices)（英語）を参照してください。
