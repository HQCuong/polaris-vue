- **अपेक्षित input को स्पष्ट बनाएँ।** ऐसा `label` और `placeholder` लिखें जो merchants को बताए कि क्या दर्ज करना है और किस format में। अस्पष्ट शब्दों से अनुमान, validation errors और झुंझलाहट होती है।
- **Prefix या suffix से context जोड़ें।** Value का प्रकार और उसका format दिखाने के लिए `prefix` और `suffix` का उपयोग करें, उदाहरण के लिए merchants को पूरा URL टाइप करना है या केवल subdomain, या पूरी कीमत या केवल राशि।
- **Constraints को वास्तविक आवश्यकताओं पर आधारित रखें।** `minLength`, `maxLength` और validation rules को मनमानी संख्याओं के बजाय वास्तविक business ज़रूरतों के अनुसार सेट करें, और merchants को बताएँ कि वे क्या हैं।
- **जल्दी और विशिष्ट feedback दें।** Merchants को केवल submit करने पर नहीं, बल्कि टाइप करते समय ही बताएँ कि उनका input मान्य है या नहीं। जब वह मान्य न हो, तो `error` से समझाएँ कि क्या गलत है और उसे कैसे ठीक करें।

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

सभी सुझावों के लिए [`<s-text-field>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices) (अंग्रेज़ी में) देखें।
