- **Use para filtrar no próprio lugar.** Ele é adequado para restringir o conteúdo de uma seção ou lista específica. Navegação global ou buscas complexas e com várias etapas pedem um padrão de busca mais robusto.
- **Diga o que está sendo buscado.** Escreva um `label` e um `placeholder` específicos que informem aos lojistas qual conteúdo a busca abrange e por quais atributos eles podem buscar.
- **Responda enquanto os lojistas digitam.** Sempre que possível, atualize os resultados ou o conteúdo filtrado enquanto os lojistas digitam, para que eles possam refinar a consulta e confiar que a busca está funcionando.
- **Planeje para buscas apagadas e sem resultados.** Quando o campo for limpo, mostre a lista completa novamente. Quando nada corresponder, mostre uma mensagem que sugira outra ação ou uma busca mais ampla.
- **Espere por uma entrada suficiente.** Evite executar buscas que retornariam resultados demais ou sem sentido; começar após dois ou três caracteres dá o suficiente para retornar correspondências úteis.

```vue
<SSearchField label="Search products" placeholder="Search by title, SKU or vendor" />
```

Veja [as boas práticas da Shopify para `<s-search-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/search-field#best-practices) (em inglês) para todas as recomendações.
