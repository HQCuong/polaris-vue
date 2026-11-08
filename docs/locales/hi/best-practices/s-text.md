- **एक semantic `type` चुनें।** मुख्य शब्दों या वाक्यांशों को चिह्नित करने के लिए `"strong"`, डाक या email पते के लिए `"address"`, और ऐसे text के लिए `"redundant"` चुनें जो screen reader उपयोगकर्ताओं को context देता है जब वही content पहले से screen पर दिखाई देता हो। सही type चुनने से assistive technology यह व्यक्त कर पाती है कि text का क्या अर्थ है।
- **ज़ोर कम से कम दें।** `type="strong"` को पूरे वाक्यों पर नहीं, बल्कि किसी वाक्य के मुख्य शब्दों या संख्याओं पर लगाएँ; बहुत अधिक ज़ोर अपना प्रभाव खो देता है और text को scan करना कठिन बना देता है।
- **Inline status के लिए tone का उपयोग करें।** `"critical"`, `"success"` या `"caution"` जैसे tones किसी status की ओर ध्यान खींचते हैं, लेकिन संदेश को रंग पर छोड़ने के बजाय उनके साथ स्पष्ट शब्दों का उपयोग करें।
- **महत्वपूर्ण चीज़ों को फीका न करें।** `color="subdued"` timestamps और metadata के लिए उपयुक्त है, लेकिन उस महत्वपूर्ण जानकारी के लिए इससे बचें जिसे merchants को पढ़ना ही चाहिए।

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

सभी सुझावों के लिए [`<s-text>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices) (अंग्रेज़ी में) देखें।
