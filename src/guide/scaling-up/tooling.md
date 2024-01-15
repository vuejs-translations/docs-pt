# Ferramental {#tooling}

## Experimente Online {#try-it-online}

Não será necessário instalar nada em sua máquina para experimentar os Componentes de Arquivo Único do Vue - existem zonas de teste online que lhe permitem fazer isto direto no navegador:

- [Zona de Teste de SFC Vue](https://play.vuejs.org)
  - Sempre disponibilizado com a última versão
  - Projetado para inspecionar os resultados da compilação do componente
- [Vue + Vite na StackBlitz](https://vite.new/vue)
  - Ambiente semelhante a IDE executando um servidor de desenvolvimento Vite real no navegador
  - Mais próximo da configuração local

Também é recomendado usar estas zonas de teste online para fornecer exemplos reproduzíveis ao relatar problemas.

## Estruturação do Projeto {#project-scaffolding}

### Vite {#vite}

[Vite](https://vitejs.dev/) é uma ferramenta de compilação rápida e leve com suporte Vue SFC de primeira classe. Foi criada por Evan You, que também é autor do Vue!

Para começar com Vite + Vue, simplesmente execute:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">$</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará e executará [create-vue](https://github.com/vuejs/create-vue), a ferramenta de estruturação de projeto oficial do Vue.

- Para aprender mais sobre Vite, consulte a [documentação do Vite](https://pt.vitejs.dev).
- Para configurar o comportamento específico do Vue em um projeto Vite, por exemplo passar opções para o compilador Vue, consulte a documentação de [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme).

Ambas as zonas de teste online mencionadas acima também suportam o descarregamento dos arquivos como um projeto Vite.

### Interface de Linha de Comando Vue {#vue-cli}

A [Interface de Linha de Comando Vue](https://cli.vuejs.org/) é o conjunto de ferramentas oficial baseado em Webpack para Vue. Agora ele está em modo de manutenção e recomendamos iniciar novos projetos com Vite, a menos que dependa de recursos únicos e específicos do webpack. Vite fornecerá experiência superior ao desenvolvedor na maioria dos casos.

Para mais informações sobre a migração de Vue CLI para Vite:

- [Guia de Migração Vue CLI -> Vite da VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Ferramentas / Extensões que ajudam com a migração automática](https://github.com/vitejs/awesome-vite#vue-cli)

### Nota sobre a Compilação de Modelo de Marcação no Navegador {#note-on-in-browser-template-compilation}

Ao usar Vue sem uma etapa de construção, os modelos de marcação do componente são escritos ou diretamente no HTML da página ou como sequências de JavaScript embutidos. Nesses casos, Vue precisa entregar o compilador de modelo de marcação ao navegador para realizar de imediato a compilação do modelo de marcação. Por outro lado, o compilador seria desnecessário se pré-compilarmos os modelos de marcação com uma etapa de construção. Para reduzir o tamanho do pacote do cliente, Vue fornece [diferentes "construções"](https://unpkg.com/browse/vue@3/dist/) otimizadas para diferentes casos.

- Os arquivos de construção que começam com `vue.runtime.*` são **construções somente em tempo de execução**: eles não incluem o compilador. Ao usar estas compilações, todos os modelos de marcação devem ser pré-compilados por meio de uma etapa de construção.

- Os arquivos de construção que não incluem `.runtime` são **construções completas**: eles incluem o compilador e suportam a compilação de modelos de marcação diretamente no navegador. No entanto, eles aumentarão o carregamento em aproximadamente 14kb.

Nossas configurações de ferramentas padrão usam a construção somente em tempo de execução, já que todos os modelos em SFCs são pré-compilados. Se, por algum motivo, for preciso de compilação de modelo no navegador, mesmo com uma etapa de construção, isso pode ser feito configurando a ferramenta de construção para fazer um pseudônimo de `vue` para `vue/dist/vue.esm-bundler.js`.

Para quem busca uma alternativa mais leve para uso sem etapas de construção, dê uma olhada em [petite-vue](https://github.com/vuejs/petite-vue).

## Suporte de IDE {#ide-support}

- A configuração de IDE recomendada é [VSCode](https://code.visualstudio.com/) + a extensão [Volar](https://github.com/johnsoncodehk/volar). Essa extensão fornece destacamento de sintaxe, suporte a TypeScript, e sensor inteligente para expressões de modelo de marcação e propriedades de componentes.

  :::tip DICA
  Volar substitui [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), a nossa antiga extensão oficial no VSCode para Vue 2. Se o Vetur estiver atualmente instalado, certifique-se de desativá-lo em projetos Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) também fornece um excelente suporte embutido para SFCs do Vue.

- Outras IDEs que suportam o [Protocolo de Serviço de Linguagem](https://microsoft.github.io/language-server-protocol/) (LSP, sigla em inglês) também podem aproveitar as funcionalidades chave do Volar:

  - Suporte no Sublime Text através do [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Suporte no vim / Neovim através do [coc-volar](https://github.com/yaegassy/coc-volar).

  - Suporte no emacs através do [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Vue Devtools no Navegador {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="Assista uma aula gratuita na Vue School"/>

A extensão Vue Devtools no navegador permite explorar árvores de componentes de uma aplicação Vue, inspecionar o estado de componentes individuais, rastrear eventos de gerenciamento de estado, e perfilar o desempenho.

![captura de tela das ferramentas de programação](https://raw.githubusercontent.com/vuejs/devtools/main/media/screenshot-shadow.png)

- [Documentação](https://devtools.vuejs.org/)
- [Extensão do Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Extensão do Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Extensão do Edge](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)
- [Para Aplicação Electron](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

Artigo principal: [Usando Vue com TypeScript](/guide/typescript/overview).

- [Volar](https://github.com/johnsoncodehk/volar) fornece a verificação de tipos para SFCs usando blocos `<script lang="ts">`, incluindo expressões de modelo de marcação e a validação de propriedades de componente cruzados.

- Use [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) para realizar a verificação do mesmo tipo na linha de comando ou para gerar arquivos `d.ts` para SFCs.

## Testagem {#testing}

Artigo principal: [Guia de Testagem](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) é recomendado para testes E2E. Ele também pode ser usado para testagem de componentes SFCs do Vue através do [Executor de Teste de Componente de Cypress](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) é um executor de testes criado pelos membros da comunidade do Vue / Vite com foco na velocidade. Foi especialmente projetado para aplicações baseadas em Vite para fornecer o mesmo ciclo de reação imediata para testes de unidade / componente.

- [Jest](https://jestjs.io/) pode funcionar com o Vite através do [vite-jest](https://github.com/sodatea/vite-jest). No entanto, isto só é recomendado se houverem conjuntos de testes baseados em Jest existentes que precisam migrar para uma configuração baseada em Vite, pois o Vitest fornece funcionalidades semelhantes com uma integração muito mais eficiente.

## _Linting_ {#linting}

O time Vue mantém [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), uma extensão de [ESLint](https://eslint.org/) que oferece suporte a regras de lint específicas para Componente de Arquivo Único.

Usuários que anteriormente já usaram Vue CLI podem estar acostumados a ter _linters_ configurados através do webpack. No entanto, ao usar uma configuração de construção baseada em Vite, nossa recomendação geral é:

1. `npm install -D eslint eslint-plugin-vue`, depois siga o [guia de configuração](https://eslint.vuejs.org/user-guide/#usage) do `eslint-plugin-vue`.

2. Configure as extensões IDE de ESLint, por exemplo [ESLint para VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), para que se possa receber o retorno do _linter_ diretamente no seu editor durante o desenvolvimento. Isso também evita processos de _linters_ desnecessários ao iniciar o servidor de desenvolvimento.

3. Execute o ESLint como parte do comando de construção em produção, para que se possa receber o retorno completo do _linter_ antes de enviar para produção.

4. (Opcional) Ferramentas de configuração como [lint-staged](https://github.com/okonet/lint-staged) para realizar mudanças automaticamente nos arquivos em um `git commit`.

## Formatação {#formatting}

- A extensão [Volar](https://github.com/johnsoncodehk/volar) do Visual Studio Code fornece formatação para Componentes de Arquivo Único do Vue (Vue SFCs) pronta para uso.

- Alternativamente, [Prettier](https://prettier.io/) fornece suporte integrado à formatação de Componente de Arquivo Único do Vue.

## Integrações de Bloco Personalizada SFC {#sfc-custom-block-integrations}

Os blocos personalizados são compilados em importações no mesmo arquivo Vue com diferentes consultas de requisição. É a ferramenta de compilação subjacente que decide como manipular estas requisições de importação.

- Ao usar Vite, uma extensão do Vite personalizada deve ser usada para transformar os blocos personalizados combinados em JavaScript executável. [Exemplo](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Ao usar Vue CLI ou webpack, um carregador webpack deve ser configurado para transformar os blocos correspondentes. [Exemplo](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Pacotes de Baixo Nível {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Documentação](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Este pacote é parte do Vue monorepo e é sempre publicado com a mesma versão do pacote principal de `vue`. Ele está incluído como dependência do pacote principal `vue` e delegado sob o `vue/compiler-sfc` então não precisará instalá-lo individualmente.

O pacote em si mesmo fornece utilitários de nível mais baixo para o processamento de SFCs (Componentes de Arquivo Único do Vue) e destina-se apenas a autores de ferramentas que precisam oferecer suporte a SFCs (Componentes de Arquivo Único do Vue) em ferramentas personalizadas.

:::tip DICA
Sempre prefira o uso deste pacote através da importação profunda de `vue/compiler-sfc` já que isto garante que sua versão esteja em sincronia com a versão do Vue em tempo de execução.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Documentação](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

Extensão oficial que fornece suporte a Componente de Arquivo Único em Vite.

### `vue-loader` {#vue-loader}

- [Documentação](https://vue-loader.vuejs.org/)

O carregador oficial que fornece o suporte a Componente de Arquivo Único Vue no webpack. Se usar Vue CLI, consulte também a [documentação sobre a modificação das opções `vue-loader` em Vue CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

## Outras Zonas de Teste {#other-online-playgrounds}

- [Zona de Teste VueUse](https://play.vueuse.org)
- [Vue + Vite na Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue na CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue na Codepen](https://codepen.io/pen/editor/vue)
- [Vue na Components.studio](https://components.studio/create/vue3)
- [Vue na WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
