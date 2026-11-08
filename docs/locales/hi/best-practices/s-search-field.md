- **इसका उपयोग उसी जगह filter करने के लिए करें।** यह किसी विशेष section या list के content को सीमित करने के लिए उपयुक्त है। Global navigation या जटिल, बहु-चरणीय searches के लिए अधिक मज़बूत search pattern की ज़रूरत होती है।
- **बताएँ कि क्या खोजा जा रहा है।** एक विशिष्ट `label` और `placeholder` लिखें जो merchants को बताएँ कि search किस content को कवर करता है और वे किन attributes से खोज सकते हैं।
- **Merchants के टाइप करते ही प्रतिक्रिया दें।** जहाँ संभव हो, merchants के टाइप करते समय ही results या filter किया गया content अपडेट करें, ताकि वे अपनी query को बेहतर बना सकें और भरोसा कर सकें कि search काम कर रहा है।
- **खाली की गई और बिना परिणाम वाली searches की योजना बनाएँ।** जब field खाली की जाए, तो पूरी list वापस लाएँ। जब कुछ भी मेल न खाए, तो ऐसा संदेश दिखाएँ जो कोई दूसरा action या व्यापक search सुझाए।
- **पर्याप्त input की प्रतीक्षा करें।** ऐसी searches चलाने से बचें जो बहुत अधिक या अर्थहीन results लौटाएँ; दो या तीन characters के बाद शुरू करने से उपयोगी matches लौटाने के लिए पर्याप्त जानकारी मिल जाती है।

```vue
<SSearchField label="Search products" placeholder="Search by title, SKU or vendor" />
```

सभी सुझावों के लिए [`<s-search-field>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/search-field#best-practices) (अंग्रेज़ी में) देखें।
