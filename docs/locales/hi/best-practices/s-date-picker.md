- **एक समझदारी भरी date से शुरू करें।** `value` पहले से भरें, ताकि merchants जल्दी चुनाव कर सकें।
- **आम विकल्पों के लिए shortcuts दें।** "Today", "Last 7 days" या "This month" जैसे presets merchants को calendar में बार-बार click करने से बचाते हैं।
- **शुरुआत और अंत की dates के लिए `type="range"` इस्तेमाल करें।** Range selection reports, analytics और समय-अवधि पर आधारित अन्य filters के लिए उपयुक्त है।
- **लागू न होने वाली dates को ब्लॉक करें।** `allow` और `disallow` इस्तेमाल करें, ताकि merchants ऐसी dates न चुन सकें जो आपके use case के लिए अमान्य हों।
- **Picker के आसपास जगह छोड़ें।** इसे इतनी जगह दें कि यह on-screen keyboards या दूसरे interactive elements के रास्ते में न आए।
- **बहुत दूर की dates के लिए योजना बनाएँ।** कुछ सालों से आगे महीने-दर-महीने पेज बदलना थकाऊ हो जाता है, इसलिए लगभग 5–10 साल की अवधि से बाहर की dates के लिए presets दें या merchants को सीधे साल दर्ज करने दें।

```vue
<SDatePicker type="range" />
```

सभी सुझावों के लिए [`<s-date-picker>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker#best-practices) (अंग्रेज़ी में) देखें।
