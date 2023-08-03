# Maneiras de Usar a Vue {#ways-of-using-vue}

Nós acreditamos não existir "uma solução que resolva tudo" na Web. É por isto que a Vue é desenhada para ser flexível e adotável incrementalmente. Dependendo do teu caso de uso, a Vue pode ser usada de diferentes maneiras para encontrar a harmonia ideal entre a complexidade da pilha, experiência de programação e desempenho final.

## Extensão Isolada {#standalone-script}

A Vue pode ser usada como um ficheiro de extensão isolada - sem a necessidade da etapa de construção! se já tiveres uma abstração de backend a gerar a maior parte da HTML, ou a lógica do teu frontend não complexa o suficiente para justificar uma etapa de construção, esta é a maneira mais fácil de integrar a Vue na tua pilha. Nestes casos, podes pensar da Vue como sendo mais uma substituição declarativa da jQuery.

A Vue também fornece uma distribuição alternativa chamada [petite-vue](https://github.com/vuejs/petite-vue) que é especialmente otimizada para otimizar progressivamente a HTML existente. Ela tem um conjunto de funcionalidade mais pequeno, mas é extremamente leve e usa uma implementação que é mais eficiente em cenários onde não existem etapas de construção.

## Componentes de Web Embutidos {#embedded-web-components}

Tu podes usar a Vue para [construir Componentes de Web padronizados](/guide/extras/web-components) que podem ser embutidos em qualquer página de HTML, independentemente de como eles são apresentados. Esta opção permite-te influenciar a Vue de uma maneira completamente agnóstica em relação o consumidor: os componentes de web resultantes podem ser embutidos em aplicações legadas, HTML estático, ou mesmo em aplicações construídas com outras abstrações.

## Aplicação de Página Única (SPA) {#single-page-application-spa}

Algumas aplicações exigem riqueza de interatividade, profundidade de sessão profunda, e lógica com estado não trivial no frontend. A melhor maneira de construir tais aplicações é usar uma arquitetura onde a Vue não apenas controla a página inteira, mas também manipula as atualizações de dados e a navegação sem ter de recarregar a página. Este tipo de aplicação é normalmente remetida para uma Aplicação de Página Única (SPA, sigla em Inglês).

A Vue fornece as bibliotecas principais e [suporte ferramental exaustivo](/guide/scaling-up/tooling) com incrível experiência de programação para a construção de SPAs modernas, incluindo:

- Roteador no lado do cliente
- Cadeia de ferramenta de construção extremamente rápida
- Suporte de IDE
- Ferramentas de programação do navegador
- Integrações de TypeScript
- Utilitários de Testes

As SPAs normalmente exigem backend para expor os destinos da API - mas também podes parear a Vue com soluções como [Inertia.js](https://inertiajs.com) para teres os benefícios da SPA enquanto manténs um modelo de desenvolvimento centrado no servidor.

## Pilha Completa (Fullstack) / SSR {#fullstack-ssr}

SPAs do lado do cliente puras são problemáticas quando a aplicação for sensível ao SEO e tempo-para-o-conteúdo. Isto é o porque que o navegador receberá uma página de HTML em grande parte vazia, e terá de esperar até o código JavaScript ser carregado antes da apresentação de qualquer coisa.

A Vue fornece APIs de primeira classe para "gerar" uma aplicação de Vue em sequências de caracteres de HTML no servidor. Isto permite o servidor devolver o HTML pronto, permitindo os utilizadores finais ver o conteúdo imediatamente enquanto o JavaScript estiver a ser carregado. A Vue então "hidratará" a aplicação no lado do cliente para torná-la interativa. Isto é chamado [Interpretação no Lado do Servidor (SSR, sigla em Inglês)](/guide/scaling-up/ssr) e melhora grandemente as métricas Vitais da Núcleo da Web tais como [Pintura Alargada do Conteúdo (LCP)](https://web.dev/lcp/).

Existem abstrações de alto nível baseadas na Vue construídas sobre este paradigma, tal com a [Nuxt](https://nuxt.com/), que permite-te programar uma aplicação de pilha completa usando a Vue e JavaScript (e TypeScript também).

## JAMStack / SSG {#jamstack-ssg}

A interpretação no lado do servidor pode ser feita antes da hora marcada se o dado necessário for estático. Isto significa que podemos pré-gerar uma aplicação inteira em HTML e servi-la como ficheiros estáticos. Isto melhora o desempenho da aplicação e torna a implementação em produção muito mais simples já que não mais precisamos gerar as páginas dinamicamente em cada requisição. A Vue pode continuar a hidratar tais aplicações para fornecer riqueza de interatividade no cliente. Esta técnica é comummente remetida para a "Static-Site Generation (SSG)" ou Geração de Páginas Estáticas em Português, também conhecida como [JAMStack](https://jamstack.org/what-is-jamstack/).

Existem dois sabores de SSG: "single-page" ou única-página e "multi-page" ou várias-páginas. Ambos sabores geram previamente a aplicação como HTML estático, a diferença é que:

- Depois do carregamento inicial da página, a abordagem de única página "hidrata" a página para uma SPA. Isto exige a carga de JavaScript mais adiantada e custo de hidratação, mas as navegações subsequentes serão mais rápidas, já que ela apenas precisa atualizar parcialmente a página ao invés de recarregar a página inteira.

- Um abordagem de várias páginas carrega uma nova página em cada navegação. A diferença é que ela pode entregar o mínimo de JavaScript - ou nenhum JavaScript de todo se a página não exigir nenhuma interação! Algumas das abstrações que aplicam a abordagem de várias páginas tais como a [Astro](https://astro.build/) também suportam a "hidratação parcial" - o qual permite-te usar os componentes de Vue para criar "ilhas" interativas dentro do HTML estático.

As abstrações que suportam a abordagem de única página são mais adequadas se imaginas interatividade fora do comum, longas sessões, ou elementos e estados persistidos através da navegações. Caso contrário, a abordagem de várias páginas seria a melhor escolha.

A equipa da Vue também mantém um gerador de aplicação estática chamado [VitePress](https://vitepress.vuejs.org/), o qual alimenta esta página que estás a ler neste preciso momento! a VitePress suporta ambos sabores de SSG. A [Nuxt](https://nuxt.com/) também suporta SSG. Tu podes até mesmo misturar SSR e SSG para diferentes rotas na mesma aplicação de Nuxt.

## Para Além da Web {#beyond-the-web}

Embora a Vue esteja primariamente desejada para a construção de aplicações de web, de maneira nenhuma esta limitada apenas ao navegador. Tu podes:

- Construir aplicações de secretária com a [Electron](https://www.electronjs.org/) ou [Tauri](https://tauri.studio/en/)
- Construir aplicações móveis com a [Ionic Vue](https://ionicframework.com/docs/vue/overview)
- Construir aplicações de secretária e móveis a partir da mesma base de código com a [Quasar](https://quasar.dev/)
- Use a [API do Interpretador Personalizada](/api/custom-renderer) da Vue para construir interpretadores personalizados apontando para [WebGL](https://troisjs.github.io/) ou mesmo [o terminal](https://github.com/ycmjason/vuminal)!
