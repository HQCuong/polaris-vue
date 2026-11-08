- **Labels छोटे रखें।** लक्ष्य एक से तीन शब्द है, जैसे "Electronics" या "Summer sale"।
- **`color` को महत्व के अनुसार चुनें।** द्वितीयक chips के लिए `color="subdued"` इस्तेमाल करें और सामान्य selections के लिए default `"base"` रहने दें।
- **हटाने का विकल्प आसानी से दिखे।** जब कोई chip `removable` हो, तो जाँच लें कि उसका remove button दिख रहा है और उसकी hover और focus states साफ़ हैं।
- **संबंधित chips को समूह में रखें।** उन्हें inline `SStack` में रखें ताकि वे समान spacing के साथ क्षैतिज रूप से एक कतार में दिखें।

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

सभी सुझावों के लिए [`<s-clickable-chip>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices) (अंग्रेज़ी में) देखें।
