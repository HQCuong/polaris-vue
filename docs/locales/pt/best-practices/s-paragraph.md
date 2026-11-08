- **Mantenha os parágrafos curtos.** Procure usar de duas a quatro frases em linguagem simples, sem jargões. Os lojistas costumam ler por alto, então divida conteúdos longos em partes menores.
- **Use tone para sinalizar a intenção.** `tone="critical"` é adequado para erros, `"caution"` para avisos e `"success"` para confirmações. Sempre reforce a cor com um texto claro, em vez de depender só dela.
- **Projete pensando em acessibilidade.** Adicione texto exclusivo para leitores de tela (`accessibilityVisibility="exclusive"`) para o contexto que lojistas que enxergam percebem pelo layout ou pelos ícones, e garanta que o texto com tom mantenha contraste suficiente para ser lido.
- **Limite as linhas com cuidado.** `lineClamp` ajuda em espaços apertados, como cards ou pré-visualizações, mas nunca deixe o truncamento esconder informações críticas.

Veja [as boas práticas da Shopify para `<s-paragraph>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/paragraph#best-practices) (em inglês) para todas as recomendações.
