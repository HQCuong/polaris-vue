- **इसे धीमे async काम के लिए दिखाएँ।** Spinner का उपयोग तब करें जब form सहेजने, data लाने या किसी action को process करने जैसे काम में लगभग 500ms से अधिक समय लगे। तुरंत पूरे होने वाले actions के लिए spinner बस झिलमिलाता है और ध्यान भटकाता है।
- **इसे उसी जगह रखें जो load हो रही है।** पूरे interface को रोकने के बजाय spinner को page के उस हिस्से में रखें जो load हो रहा है, जैसे save हो रहा कोई button या अपना data ला रहा कोई section।
- **बताएँ कि क्या load हो रहा है।** हमेशा `accessibilityLabel` सेट करें, उदाहरण के लिए "Loading products" या "Saving changes", ताकि screen reader उपयोगकर्ताओं को पता चले कि क्या हो रहा है।
- **बाद में परिणाम बताएँ।** Spinner हटने के बाद, स्पष्ट success या error संदेश दिखाएँ ताकि merchants जान सकें कि operation पूरा हो गया और उसका परिणाम क्या रहा।

```vue
<SSpinner accessibilityLabel="Loading products" />
```

सभी सुझावों के लिए [`<s-spinner>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices) (अंग्रेज़ी में) देखें।
