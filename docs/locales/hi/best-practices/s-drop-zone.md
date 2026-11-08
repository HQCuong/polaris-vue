- **`accept` से file की सीमाएँ बताएँ।** Drop zone कौन-से file types स्वीकार करता है, इस पर साफ़ प्रतिबंध सेट करें।
- **`droprejected` को एक मददगार संदेश के साथ संभालें।** जब कोई file validation में फ़ेल हो, तो इस event को सुनें और merchants को बताएँ कि क्या गलत हुआ।
- **Processing के दौरान `disabled` पर विचार करें।** Upload के दौरान drop zone को बंद करने से merchants उस बीच और files नहीं जोड़ पाते।

```vue
<SDropZone label="Product images" accept="image/*" />
```

सभी सुझावों के लिए [`<s-drop-zone>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices) (अंग्रेज़ी में) देखें।
