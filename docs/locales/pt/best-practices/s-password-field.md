- **Funcione bem com gerenciadores de senhas.** Defina um valor de `autocomplete` adequado, como `new-password` ou `current-password`, para que os gerenciadores de senhas ajudem os lojistas a gerar e salvar senhas fortes.
- **Informe as regras logo de início.** Liste todos os requisitos de senha antes que os lojistas comecem a digitar, em vez de revelá-los só depois de uma entrada inválida. Isso evita frustração e formulários abandonados.
- **Oriente os lojistas ao criar uma senha.** Dê feedback em tempo real sobre a força da senha e explique o que a tornaria mais forte, em vez de simplesmente impor regras sem contexto.
- **Permita que os lojistas colem.** Gerenciadores de senhas e ferramentas semelhantes dependem de colar, e bloquear isso empurra os lojistas para senhas mais fracas que eles conseguem digitar de memória.
- **Trate as verificações no cliente apenas como feedback.** Sempre valide a senha no seu servidor, porque as restrições do navegador são fáceis de contornar. A validação no cliente existe para responder rapidamente, não para oferecer segurança.

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

Veja [as boas práticas da Shopify para `<s-password-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices) (em inglês) para todas as recomendações.
