- **`min` और `max` को वास्तविक सीमाओं पर सेट करें।** उदाहरण के लिए, product price के लिए `min` 0.01 रखा जा सकता है ताकि वह शून्य न हो, discount 0 से order total तक हो सकता है, और refund को चुकाई गई राशि तक सीमित किया जा सकता है। Values को हमेशा अपने business rules के हिसाब से भी जाँचें।
- **`error` में सटीक सीमा बताएँ।** "Invalid amount" के बजाय "Price must be at least $0.01" जैसा कुछ कहें, ताकि merchants जानें कि उन्होंने कौन-सी शर्त तोड़ी है।
- **Currency symbols को `label` और `placeholder` से बाहर रखें।** "$" या ऐसा कुछ जोड़ना उस currency formatting से टकरा सकता है जिसे field पहले से संभालता है।
- **राशि को उसके मकसद के अनुसार label करें।** "Product base price" या "Discount amount" merchants को "Amount" या "Price" से ज़्यादा बताते हैं।
- **Edit करते समय `value` पहले से भरें।** मौजूदा values के लिए वर्तमान राशि दिखाएँ; नई entries के लिए 0.00 या कोई सामान्य price जैसा समझदारी भरा default रखें।

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

सभी सुझावों के लिए [`<s-money-field>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices) (अंग्रेज़ी में) देखें।
