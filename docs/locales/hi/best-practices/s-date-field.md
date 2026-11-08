- **एक समझदारी भरी date से शुरू करें।** Edit करते समय `value` में मौजूदा date पहले से भरें, या सुझाव देते समय कोई संभावित विकल्प भरें।
- **Dates को उचित दायरे तक सीमित रखें।** `allow` और `disallow` से वे dates सीमित करें जिन्हें merchants चुन सकते हैं, जैसे scheduling field को आने वाली dates तक या business field को सोमवार से शुक्रवार तक सीमित करना।
- **किसी भी सीमा को `details` में समझाएँ।** "Must be a future date" जैसी ज़रूरतें साफ़ लिखें, ताकि merchants चुनने से पहले नियम जान लें।
- **`error` संदेशों को काम का बनाएँ।** जब कोई date अमान्य हो, तो merchants को बताएँ कि उसे कैसे ठीक करें।

सभी सुझावों के लिए [`<s-date-field>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-field#best-practices) (अंग्रेज़ी में) देखें।
