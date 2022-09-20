---
footer: false
---

# Inicio Rápido

Dependendo do teu caso de uso e preferência, podes utilizar a Vue com ou sem uma etapa de construção.

## Com Ferramentas de Construção

Uma configuração de construção permite-te utilizar [Componentes de Ficheiro Único (SFCs, sigla em Inglês)](/guide/scaling-up/sfc) de Vue. A configuração de construção de Vue oficial está baseada sobre a [Vite](https://vitejs.dev), uma ferramenta de construção de frontend que é moderna, leve e extremamente rápida.

### Online

Tu podes experimentar a Vue com os Componentes de Ficheiro Único online na [StackBlitz](https://vite.new/vue). A StackBlitz executa uma configuração de construção baseada na Vite diretamente no navegador, assim é quase idêntico a configuração local porém não requer a instalação de nada na tua máquina.

### Local

:::tip Pré-requisitos

- Familiaridade com a linha de comando
- Instalar a [Node.js](https://nodejs.org/)
:::

Para criar um projeto de Vue com ferramenta de construção ativada na tua máquina, execute o seguinte comando na tua linha de comando (sem o sinal `>`):

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará e executará [create-vue](https://github.com/vuejs/create-vue), a ferramenta de andaimes de projeto de Vue oficial. Tu serás presenteado com os pontos para um número de funcionalidades opcionais tais como TypeScript e suporte a testagem:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Cypress for both Unit and End-to-End testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Se estiveres inseguro a respeito de uma opção, por agora simplesmente escolha `No` pressionando a tecla enter. Uma vez que o projeto estiver criado, siga as instruções para instalar as dependências e iniciar o servidor de desenvolvimento:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

Agora deves ter o teu primeiro projeto em Vue executando! Nota que os componentes de exemplo no projeto gerado estão escritos utilizando a [API de Composição](/guide/introduction.html#api-de-composição) e `<script setup>`, no lugar da [API de Opções](/guide/introduction.html#api-de-opções). Cá estão alguns dicas adicionais:

- A configuração de IDE recomendada é [Visual Studio Code](https://code.visualstudio.com/) + [extensão Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Se utilizas outros editores, consulte a [seção de suporte de IDE](/guide/scaling-up/tooling.html#suporte-de-ide).
- Mais detalhes do ferramental, incluindo integração com abstrações de backend, são discutidas no [Guia de Ferramental](/guide/scaling-up/tooling.html).
- Para aprender mais a respeito de ferramenta de construção subjacente Vite, consulte a [documentação de Vite](https://vitejs.dev).
- Se escolheres utilizar a TypeScript, consulte a [Guia de Utilização de TypeScript](typescript/overview.html).

Quando estiveres pronto para enviar a tua aplicação para produção, execute o seguinte:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

Isto criará a construção pronta para produção da tua aplicação no diretório `.dist/` do projeto. Consulte o [Guia de Desdobramento de Produção](/guide/best-practices/production-deployment.html) para aprender mais a respeito do envio da tua aplicação para produção.

[Próximos passos >](#próximos-passos)

## Sem Ferramentas de Construção

Para começar com a Vua sem uma etapa de construção, simplesmente copie o seguinte código para dentro de um ficheiro HTML e abra-o no navegador:

```html
<script src="https://unpkg.com/vue@3"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

O exemplo acima utiliza a construção global de Vue onde todas APIs são expostas sob a variável `Vue` global. Por exemplo, para também utilizar a API `ref`, podes fazer:

```js
const { createApp, ref } = Vue
```

Enquanto a construção global funciona, estaremos primariamente utilizando a sintaxe de [módulos de ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) por todo o resto da documentação por questão consistência. Para utilizar a Vue sobre os módulos de ES nativos, utilize a seguinte HTML:

```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

Repare em como podemos importar diretamente de `'vue'` no nosso código - isto é feito possível pelo bloco `<script type="importmap">`, entregando uma funcionalidade nativa de navegador chamada [Import Maps (Importar Mapas)](https://caniuse.com/import-maps).

Tu podes adicionar entradas para outras dependências no `importmap` (importar mapa) - apenas certifica-te que elas apontam para versão de módulos de ES da biblioteca que tencionas utilizar.

:::tip Suporte do Navegador ao Importar Mapas
Importar mapas são suportados por padrão nos navegadores baseados no Chromium, assim recomendamos a utilização do Chrome ou Edge durante o processo de aprendizado.

Se estiveres utilizando o Firefox, ela só é suportada a partir da versão 102 a diante e atualmente precisa ser ativada através da opção `dom.importMaps.enabled` no `about:config`.

Se o teu navegador preferido ainda não suporta importar mapas, podes adicionar um "polyfill" para ela com [es-module-shims](https://github.com/guybedford/es-module-shims).
:::

:::warning Não para produção
A configuração baseada no importar de mapas está destinada apenas para o aprendizado - se tencionas utilizar a Vue sem ferramentas de construção em produção, certifica-te de consultar o [Guia de Desdobramento de Produção](/guide/best-practices/production-deployment.html#sem-ferramentas-de-construção).
:::

### Servindo sobre o HTTP

Conforme mergulhamos mais a fundo no guia, poderemos precisar separar o nosso código em ficheiros de JavaScript separados para que sejam mais fácil de gerir. Por exemplo:

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```

Para isto funcionar, precisas servir o tua HTML sobre o protocolo `http://` no lugar do protocolo `file://`. Para iniciar um servidor de HTTP local, primeiro instale a [Node.js](https://nodejs.org/en/), e depois execute `npx serve` a partir da linha de comando no mesmo diretório onde o teu ficheiro de HTML está. Tu também podes utilizar qualquer outro servidor de HTTP que possa servir ficheiros estáticos com os tipos de MIME corretos.

Tu podes ter notado que o modelo de marcação do componente importado está em linha como uma sequência de caracteres de JavaScript. Se estiveres utilizando o VSCode, podes instalar a extensão [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) e prefixar as sequências de caracteres com um comentário `/*html*/` para obteres o destacamento de sintaxe para elas.

## Next Steps
## Próximos Passos

Se saltaste a [Introdução](/guide/introduction), recomendamos fortemente a leitura dela antes de avançar para o resto da documentação.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">Continuar o Guia</p>
    <p class="next-steps-caption">O guia acompanha-te através de cada aspeto da abstração de maneira detalhada.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Experimente a Aula</p>
    <p class="next-steps-caption">Para aqueles que preferem o aprendizado de coisas com prática.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Consulte os Exemplos</p>
    <p class="next-steps-caption">Explore os exemplos de funcionalidades principais e tarefas de UI comuns.</p>
  </a>
</div>
