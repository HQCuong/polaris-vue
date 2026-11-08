- **Viewport के बजाय container के अनुसार ढलें।** Query container components को उनके container की चौड़ाई के अनुसार प्रतिक्रिया देने देता है। यह उन components के लिए मददगार है जो अलग-अलग चौड़ाई वाली जगहों पर दिखते हैं, जैसे sidebar में या मुख्य column में कोई product card।
- **एक से अधिक containers होने पर उन्हें नाम दें।** अगर कई query containers को अलग-अलग queries चाहिए, तो हर एक को वर्णनात्मक `containerName` दें ताकि आप उसे target कर सकें; बिना नाम वाले सभी containers समान queries का जवाब देते हैं।
- **Responsive values को props पर रखें।** Container वह context देता है जिसका उपयोग Polaris components responsive prop values को resolve करने के लिए करते हैं, जैसे `padding="@container (inline-size > 500px) large-500, none"`, इसलिए आपको container query CSS स्वयं नहीं लिखनी पड़ती।
- **इनका उपयोग केवल वहीं करें जहाँ ज़रूरत हो।** हर query container browser से उसके आकार पर नज़र रखवाता है और conditional styles लागू करवाता है, इसलिए हर element को wrap करने के बजाय उसे वहीं जोड़ें जहाँ आपको container-आधारित responsiveness चाहिए।

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

सभी सुझावों के लिए [`<s-query-container>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices) (अंग्रेज़ी में) देखें।
