# Ferramental {#tooling}

## Experimente-o Online {#try-it-online}

Não será necessário instalar nada em sua máquina para experimentar os Componentes de Ficheiro Único do Vue - existem zonas de testes online que permitem fazer isto direto no navegador:

- [Zona de Teste de SFC Vue](https://play.vuejs.org)
  - Sempre implantado a partir da entrega mais recente
  - Desenhado para inspeção dos resultados da compilação do componente
- [Vue + Vite na StackBlitz](https://vite.new/vue)
  - Ambiente semelhante a IDE executando um servidor de desenvolvimento de Vite real no navegador
  - Mais próximo da configuração local

Também é recomendado usar esta zona de testes online para fornecer reproduções ao relatar bugs.

## Estruturação do Projeto {#project-scaffolding}

### Vite {#vite}

[Vite](https://vitejs.dev/) é uma ferramenta de compilação rápida e leve com suporte Vue SFC de primeira classe. Foi criada por Evan You, que também é autor do Vue!

Para começar com Vite + Vue, simplesmente execute:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">$</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará e executará [create-vue](https://github.com/vuejs/create-vue), a ferramenta de estruturação de projeto oficial do Vue .

- Para aprender mais sobre Vite, consulte a [documentação do Vite](https://pt.vitejs.dev).
- Para configurar o comportamento específico do Vue em um projeto Vite, por exemplo passando as opções para o compilador do Vue, consulte a documentação para [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme).

Ambas zonas de testes online mencionadas acima também suportam o descarregamento dos ficheiros como um projeto Vite.

### Interface de Linha de Comando Vue {#vue-cli}

A [Interface de Linha de Comando Vue](https://cli.vuejs.org/) é o conjunto de ferramentas oficial baseado em Webpack para Vue. Agora está em modo de manutenção e recomendamos iniciar novos projetos com Vite, a menos que dependa de recursos específicos apenas do webpack. Vite fornecerá experiência superior ao desenvolvedor na maioria dos casos.

Para mais informações sobre a migração da CLI do Vue para Vite:

- [Guia de Migração da Interface de Linha de Comando do Vue -> Vite da VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Ferramentas / Extensões que ajudam com a migração automática](https://github.com/vitejs/awesome-vite#vue-cli)

### Nota sobre a Compilação de Modelo de Marcação no Navegador {#note-on-in-browser-template-compilation}

Quando estiveres a usar a Vue sem uma etapa de compilação, os modelos de marcação do componente são escritos ou diretamente no HTML da página ou como sequências de caracteres de JavaScript embutida. Em tais casos, a Vue precisa entregar o compilador de modelo de marcação ao navegador para realizar a compilação do modelo de marcação sobre o ar. Por outro lado, o compilador seria desnecessário se pré-compilarmos os modelos de marcação com uma etapa de compilação. Para reduzir o tamanho do pacote do cliente, a Vue fornece [diferentes "compilações"](https://unpkg.com/browse/vue@3/dist/) otimizadas para diferentes casos de uso.

- Os ficheiros de compilação que começam com `vue.runtime.*` são **compilações somente de tempo de execução**: eles não incluem o compilador. Ao usar estas compilações, todos os modelos de marcação devem ser pré-compilados por meio de uma etapa de compilação.

- Os ficheiros de compilação que não incluem `.runtime` são **compilações completas**: eles incluem o compilador e suportam a compilação de modelos de marcação diretamente no navegador. No entanto, eles aumentarão a carga útil em aproximadamente 14kb.

Nossas configurações de ferramentas padrão usam a compilação somente em tempo de execução, já que todos os modelos em SFCs são pré-compilados. Se, por algum motivo, você precisar de compilação de modelo no navegador, mesmo com uma etapa de compilação, poderá fazer isso configurando a ferramenta de compilação para fazer um pseudônimo de `vue` para `vue/dist/vue.esm-bundler.js`.

Se está procurando uma alternativa mais leve para uso sem etapa de compilação, dê uma olhada no [petite-vue](https://github.com/vuejs/petite-vue).

## Suporte de IDE {#ide-support}

- A configuração de IDE recomendada é [VSCode](https://code.visualstudio.com/) + a extensão [Volar](https://github.com/johnsoncodehk/volar). Essa extensão fornece destacamento de sintaxe, suporte a TypeScript, e sensor inteligente para expressões de modelo de marcação e a propriedades de componentes.

  :::tip DICA
  Volar substitui [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), a nossa extensão anterior oficial no VSCode para Vue 2. Se estiver com o Vetur atualmente instaladp certifica-te de desativá-lo nos projetos do Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) também fornece um excelente suporte embutido para os SFCs do Vue.

- Outras IDEs que suportam o [Protocolo de Serviço de Linguagem](https://microsoft.github.io/language-server-protocol/) (LSP, sigla em Inglês) também podem influenciar:

  - Suporte do Sublime Text através do [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Suporte do VIM / NeoVIM através do [coc-volar](https://github.com/yaegassy/coc-volar).

  - Suporte do Emacs através do [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Ferramentas de Programação do Navegador {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="Aula Gratuita sobre as Ferramentas de Programação do Vue.js no Navegador"/>

A extensão de ferramentas de programação do navegador do Vue o permite explorar uma árvore de componentes de uma aplicação Vue, inspecionar o estado de componentes individuais, rastrear os eventos de gerenciamento de estado, e desempenho de perfil.

![captura de tela das ferramentas de programação](https://raw.githubusercontent.com/vuejs/devtools/main/media/screenshot-shadow.png)

- [Documentação](https://devtools.vuejs.org/)
- [Extensão do Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Extensão do Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Aplicação do Electron Autónoma](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

Artigo principal: [Usando Vue com TypeScript](/guide/typescript/overview).

- [Volar](https://github.com/johnsoncodehk/volar) fornece a verificação de tipos para SFCs usando blocos `<script lang="ts">`, incluindo expressões de modelo de marcação e a validação de propriedades de componente cruzados.

- Use [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) para realizar a verificação do mesmo tipo na linha de comando ou para gerarficheiros `d.ts` para SFCs.

## Testagem {#testing}

Artigo principal: [Guia de Testagem](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) é recomendado para testes E2E. Ele também pode ser usado para testagem de componentes SFCs do Vue através do [Executor de Teste de Componente de Cypress](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) é um executor de testes criado pelos membros da comunidade do Vue / Vite com foco na velocidade. Foi especialmente projetado para aplicações baseadas em Vite para fornecer o mesmo ciclo de reação imediata para testes de unidade/componente.

- [Jest](https://jestjs.io/) pode funcionar com o Vite através do [vite-jest](https://github.com/sodatea/vite-jest). No entanto, isto só é recomendado se os conjuntos de testes baseados em Jest existentes que precisam migrar para uma configuração baseada em Vite, pois o Vitest fornece funcionalidades semelhantes com uma integração muito mais eficiente.

## Impressões sobre a Condição do Projeto {#linting}

O time Vue mantêm [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), uma extensão de [ESLint](https://eslint.org/) que oferece suporte a regras de impressão específica para Componente de Ficheiro Único (SFC, sigla em Inglês).

Usuários que anteriormente já usaram a Linha de Comanda Vue podem estar acostumados a ter as impressões configuradas através de carregadores de Webpack. No entanto, quando ao usar uma configuração de compilãção baseada em Vite, nossa recomendação geral é:

1. `npm install -D eslint eslint-plugin-vue`, depois siga o [guia de configuração](https://eslint.vuejs.org/user-guide/#usage) do `eslint-plugin-vue`.

2. Configure as extensões IDE de ESLint, por exemplo [ESLint para VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), assim recebe o retorno da impressão diretamente em seu editor durante o desenvolvimento. Isto também evita custo de impressão desnecessário no momento iniciar o servidor de desenvolvimento.

3. Execute o ESLint como parte do comando de compilação da produção, então recebe o retorno completo da impressão antes de enviar para produção.

4. (Opcional) Ferramentas de configuração como [lint-staged](https://github.com/okonet/lint-staged) para imprimir os ficheiros modificados na execução do comando `git commit`.

## Formatação {#formatting}

- A extensão [Volar](https://github.com/johnsoncodehk/volar) do Visual Studio Code fornece formatação para Componentes de Ficheiro Único do Vue (ou Vue SFCs em Inglês) pronta para uso.

- Alternativamente, [Prettier](https://prettier.io/) fornece suporte integrado à formatação de Componente Ficheiro Único do Vue.

## Integrações de Bloco Personalizada SFC {#sfc-custom-block-integrations}

Os blocos personalizados são compilados para as importações no mesmo ficheiro do Vue com diferentes consultas de requisição. Cabe a ferramenta de compilação subjacente a responsabilidade de manipular estas requisições de importação.

- Se estiver usando Vite, uma extensão do Vite personalizada deve ser usada para transformar os blocos personalizados combinados em JavaScript executável. [Exemplo](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Se estiver usando a Interface de Linha de Comando do Vue (CLI) ou o simples Webpack, um carregador de Webpack deve ser configurado para transformar os blocos correspondentes. [Exemplo](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Pacotes de Baixo Nível {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Documentação](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Este pacote é parte do mono-repositório Vue e é sempre publicado com a mesma versão do pacote principal de `vue`. Ele está incluído como uma dependência do pacote principal de `vue` e delegado sob o `vue/compiler-sfc` então não precirá instalá-lo individualmente.

O pacote em si mesmo fornece utilitários de mais baixo nível para o processamento de SFCs (Componentes de Ficheiro Único do Vue) destina-se apenas a autores de ferramentas que precisam oferecer suporte a SFCs (Componentes de Ficheiros Único do Vue) em ferramentas personalizadas.

:::tip DICA
Sempre prefira o uso deste pacote através da importação profunda de `vue/compiler-sfc` já que isto garante que a sua versão esteja em sincronia com o tempo de execução do Vue.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Documentação](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

Extensão oficial que fornece suporte a Componente de Ficheiro Único na Vite.

### `vue-loader` {#vue-loader}

- [Documentação](https://vue-loader.vuejs.org/)

O carregador oficial que fornece o suporte ao Componente de Ficheiro Único Vue no Webpack. Se estiveres a usar a Interface de Linha de Comando Vue, consulte também a [documentação sobre a modificação das opções de `vue-loader` na Interface de Linha de Comando do Vue](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

## Outras Zonas de Testes {#other-online-playgrounds}

- [Zona de Testes VueUse](https://play.vueuse.org)
- [Vue + Vite na Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue na CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue na Codepen](https://codepen.io/pen/editor/vue)
- [Vue na Components.studio](https://components.studio/create/vue3)
- [Vue na WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
