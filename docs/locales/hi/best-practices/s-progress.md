- **इसका उपयोग ऐसे काम के लिए करें जिसे मापा जा सके।** Progress bar तब चुनें जब आप काम को किसी पूर्ण के हिस्से के रूप में व्यक्त कर सकें। जब आप यह न बता सकें कि किसी काम में कितना समय लगेगा या वह कितना आगे बढ़ चुका है, तो spinner हल्का विकल्प है।
- **बताएँ कि क्या आगे बढ़ रहा है।** `accessibilityLabel` को सटीक विवरण दें, उदाहरण के लिए "Importing products" या "Storage used"। Screen readers bar को उसी label के साथ पढ़ते हैं, और अगर आप इसे छोड़ दें तो कोई default नहीं होता।
- **जब संख्याएँ मायने रखें तो text जोड़ें।** Bar स्वयं कोई label या प्रतिशत नहीं दिखाता, इसलिए जब merchants को आँकड़ों की ज़रूरत हो तो उसके पास text रखें, और उस text को `value` के साथ मेल में रखें।
- **`max` को वास्तविक कुल पर सेट करें।** सब कुछ प्रतिशत में बदलने के बजाय वास्तविक गिनती या सीमा का उपयोग करें, जैसे कितनी files हैं या quota कितना बड़ा है। इससे काम पूरा होने पर `value` को अपडेट करना आसान हो जाता है।
- **Tone का उपयोग केवल समस्या दर्शाने के लिए करें।** `tone="critical"` और `tone="warning"` को उस progress के लिए रखें जो किसी समस्या की ओर इशारा करे, जैसे पूरी तरह इस्तेमाल हो चुकी कोई सीमा। सामान्य चल रहे काम को default tone पर ही रहने दें।

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

सभी सुझावों के लिए [`<s-progress>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices) (अंग्रेज़ी में) देखें।
