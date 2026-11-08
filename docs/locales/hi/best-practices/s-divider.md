- **सिर्फ़ वास्तव में अलग content को ही अलग करें।** Dividers उन sections के बीच ही ठीक लगते हैं जो साफ़ तौर पर अलग हों। बहुत ज़्यादा dividers interface को भरा-भरा और टूटा हुआ दिखाते हैं, इसलिए जाँच लें कि क्या whitespace से content उतनी ही अच्छी तरह समूह में आ जाएगा।
- **Divider का वज़न विभाजन के अनुसार रखें।** Divider की प्रमुखता से पता चलना चाहिए कि विभाजन कितना अहम है: किसी बड़े section break के लिए `color="strong"` लिया जा सकता है, जबकि छोटे समूह के लिए हल्की line या सिर्फ़ जगह काफ़ी है।
- **Layout की दिशा का पालन करें।** `direction` सेट करें ताकि line उस content के प्रवाह के आर-पार चले जिसे वह अलग करती है, चाहे items ऊपर-नीचे रखे हों या अगल-बगल।
- **पहले spacing आज़माएँ।** आपके layout components के spacing props अक्सर line से ज़्यादा साफ़ तरीके से content को समूह में रखते हैं। चीज़ें साफ़ करने के लिए divider जोड़ें, अच्छी तरह से योजनाबद्ध spacing के विकल्प के रूप में नहीं।

सभी सुझावों के लिए [`<s-divider>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/divider#best-practices) (अंग्रेज़ी में) देखें।
