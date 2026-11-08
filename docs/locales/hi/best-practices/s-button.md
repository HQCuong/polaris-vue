- **साफ़ क्रिया वाला label दें।** ठीक-ठीक बताएँ कि button क्या करता है, जैसे "Save", "Edit" या "Add tags"। Sentence case इस्तेमाल करें, "a" या "the" जैसे भराव वाले शब्द छोड़ दें, और विराम चिह्न न लगाएँ।
- **`tone="critical"` को destructive actions के लिए बचाकर रखें।** इसे सिर्फ़ तभी इस्तेमाल करें जब किसी action को पलटना मुश्किल या असंभव हो, और आम तौर पर tone को इस बात से मिलाएँ कि action कितना अहम है।
- **Hierarchy को साफ़ दिखाएँ।** मुख्य action को `variant="primary"`, सहायक actions को `variant="secondary"` और अतिरिक्त actions को `variant="tertiary"` दें, ताकि merchants समझ सकें कि कौन-सा action सबसे अहम है।
- **Buttons को एक जैसी जगहों पर रखें।** अपने पूरे app में buttons को उन्हीं जगहों पर रखें, ताकि merchants सीख जाएँ कि उन्हें कहाँ ढूँढना है।
- **सिर्फ़ icon वाले buttons को label दें।** अगर किसी button में icon है और text नहीं, तो उसे एक `accessibilityLabel` दें जो screen reader users को बताए कि वह क्या करता है।

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

सभी सुझावों के लिए [`<s-button>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices) (अंग्रेज़ी में) देखें।
