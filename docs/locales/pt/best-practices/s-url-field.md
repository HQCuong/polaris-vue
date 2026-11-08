- **Valide as URLs você mesmo.** A validação de URL nativa do navegador é mínima e varia entre navegadores, então adicione suas próprias verificações de estrutura, de protocolos permitidos e dos formatos que o seu caso de uso aceita.
- **Mostre o formato esperado.** Diga aos lojistas se devem incluir um protocolo, quais protocolos são permitidos e que tipo de URL você quer. Uma URL de exemplo completa no `placeholder` deixa isso claro.
- **Decida como lidar com a falta de protocolo.** Os lojistas costumam omitir o `https://`. Escolha se você vai adicioná-lo por eles, aceitar URLs sem ele ou mostrar um `error` que explique o que está faltando.
- **Escolha limites de tamanho de acordo com onde a URL é usada.** Navegadores e servidores suportam tamanhos máximos diferentes, então defina `maxLength` com base no destino da URL em vez de um número arbitrário, e mencione o limite quando ele for relevante.
- **Explique para que serve a URL.** Use o `label` e os `details` para deixar o propósito claro, já que uma URL de imagem de produto, um link de perfil em rede social e uma referência externa pedem coisas diferentes.

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

Veja [as boas práticas da Shopify para `<s-url-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices) (em inglês) para todas as recomendações.
