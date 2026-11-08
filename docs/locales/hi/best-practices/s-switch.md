- **Switches के साथ save button न रखें।** Switch toggle होते ही प्रभावी हो जाता है, इसलिए save button जोड़ने से merchants असमंजस में पड़ जाते हैं कि उनका बदलाव वास्तव में कब लागू होगा।
- **Setting को स्पष्ट बनाएँ।** ऐसा `label` लिखें जो merchants को बताए कि switch क्या नियंत्रित करता है और on और off का क्या अर्थ है, ताकि उन्हें केवल पता लगाने के लिए उसे बदलना न पड़े।
- **परिणामों का वर्णन करें।** `details` का उपयोग यह समझाने के लिए करें कि switch toggle करने पर क्या बदलता है, ख़ासकर उन settings के लिए जो महत्वपूर्ण features या data को प्रभावित करती हैं, ताकि merchants आत्मविश्वास से निर्णय ले सकें।
- **संबंधित switches को समूह और क्रम में रखें।** जब किसी page पर कई switches हों, तो संबंधित settings को तार्किक क्रम में एक साथ रखें ताकि merchants उन्हें आसानी से ढूँढ और configure कर सकें।
- **बताएँ कि switch उपलब्ध क्यों नहीं है।** जब कोई switch permissions, dependencies या plan की सीमाओं के कारण `disabled` हो, तो merchants को बताएँ कि क्यों, क्या यह अस्थायी है, और उसे unlock करने के लिए उन्हें क्या करना होगा।

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

सभी सुझावों के लिए [`<s-switch>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices) (अंग्रेज़ी में) देखें।
