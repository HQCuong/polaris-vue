- **Spacing से संबंध दर्शाएँ।** छोटा `gap` संकेत देता है कि items एक साथ हैं, जबकि बड़ा gap अलग-अलग समूहों को अलग करता है। ऐसी spacing चुनें जो आपके content की hierarchy से मेल खाए।
- **Inline stacks के wrap होने की अपेक्षा रखें।** `direction="inline"` के साथ, जगह ख़त्म होने पर items नई line पर चले जाते हैं। आमतौर पर आप यही चाहते हैं, लेकिन अगर आपको line breaks या कई rows पर सटीक नियंत्रण चाहिए, तो कोई दूसरा layout तरीका अपनाएँ।
- **Alignment जान-बूझकर सेट करें।** Default alignment अधिकांश layouts के लिए उपयुक्त है। जब items का आकार अलग हो या उन्हें विशेष positioning चाहिए, तो `alignItems` या `justifyContent` को समायोजित करें।

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

सभी सुझावों के लिए [`<s-stack>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices) (अंग्रेज़ी में) देखें।
