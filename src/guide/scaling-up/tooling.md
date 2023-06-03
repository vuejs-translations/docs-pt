# Ferramental {#tooling}

## Experimento-o Online {#try-it-online}

Tu não precisas instalar nada na tua máquina para experimentar os Componentes de Ficheiro Único de Vue - existem zonas de testes online que permitem-te fazer isto direto no navegador:

- [Zona de Teste de SFC da Vue](https://sfc.vuejs.org)
  - Sempre desdobrado a partir da entrega mais recente
  - Desenhado para inspeção dos resultados da compilação do componente
- [Vue + Vite na StackBlitz](https://vite.new/vue)
  - Ambiente semelhante a IDE executando um servidor de desenvolvimento de Vite real no navegador
  - Mais próximo da configuração local

É também recomendado usar estas zonas de testes online para fornecer reproduções quando estiver reportando bugs.

## Estruturação do Projeto {#project-scaffolding}

### Vite {#vite}

A [Vite](https://vitejs.dev/) é uma ferramenta de construção rápida e leve com suporte de SFC de Vue de primeira classe. Foi criada pelo Evan You, o qual é também o autor da Vue!

Para começar com a Vite + Vue, simplesmente execute:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">$</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará e executará [create-vue](https://github.com/vuejs/create-vue), a ferramenta de estruturação de projeto de Vue oficial.

- Para aprender mais a respeita da Vite, consulte a [documentação da Vite](https://pt.vitejs.dev).
- Para configurar o comportamento específico de Vue em um projeto de Vite, por exemplo passando as opções para o compilador de Vue, consulte a documentação para [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme).

Ambas zonas de testes online mencionadas acima também suportam o descarregamento dos ficheiros como um projeto de Vite.

### Interface de Linha de Comando de Vue {#vue-cli}

A [Interface de Linha de Comando de Vue](https://cli.vuejs.org/) é a cadeia de ferramenta baseada na Webpack oficial para a Vue. Ela está agora no modo de manutenção e recomendamos a inicialização de novos projetos com a Vite a menos que dependas de funcionalidades específicas que só estão disponíveis para Webpack. A Vite fornece experiência de programação superior na maioria dos casos.

Para informações sobre a migração da CLI de Vue para Vite:

- [Guia de Migração da Interface de Linha de Comando de Vue -> Vite da VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Ferramentas / Extensões que ajudam com a migração automática](https://github.com/vitejs/awesome-vite#vue-cli)

### Nota sobre a Compilação de Modelo de Marcação no Navegador {#note-on-in-browser-template-compilation}

Quando estiveres a usar a Vue sem uma etapa de construção, os modelos de marcação do componente são escritos ou diretamente no HTML da página ou como sequências de caracteres de JavaScript embutida. Em tais casos, a Vue precisa entregar o compilador de modelo de marcação ao navegador para realizar a compilação do modelo de marcação sobre o ar. Por outro lado, o compilador seria desnecessário se pré-compilarmos os modelos de marcação com uma etapa de construção. Para reduzir o tamanho do pacote do cliente, a Vue fornece [diferentes "construções"](https://unpkg.com/browse/vue@3/dist/) otimizadas para diferentes casos de uso.

- Os ficheiros de construção que começam com `vue.runtime.*` são **construções de tempo de execução apenas**: elas não incluem o compilador. Quando estiveres a usar estas construções, todos os modelos de marcação devem ser pré-compilados através de uma etapa de construção.

- Os ficheiros de construção que não incluem `.runtime` são **construções completas**: elas incluem o compilador e suportam a compilação de modelos de marcação diretamente no navegador. No entanto, elas aumentarão o tamanho da carga para mais ou menos 14kb.

As nossas configurações de ferramental padrão usam a construção de tempo de execução apenas, já que todos os modelos de marcação nos SFCs são pré-compilados. Se, por alguma razão, precisares da compilação de modelo de marcação no navegador mesmo com uma etapa de construção, podes ter isto configurando a ferramenta de construção para atribuir o pseudónimo `vue` ao `vue/dist/vue.esm-bundler.js`. 

Se estiveres a procura de uma alternativa mais leve para uso sem etapa de construção, consulte a [petite-vue](https://github.com/vuejs/petite-vue).

## Suporte de IDE {#ide-support}

- A configuração de IDE recomendada é [VSCode](https://code.visualstudio.com/) + a extensão [Volar](https://github.com/johnsoncodehk/volar). Volar fornece destacamento de sintaxe, suporte de TypeScript, e sensor inteligente para expressões de modelo de marcação e propriedades de componente.

  :::tip DICA
  Volar substitui [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), a nossa anterior extensão de VSCode oficial para Vue 2. Se tiveres com a Vetur atualmente instalada certifica-te de desativá-la nos projetos de Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) também fornece um excelente suporte embutido para os SFCs de Vue.

- Outras IDEs que suportam o [Protocolo de Serviço de Linguagem](https://microsoft.github.io/language-server-protocol/) (LSP, sigla em Inglês) também podem influenciar

  - Suporte de Sublime Text através de [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Suporte de VIM / NeoVIM através de [coc-volar](https://github.com/yaegassy/coc-volar).

  - Suporte de Emacs através de [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Ferramentas de Programação do Navegador {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="Aula Gratuita sobre as Ferramentas de Programação de Vue.js no Navegador"/>

A extensão de ferramentas de programação do navegador de Vue permite-te explorar uma árvore de componente da aplicação de Vue, inspecionar o estado de componentes individuais, rastrear os eventos da gestão de estado, e desempenho de perfil.


![captura de tela das ferramentas de programação](https://raw.githubusercontent.com/vuejs/devtools/main/media/screenshot-shadow.png)

- [Documentação](https://devtools.vuejs.org/)
- [Extensão de Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Extensão de Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Aplicação de Electron Autónoma](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

Artigo principal: [Usando a Vue com a TypeScript](/guide/typescript/overview).

- [Volar](https://github.com/johnsoncodehk/volar) fornece a verificação de tipos para SFCs usando blocos `<script lang="ts">`, incluindo expressões de modelo de marcação e a validação de propriedades de componente cruzada.

- Use [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) para a realização da mesma verificação de tipo a partir da linha de comando, ou para geração de ficheiros `d.ts` para SFCs.

## Testagem {#testing}

Artigo principal: [Guia de Testagem](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) é recomendado para testes E2E. Ele pode também ser usado para testagem de componente para SFCs de Vue através do [Executor de Teste de Componente de Cypress](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) é um executor de teste criado pelos membros da equipa de Vue e Vite que se concentra na velocidade. Está especialmente desenhado para aplicações baseadas em Vite para fornecer o mesmo laço de reação imediata para a testagem de componente e unitária.

- [Jest](https://jestjs.io/) pode ser posta a trabalhar com a Vite através de [vite-jest](https://github.com/sodatea/vite-jest). No entanto, isto só é recomendado se tiveres conjuntos de teste baseados em Jest que precisas migrar todo para uma configuração baseada em Vite, visto que a Vitest fornece funcionalidades semelhantes com uma integração muito mais eficiente.

## Impressões sobre a Condição do Projeto {#linting}

A equipa da Vue mantêm [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), uma extensão de [ESLint](https://eslint.org/) que suporta regras de impressão especifica para Componente de Ficheiro Único (SFC, sigla em Inglês).

Utilizadores que anteriormente usando a Linha de Comanda da Vue podem estar acostumados a ter as impressões configuradas através de carregadores de Webpack. No entanto, quando ao usar uma configuração de construção baseada em Vite, nossa recomendação geral é:

1. `npm install -D eslint eslint-plugin-vue`, depois siga o [guia de configuração](https://eslint.vuejs.org/user-guide/#usage) da `eslint-plugin-vue`.

2. Configure as extensões de IDE de ESLint, por exemplo [ESLint para VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), assim recebes o retorno da impressão diretamente no teu editor durante o desenvolvimento. Isto também evita custo de impressão desnecessário no momento iniciar o servidor de desenvolvimento.

3. Execute o ESLint como parte do comando de construção da produção, então recebes retorno completo da impressão antes de enviar para produção.

4. (Opcional) Ferramentas de configuração tais como [lint-staged](https://github.com/okonet/lint-staged) para imprimir os ficheiros modificados na execução do comando `git commit`.

## Formatação {#formatting}

- A extensão [Volar](https://github.com/johnsoncodehk/volar) do Visual Studio Code fornece formatação para Componentes de Ficheiro Único de Vue (ou Vue SFCs em Inglês) fora da caixa.

- Em alternativa, a [Prettier](https://prettier.io/) fornece suporte a formatação de Componente Ficheiro Único de Vue embutido.

## Integrações de Bloco Personalizada de SFC {#sfc-custom-block-integrations}

Os blocos personalizados são compilados para as importações no mesmo ficheiro de Vue com diferentes consultas de requisição. Está sobre a ferramenta de construção subjacente a responsabilidade de manipular estas requisições de importação.

- Se estiveres a usar a Vite, uma extensão de Vite personalizada deve ser usada para transformar os blocos personalizados combinados em JavaScript executável. [Exemplo](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Se estiveres a usar a Interface de Linha de Comando de Vue ou o simples Webpack, um carregador de Webpack deve ser configurado para transformar os blocos combinados. [Exemplo](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Pacotes de Nível Mais Baixo {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Documentação](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Este pacote é parte do mono-repositório núcleo da Vue e é sempre publicado com a mesma versão como pacote principal de `vue`. Ele está incluído como uma dependência do pacote principal de `vue` e delegado sob o `vue/compiler-sfc` então não precisas instalá-lo individualmente.

O pacote em si mesmo fornece utilitários de mais baixo nível para o processamento de Componentes de Ficheiro Único de Vue e é apenas destinado para criadores de ferramental que precisam suportar Componentes de Ficheiros Único de Vue em ferramentas personalizadas.

:::tip DICA
Sempre prefira o uso deste pacote através da importação profunda de `vue/compiler-sfc` já que isto garante que a sua versão esteja em sincronia com o executor de Vue.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Documentação](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

Extensão oficial que fornece suporte a Componente de Ficheiro Único na Vite.

### `vue-loader` {#vue-loader}

- [Documentação](https://vue-loader.vuejs.org/)

O carregador oficial que fornece o suporte ao Componente de Ficheiro Único de Vue na Webpack. Se estiveres a usar a Interface de Linha de Comando da Vue, consulte também a [documentação sobre a modificação das opções de `vue-loader` na Interface de Linha de Comando de Vue](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

## Outras Zonas de Testes {#other-online-playgrounds}

- [Zona de Testes da VueUse](https://play.vueuse.org)
- [Vue + Vite na Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue na CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue na Codepen](https://codepen.io/pen/editor/vue)
- [Vue na Components.studio](https://components.studio/create/vue3)
- [Vue na WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
