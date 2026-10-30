- **ラベルは短くする。** 「Electronics」や「Summer sale」のように、1〜3 語を目安にします。
- **重要度に応じて `color` を選ぶ。** 二次的なチップには `color="subdued"` を使い、標準的な選択にはデフォルトの `"base"` のままにします。
- **削除操作をわかりやすくする。** チップが `removable` の場合は、削除ボタンが見えていて、ホバー時とフォーカス時の状態がはっきりしているかを確認します。
- **関連するチップをまとめる。** インラインの `SStack` に並べ、横一列に均等な間隔でそろえます。

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

詳しいガイダンスについては、[`<s-clickable-chip>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices)（英語）を参照してください。
