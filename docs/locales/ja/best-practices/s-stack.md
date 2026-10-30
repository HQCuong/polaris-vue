- **余白で関係性を表す。** 小さな `gap` は項目が互いに関連していることを示し、大きなものは別々のグループを区切ります。コンテンツの階層に合った余白を選びます。
- **インラインのスタックは折り返すものと考える。** `direction="inline"` では、スペースが足りなくなると項目が次の行に移ります。通常はそれが望ましい動作ですが、改行位置や複数行を厳密に制御する必要がある場合は、別のレイアウト手法を使います。
- **配置は意図して設定する。** ほとんどのレイアウトにはデフォルトの配置が適しています。項目のサイズが異なる場合や特定の位置に置く必要がある場合は、`alignItems` や `justifyContent` を調整します。

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

詳しいガイダンスについては、[`<s-stack>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices)（英語）を参照してください。
