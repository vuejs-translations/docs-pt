# Questões Feitas Com Frequência {#frequently-asked-questions}

## Quem mantém a Vue? {#who-maintains-vue}

A Vue é um projeto independente, conduzido pela comunidade. Ela foi criada pelo [Evan You](https://twitter.com/youyuxi) em 2014 como um projeto paralelo pessoal. Hoje, a Vue é ativamente mantida por [uma equipa de tanto membros de tempo integral e voluntários de todo o mundo](/about/team), onde Evan serve como o líder do projeto. Tu podes saber mais sobre a história da Vue neste [documentário](https://www.youtube.com/watch?v=OrxmtDw4pVI).

O desenvolvimento da Vue é primariamente financiado através de patrocínios e temos estado financeiramente sustentáveis desde 2016. Se tu ou teu negócio beneficia-se da Vue, considere [patrocinar-nos](/sponsor/) para apoiar o desenvolvimento da Vue!

## Qual é a diferença entre a Vue 2 e Vue 3? {#what-s-the-difference-between-vue-2-and-vue-3}

A Vue 3 é a atual, versão principal mais recente da Vue. Ela contém novas funcionalidades que estavam presentes na Vue 2, tais como Teletransporte, Suspense, e vários elementos raiz por modelo de marcação. Ela também contém mudanças de ruturas que a tornam incompatível com a Vue 2. Os detalhes completos são documentados no [Guia de Migração da Vue 3](https://v3-migration.vuejs.org/).

Apesar das diferenças, a maioria das APIs da Vue são partilhadas entre as duas versões principais, então a maioria do teu conhecimento de Vue 2 continuará a funcionar na Vue 3. Notavelmente, a API de Composição era originalmente uma funcionalidade exclusiva da Vue 3, mas agora foi adicionada à Vue 2 e está disponível na [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01).

Em geral, a Vue 3 fornece tamanhos de pacote mais pequenos, melhor desempenho, melhor escalabilidade, e melhor suporte de TypeScript ou IDE. Se estiveres a começar um novo projeto hoje, a Vue 3 é a escolha recomendada. Existem algumas poucas razões para considerares a Vue 2 a partir de agora:

- Tu precisas de suportar o IE11. A Vue influencia funcionalidades de JavaScript modernas e não suporta o IE11.

- Tu ainda estás a espera que os principais projetos do ecossistema como Nuxt ou Vuetify lancem versões estáveis para Vue 3. Isto é sensato se não desejas usar software em estágio beta. No entanto, nota que existem outras bibliotecas de componentes de Vue 3 que já estão estáveis tais como [Quasar](https://quasar.dev/), [Naive UI](https://www.naiveui.com/) e [Element Plus](https://element-plus.org/).

Se tencionas migrar uma aplicação de Vue 2 existente para a Vue 3, consulte o [guia de migração](https://v3-migration.vuejs.org/).

## A Vue 2 ainda é suportada? {#is-vue-2-still-supported}

A Vue 2.7, que foi entregada em Julho de 2022, é o último lançamento secundário do limite de versão da Vue 2. A Vue 2 agora entrou no modo de manutenção: não mais entregará novas funcionalidades, mas continuará a receber correções de erros de programação críticos e atualizações de segurança por 18 meses começando a partir da data de lançamento da Vue 2.7. Isto significa que a **Vue 2 alcançará o Fim da Vida em 31 de Dezembro de 2023**.

Nós acreditamos que isto deve fornecer tempo o suficiente para a maioria do ecossistema migrar para a Vue 3. No entanto, também entendemos que poderiam existir equipas ou projetos que não podem atualizar por esta linha de tempo enquanto precisarem de cumprir requisitos de segurança e compatibilidade. Nós estamos a fazer parceria com especialistas da industria para fornecer suporte estendido para Vue 2 para equipas com tais necessidades - se a tua equipa espera estar a usar a Vue 2 além do fim de 2023, certifica-te de planear para adiante e aprender mais sobre o [Suporte de Longo Prazo Estendido da Vue 2](https://v2.vuejs.org/lts/).

## Qual licença a Vue usa? {#what-license-does-vue-use}

A Vue é um projeto livre e de código-aberto lançado sob a [licença MIT](https://opensource.org/licenses/MIT).

## Quais navegadores suportam a Vue? {#what-browsers-does-vue-support}

A versão mais recente da Vue (3.x) apenas suporta [navegadores com suporte de ES2015 nativo](https://caniuse.com/es6). Isto exclui IE11. A Vue 3.x usa funcionalidades da ES2015 que não podem ser adicionadas por preenchimento de buracos em navegadores antigos, então se precisas de suportar navegadores antigos, precisarás de usar a Vue 2.x.

## A Vue é fiável? {#is-vue-reliable}

A Vue é uma abstração madura e testada em combate. Ela é uma das mais largamente usada abstrações de JavaScript em produção hoje, com mais de 1.5 milhões de utilizadores mundialmente, e é descarregada quase 10 milhões de vezes num mês na npm.

A Vue é usada em produção por organizações famosas em capacidades variáveis em todo o mundo, incluindo a Wikimedia Foundation, NASA, Apple, Google, Microsoft, GitLab, Zoom, Tencent, Weibo, Bilibili, Kuaishou, e muitos mais.

## A Vue é rápida? {#is-vue-fast}

A Vue 3 é uma das mais otimizadas abstrações de frontend dominante, e lida com a maioria dos casos de uso de aplicação de Web com facilidade, sem a necessidade de otimizações manuais.

Em cenários de testes de esforço, a Vue tem um desempenho superior da React e Angular por uma margem decente na [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html). Ela também segue pescoço-a-pescoço contra as mais rápidas abstrações que não usam DOM Virtual em nível de produção na analise comparativa.

Nota que analises comparativas sintéticas como as de cima focam em desempenho de interpretação puro com otimizações dedicadas e podem não ser completamente representantes de resultados de desempenho do mundo real. Se importas-te mais com o desempenho do carregamento da página, és bem-vindo para fazer uma auditoria desta página usando [WebPageTest](https://www.webpagetest.org/lighthouse) ou [PageSpeed Insights](https://pagespeed.web.dev/). Esta página é alimentada pela própria Vue, com pré-interpretação estática, hidratação de página completa e navegação do lado do cliente. Ela pontua 100 em desempenho num Moto G4 emulado com 4x CPU estrangulando sobre redes 4G lentas.

Tu podes saber mais sobre como a Vue otimiza automaticamente o desempenho do tempo de execução na seção do [Mecanismo de Interpretação](/guide/extras/rendering-mechanism), e como otimizar uma aplicação de Vue em casos particularmente exigentes no [Guia de Otimização do Desempenho](/guide/best-practices/performance).

## A Vue é leve? {#is-vue-lightweight}

Quando usas uma ferramenta de construção, muitas das APIs da Vue são passíveis a ["agitação de árvore"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). Por exemplo, se não usas o componente `<Transition>` embutido, este não será incluído no pacote de produção final.

Uma aplicação de "Olá Mundo" de Vue que apenas usa o absolutamente mínimo de APIs tem um tamanho de base de apenas em torno de **16kb**, com a minificação e compressão de brotli. O verdadeiro tamanho da aplicação dependerá de quantas funcionalidades opcionais da abstração usas. Em caso pouco provável onde uma aplicação usa todas as funcionalidades que a Vue oferece, o tamanho do executor total é em torno de **27kb**.

Quando usamos a Vue sem uma ferramenta de construção, não apenas perdemos a agitação de árvore, mas também temos de entregar o compilador de modelo de marcação para o navegador. Isto aumenta o tamanho para em torno de **41kb**. Portanto, se estiveres a usar a Vue particularmente para otimizações progressivas sem uma etapa de construção, considere usar a [petite-vue](https://github.com/vuejs/petite-vue) (apenas **6kb**).

Algumas abstrações, tais como a Svelte, usam uma estratégia de compilação que produz uma saída extremamente leve em cenários de único componente. No entanto, [nossa pesquisa](https://github.com/yyx990803/vue-svelte-size-analysis) mostra que a diferença de tamanho depende muito do número de componentes na aplicação. Enquanto a Vue tem um tamanho de base mais pesado, ela gera menos código por componente. Em cenários do mundo real, uma aplicação de Vue pode muito bem acabar sendo mais leve.

## A Vue escala? {#does-vue-scale}

Sim. Apesar duma ideia errada comum de que a Vue é apenas adequada para casos de uso mais simples, a Vue é perfeitamente capaz de lidar com aplicações de grande escala:

- [Componentes de Ficheiro Único](/guide/scaling-up/sfc) fornecem um modelo de desenvolvimento separado por módulos que permite partes diferentes duma aplicação possam ser desenvolvidas separadamente.

- [API de Composição](/guide/reusability/composables) fornece integração de TypeScript de primeira classe e permite padrões limpos para organizar, extrair e reutilizar lógica complexa.

- [Suporte de ferramental abrangente](/guide/scaling-up/tooling) garante uma experiência de desenvolvimento suave conforme a aplicação for crescer.

- Obstáculo muito menor para entrada e excelente documentação que traduz-se para integração e custos de treinamento muito menores para novos programadores.

## Como posso contribuir com a Vue? {#how-do-i-contribute-to-vue}

Nós apreciamos o teu interesse! Consulte o nosso [Guia da Comunidade](/about/community-guide).

## Deveria eu usar a API de Opções ou API de Composição? {#should-i-use-options-api-or-composition-api}

Se fores novo para Vue, fornecemos uma comparação de alto nível entre os dois estilos [nesta ligação](/guide/introduction#which-to-choose).

Se usaste anteriormente a API de Opções e estás atualmente a avaliar a API de Composição, consulte a seção [Questões Frequentes sobre API de Composição](/guide/extras/composition-api-faq).

## Deveria eu usar a JavaScript ou TypeScript com a Vue? {#should-i-use-javascript-or-typescript-with-vue}

Embora a própria Vue seja implementada em TypeScript e forneça suporte de TypeScript de primeira classe, não força uma opinião sobre se deverias usar TypeScript como um utilizador.

O suporte de TypeScript é uma consideração importante quando novas funcionalidades são adicionadas à Vue. As APIs que são desenhadas com a TypeScript em mente são normalmente mais fáceis para IDEs e analisadores de código entenderem, mesmo se não estiveres a usar a TypeScript. Todos ganham. As APIs de Vue também são desenhadas para funcionarem da mesma maneira em ambas JavaScript e TypeScript o máximo possível.

Adotar a TypeScript envolve um compromisso entre integrar complexidade e ganhos de capacidade de manutenção de longo prazo. Se tal compromisso pode ser justificado pode variar dependendo do fundo da tua equipa e escala do projeto, mas a Vue não é de fato um fator influente na tomada desta decisão.

## Como a Vue se compara aos Componentes da Web? {#how-does-vue-compare-to-web-components}

A Vue foi criada antes dos Componentes da Web estivessem disponíveis de maneira nativa, e alguns aspetos do desenho da Vue (por exemplo, ranhuras) foram inspirados pelo modelo de Componentes da Web.

As especificações dos Componentes da Web são relativamente de baixo nível, uma vez que estão centradas em torno da definição de elementos personalizados. Como abstração, a Vue aborda preocupações de alto nível adicionais tais como a eficiente interpretação do DOM, gestão de estado reativo, ferramental, roteamento do lado do cliente, e interpretação no lado do servidor.

A Vue também suporta completamente o consumo ou exportação para elementos personalizados nativos - consulte o [Guia da Vue e os Componentes da Web](/guide/extras/web-components) por mais detalhes.

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->
