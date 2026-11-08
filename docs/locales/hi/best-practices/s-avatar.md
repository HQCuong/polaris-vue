- **संदर्भ के अनुसार साइज़ चुनें।** टेबल और लिस्ट जैसे घने layouts के लिए छोटा `size` चुनें, और प्रोफ़ाइल पेजों पर बड़ा, जहाँ व्यक्ति ही मुख्य केंद्र होता है।
- **उपयोगी alt text लिखें।** `alt` में बताएँ कि avatar किसे या किस चीज़ को दर्शाता है, जैसे किसी व्यक्ति या कंपनी का नाम। अगर वह नाम पहले से avatar के पास text के रूप में दिख रहा है, तो इसके बजाय खाली `alt` रखें।
- **इसे उसी के पास रखें जिसे यह दर्शाता है।** Avatar को ठीक उस नाम या entity के बगल में रखें जिसका वह प्रतिनिधित्व करता है, ताकि लिस्ट, टेबल और cards में दोनों का संबंध साफ़ दिखे।

```vue
<SAvatar alt="Sarah Chen" initials="SC" size="large" />
```

सभी सुझावों के लिए [`<s-avatar>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar#best-practices) (अंग्रेज़ी में) देखें।
