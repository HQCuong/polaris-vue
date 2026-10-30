- **関連するアクションをまとめる。** 同じタスクに属するコールトゥアクションをグループ化し、マーチャントが選択肢とその関係を把握できるようにします。
- **視覚的な階層を保つ。** メインのアクションのボタンには `variant="primary"` を、補助的なものには `variant="secondary"` または `variant="tertiary"` を使い、注目を誘導します。
- **ボタンを増やしすぎない。** 選択肢が長く並ぶとマーチャントは圧倒され、判断しにくくなります。
- **切り替えにはセグメント化したグループを使う。** ビューやフィルターの切り替えのように密接に関連する選択肢では、`gap="none"` を設定してボタンを 1 つのセグメントコントロールにつなげます。
- **破壊的なアクションは区別する。** 意図的な位置に配置し、`tone="critical"` を付けて、誤って実行されにくくします。

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

詳しいガイダンスについては、[`<s-button-group>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices)（英語）を参照してください。
