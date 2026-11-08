- **संबंधित actions को साथ रखें।** एक ही काम से जुड़े calls to action को समूह में रखें, ताकि merchants अपने विकल्प और उनके आपसी संबंध देख सकें।
- **Visual hierarchy बनाए रखें।** ध्यान सही दिशा में ले जाने के लिए मुख्य action वाले button पर `variant="primary"` और सहायक buttons पर `variant="secondary"` या `variant="tertiary"` इस्तेमाल करें।
- **बहुत ज़्यादा buttons न जोड़ें।** विकल्पों की लंबी कतार merchants को उलझा देती है और फ़ैसला लेना मुश्किल बना देती है।
- **Toggles के लिए segmented group इस्तेमाल करें।** आपस में गहराई से जुड़े विकल्पों के लिए, जैसे views या filters बदलना, `gap="none"` सेट करें ताकि buttons जुड़कर एक segmented control बन जाएँ।
- **Destructive actions को अलग रखें।** उन्हें सोच-समझकर रखें और `tone="critical"` दें, ताकि वे गलती से ट्रिगर न हों।

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

सभी सुझावों के लिए [`<s-button-group>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices) (अंग्रेज़ी में) देखें।
