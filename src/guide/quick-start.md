---
footer: false
---

# Inicio Rápido {#quick-start}

## Experimente a Vue Online {#try-vue-online}

- Para ter um gosto da Vue rapidamente, podes experimentá-la diretamente na nossa [Zona de Testes](https://sfc.vuejs.org/#eNo9j01qAzEMha+iapMWOjbdDm6gu96gG2/cjJJM8B+2nBaGuXvlpBMwtj4/JL234EfO6toIRzT1UObMexvpN6fCMNHRNc+w2AgwOXbPL/caoBC3EjcCCPU0wu6TvE/wlYqfnnZ3ae2PXHKMfiwQYArZOyYhAHN+2y9LnwLrarTQ7XeOuTFch5Am8u8WRbcoktGPbnzFOXS3Q3BZXWqKkuRmy/4L1eK4GbUoUTtbPDPnOmpdj4ee/1JVKictlSot8hxIUQ3Dd0k/lYoMtrglwfUPkXdoJg==).

- Se preferires uma configuração de HTML simples sem etapas de construção, podes utilizar este [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) como teu ponto de partida.

- Se já estiveres familiarizado com a Node.js e o conceito de ferramentas de construção, também podes experimentar uma configuração de construção completa diretamente de dentro do teu navegador no [StackBlitz](https://vite.new/vue).

## Criando uma Aplicação de Vue {#creating-a-vue-application}

:::tip Pré-requisitos

- Familiaridade com a linha de comando
- Instale a versão 16.0 ou superior da [Node.js](https://nodejs.org/)
:::

Nesta secção introduziremos como estruturar uma [Aplicação de Página Única](/guide/extras/ways-of-using-vue.html#single-page-application-spa) de Vue na tua máquina local. O projeto criado estará utilizando uma configuração de construção baseada na [Vite](https://vitejs.dev), e permite-nos utilizar os [Componentes de Ficheiro Único](/guide/scaling-up/sfc) de Vue.

Certifica-te de tens uma versão atualizada da [Node.js](https://nodejs.org) instalada, depois execute o seguinte comando na tua linha de comando (sem o sinal `>`):

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará e executará [create-vue](https://github.com/vuejs/create-vue), a ferramenta oficial de estruturação de projeto de Vue. Tu serás presenteado com uma lista com um número de funcionalidades opcionais tais como TypeScript e suporte a testagem:

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

Agora deves ter o teu primeiro projeto em Vue executando! Nota que os componentes de exemplo no projeto gerado estão escritos utilizando a [API de Composição](/guide/introduction.html#api-de-composição) e `<script setup>`, no lugar da [API de Opções](/guide/introduction.html#api-de-opções). Cá estão algumas dicas adicionais:

- A configuração de IDE recomendada é [Visual Studio Code](https://code.visualstudio.com/) + [extensão Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Se utilizas outros editores, consulte a [seção de suporte de IDE](/guide/scaling-up/tooling.html#suporte-de-ide).
- Mais detalhes do ferramental, incluindo integração com abstrações de backend, são discutidas no [Guia de Ferramental](/guide/scaling-up/tooling.html).
- Para aprender mais a respeito de ferramenta de construção subjacente Vite, consulte a [documentação de Vite](https://vitejs.dev).
- Se escolheres utilizar a TypeScript, consulte a [Guia de Utilização de TypeScript](typescript/overview.html).

Quando estiveres pronto para enviar a tua aplicação para produção, execute o seguinte:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

Isto criará a construção pronta para produção da tua aplicação no diretório `.dist/` do projeto. Consulte o [Guia de Desdobramento de Produção](/guide/best-practices/production-deployment.html) para aprender mais a respeito do envio da tua aplicação para produção.

[Próximos passos >](#próximos-passos)

## Utilizando a Vue a partir da CDN {#using-vue-from-cdn}

Tu podes utilizar a Vue diretamente a partir de uma CDN através de um marcador de `script`:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Cá estamos utilizando [unpkg](https://unpkg.com/), mas também podes utilizar qualquer CDN que sirva pacotes de npm, por exemplo [jsdelivr](https://www.jsdelivr.com/package/npm/vue) ou [cdnjs](https://cdnjs.com/libraries/vue). Claro, também podes descarregar este ficheiro e servi-lo tu mesmo.

Quando estiveres utilizando a Vue a partir de um CDN, não existe "etapa de construção" envolvida. Isto torna a configuração muito mais simples, e é adequado para a otimização da HTML estática ou integração com uma abstração de backend. No entanto, não serás capaz de utilizar a sintaxe de Componente de Ficheiro Único.

### Utilizando a Construção Global {#using-the-global-build}

A ligação acima está carregando a **construção global** de Vue, onde todas APIs de alto nível estão expostas como propriedades sobre o objeto `Vue` global. Cá está um exemplo completo de utilização da construção global:


```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

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

[Demonstração do JSFiddle](https://jsfiddle.net/yyx990803/nw1xg8Lj/)

### Utilizando a Construção de Módulo de EcmaScript {#using-the-es-module-build}

Ao longo do resto da documentação, estaremos essencialmente utilizando a sintaxe de [módulos de EcmaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Agora a maioria dos navegadores suportam os módulos de EcmaScript de maneira nativa, assim a podemos utilizar a Vue a partir de um CDN através dos módulos de EcmaScript desta maneira:

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

Repara que estamos utilizando `<script type="module">`, e a URL do CDN importado está apontando para a **construção de módulos de EcmaScript** da Vue.

[Demonstração de JSFiddle](https://jsfiddle.net/yyx990803/vo23c470/)

### Ativando os Mapas de Importação {#enabling-import-maps}

No exemplo acima estamos importando a partir de um URL de CDN completa, mas no resto da documentação verás o código desta maneira:

```js
import { createApp } from 'vue'
```

Nós podemos instruir o navegador sobre onde localizar a importação de `vue` utilizando [Mapas de Importação](https://caniuse.com/import-maps):


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

[Demonstração de JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/)

Tu também podes adicionar entradas para outras dependências ao mapa de importação - mas certifica-te de que eles apontam para as versões de módulos de EcmaScript da biblioteca que tencionas utilizar.

:::tip Suporte do Navegador aos Mapas de Importação
Os mapas de importação são suportados por padrão nos navegadores baseados no Chromium, assim recomendamos a utilização do Chrome ou Edge durante o processo de aprendizado.

Se estiveres utilizando o Firefox, ele só é suportado a partir da versão 102 a diante e atualmente precisa ser ativada através da opção `dom.importMaps.enabled` no `about:config`.

Se o teu navegador preferido ainda não suporta os mapas de importação, podes adicionar um "polyfill" para ele com [es-module-shims](https://github.com/guybedford/es-module-shims).
:::

:::warning Notas a respeito Uso em Produção
Os exemplos até aqui estão utilizando a construção de desenvolvimento de Vue - se tencionas utilizar a Vue a partir de um CDN em produção, certifica-te de consultar o [Guia de Desdobramento de Produção](/guide/best-practices/production-deployment.html#sem-ferramentas-de-construção).
:::

### Dividindo os Módulos {#splitting-up-the-modules}

A medida que mergulhamos mais fundo no guia, poderemos precisar dividir o nosso código para dentro de ficheiros de JavaScript separados para que eles sejam mais fáceis de gerir. Por exemplo:

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

Se abrires o `index.html` acima diretamente no teu navegador, descobrirás que ela lança um erro porque os módulos de EcmaScript não podem funcionar sobre o protocolo `file://`. Para isto funcionar, precisas servir o teu `index.html` sobre o protocolo `http://`, com um servidor de HTTP local.

Para iniciar um servidor de HTTP local, primeiro instale a [Node.js](https://nodejs.org/en/), e depois execute `npx serve` a partir da linha de comando no mesmo diretório onde o teu ficheiro HTML está. Tu também podes utilizar qualquer outro servidor de HTTP que pode servir os ficheiros estáticos com os tipos de MIME corretos.

Tu podes ter notado que o modelo de marcação do componente importado está em linha como uma sequência de caracteres de JavaScript. Se estiveres utilizando o VSCode, podes instalar a extensão [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) e prefixar as sequências de caracteres com um comentário `/*html*/` para obteres o destacamento de sintaxe para elas.

### Utilizando a API de Composição sem uma Etapa de Construção {#using-composition-api-without-a-build-step}

Muitos dos exemplos para API de Composição estarão utilizando a sintaxe `<script setup>`. Se tencionas utilizar a API de Composição sem uma etapa de construção, consulte a utilização da [opção `setup()`](/api/composition-api-setup.html).

## Próximos Passos {#next-steps}

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
