- **Chips का इस्तेमाल वर्णन के लिए करें, कार्रवाई के लिए नहीं।** Chips उन tags, statuses और categories के लिए अच्छे हैं जो merchants को content के बारे में कुछ बताते हैं। ये buttons नहीं हैं, इसलिए जब किसी chip पर click करना या उसे हटाना हो, तो इसके बजाय `SClickableChip` इस्तेमाल करें।
- **Labels छोटे रखें।** "Featured" या "On sale" जैसा छोटा text एक नज़र में पढ़ा जा सकता है, जबकि लंबे labels स्कैनिंग को धीमा करते हैं और कट भी सकते हैं।
- **Visual weight को content से मिलाएँ।** द्वितीयक metadata के लिए `color="subdued"` और सामान्य tags व categories के लिए default color इस्तेमाल करें।
- **Chips को उसी के पास रखें जिसका वे वर्णन करते हैं।** उन्हें उस item के बगल में रखें जिसे वे label करते हैं, और लिस्ट में हर row पर उन्हें एक ही जगह रखें ताकि merchants जल्दी स्कैन कर सकें।
- **जब मदद मिले तो icon जोड़ें।** `graphic` slot में एक `SIcon` किसी status या जानी-पहचानी category को पहचानना आसान बना सकता है।

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

सभी सुझावों के लिए [`<s-chip>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices) (अंग्रेज़ी में) देखें।
