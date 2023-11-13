---
footer: false
---

# Introdução Rápida {#quick-start}

## Experimentar a Vue Online {#try-vue-online}

- Para termos rapidamente um gosto da Vue, podemos experimentá-la diretamente na nossa [Zona de Testes (ou Zona de Experimentos)](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==).

- Se preferirmos uma configuração de HTML simples sem quaisquer etapas de construção podemos usar esta [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) como nosso ponto de partida.

- Se já estivermos familiarizados com a Node.js e com o conceito de ferramentas de construção, também podemos experimentar uma configuração de construção completa diretamente dentro do nosso navegador na [StackBlitz](https://vite.new/vue).

## Criando uma Aplicação de Vue {#creating-a-vue-application}

:::tip PRÉ-REQUISITOS

- Familiaridade com a linha de comando
- Versão 16.0 ou superior da [Node.js](https://nodejs.org/) instalada.

:::

Nesta seção introduziremos como estruturar uma [Aplicação de Página Única](/guide/extras/ways-of-using-vue#single-page-application-spa) de Vue na nossa máquina local. O projeto criado usará uma configuração de construção baseada na [Vite](https://pt.vitejs.dev), e nos permitirá usar os [Componentes de Ficheiro Único](/guide/scaling-up/sfc) da Vue.

Temos que certificar-nos de que temos uma versão atualizada da [Node.js](https://nodejs.org) instalada e o nosso diretório de trabalho atual é aquele onde tencionamos criar um projeto. Executamos o seguinte comando na nossa linha de comando (sem o sinal `>`):

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm create vue@latest</span></span></code></pre></div>

Este comando instalará e executará a [create-vue](https://github.com/vuejs/create-vue), a ferramenta de estruturação de projeto de Vue oficial. Nós seremos presenteados com prontos para várias funcionalidades opcionais tais como o suporte da TypeScript e testes:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Se estivermos inseguros sobre uma opção, por agora simplesmente escolhemos `No` pressionando `Enter`. Logo que o projeto for criado, seguimos as instruções para instalarmos as dependências e iniciar o servidor de desenvolvimento:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

Nós devemos ter agora o nosso primeiro projeto de Vue em execução! Nota que os componentes de exemplo no projeto gerado estão escritos usando a [API de Composição](/guide/introduction#composition-api) e o `<script setup>`, ao invés da [API de Opções](/guide/introduction#options-api). Eis algumas dicas adicionais:

- A configuração de ambiente de desenvolvimento integrado recomendada é o editor de texto [Visual Studio Code](https://code.visualstudio.com/) mais a [extensão Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Se usarmos outros editores, temos que consultar a [seção de suporte de ambiente de desenvolvimento integrado](/guide/scaling-up/tooling#ide-support).
- Mais detalhes sobre o ferramental, incluindo a integração com abstrações de backend, são discutidos no [Guia de Ferramental](/guide/scaling-up/tooling).
- Para sabermos mais sobre a ferramenta de construção subjacente Vite, temos que consultar a [documentação da Vite](https://pt.vitejs.dev).
- Se escolhermos usar a TypeScript, temos que consultar o [Guia de Uso de TypeScript](typescript/overview).

Quando estivermos prontos para disponibilizar a nossa aplicação em produção, executamos o seguinte:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

Isto criará uma construção preparada para produção da nossa aplicação dentro do diretório `./dist` do projeto. Consulte o [Guia de Implementação de Produção](/guide/best-practices/production-deployment) por mais informação sobre a disponibilização da nossa aplicação em produção.

[Próximos Passos >](#next-steps)

## Usando a Vue da Rede de Entrega de Conteúdo {#using-vue-from-cdn}

Nós podemos usar a Vue diretamente a partir duma rede de entrega de conteúdo através dum marcador `script`:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Eis que usamos a [unpkg](https://unpkg.com/), mas também podemos usar qualquer rede de entrega de conteúdo que serve pacotes de npm, por exemplo a [jsdelivr](https://www.jsdelivr.com/package/npm/vue) ou a [cdnjs](https://cdnjs.com/libraries/vue). E claro, também podemos descarregar este ficheiro e o servir por conta própria. 

Quando usamos a Vue a partir duma rede de entrega de conteúdo, não existe nenhuma "etapa de construção" envolvida. Isto torna a configuração muito mais simples, e é adequando para otimizar a HTML estática ou integrar com uma abstração de backend. No entanto, não serás capaz de usar a sintaxe do Componente de Ficheiro Único (ou, SFC).

### Usando a Construção Global {#using-the-global-build}

A ligação acima carrega a _construção global_ da Vue, onde todas as APIs  de alto nível são expostas como propriedades sobre o objeto `Vue` global. Eis um exemplo completo usando a construção global:

<div class="options-api">

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

[Demonstração da Codepen](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Demonstração da Codepen](https://codepen.io/vuejs-examples/pen/eYQpQEG)

</div>

:::tip NOTA
Muitos dos exemplos para a API de Composição ao longo do guia usarão a sintaxe do `<script setup>`, que exige ferramentas de construção. Se tencionamos usar a API de Composição sem uma etapa de construção, temos que consultar o uso da [opção `setup()`](/api/composition-api-setup).
:::

### Usando a Construção de Módulo de ECMAScript {#using-the-es-module-build}

Por toda a documentação, usaremos essencialmente a sintaxe de [módulos de ECMAScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). A maioria dos navegadores agora suportam os módulos de ECMAScript de maneira nativa, então podemos usar a Vue a partir duma rede de entrega de conteúdo através dos módulos de ECMScript desta maneira:

<div class="options-api">

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

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

Repara que usamos o `<script type="module">`, e que a URL da rede de entrega de conteúdo importada aponta para uma **construção de módulos de ECMAScript** da Vue.

<div class="options-api">

[Demonstração da Codepen](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[Demonstração da Codepen](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### Ativando os Mapas de Importação {#enabling-import-maps}

No exemplo acima, importamos a partir da URL completa da rede de entrega de conteúdo, mas no resto da documentação veremos o código desta maneira:

```js
import { createApp } from 'vue'
```

Nós podemos ensinar o navegador onde localizar a importação da `vue` usando os [Mapas de Importação](https://caniuse.com/import-maps):

<div class="options-api">

```html{1-7,12}
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

[Demonstração da Codepen](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Demonstração da Codepen](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

Nós também podemos adicionar entradas para outras dependências ao mapa de importação - porém temos que certificar-nos de que apontam às versões de módulos de ECMAScript da biblioteca que tencionamos usar.

:::tip SUPORTE DO NAVEGADOR DE MAPAS DE IMPORTAÇÃO
Os mapas de importação são uma funcionalidade do navegador relativamente nova. Temos que certificar-nos de usar um navegador dentro do seu [limite de suporte](https://caniuse.com/import-maps). Em especial, apenas é suportada no Safari 16.4+.
:::

:::warning NOTAS SOBRE O USO DE PRODUÇÃO
Os exemplos até qui usam a construção de desenvolvimento da Vue - se tencionamos usar a Vue a partir duma rede de entrega de conteúdo em produção, temos de certificar-nos de consultar o [Guia de Implementação de Produção](/guide/best-practices/production-deployment#without-build-tools).
:::

### Separando os Módulos {#splitting-up-the-modules}

Conforme mergulharmos mais fundo no guia, podemos precisar dividir o código em ficheiros de JavaScript separados para serem mais fáceis de gerir. Por exemplo:

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>count is {{ count }}</div>`
}
```

</div>

Se abrirmos o `index.html` acima diretamente no nosso navegador, descobriremos que lança um erro porque os módulos de ECMAScript não podem funcionar sobre o protocolo `file://`, que é o protocolo que o navegador usa quando abrimos um ficheiro local.

Por razões de segurança, os módulos de ECMAScript apenas podem funcionar sobre o protocolo `http://`, que é o que os navegadores usam quando abrimos as páginas na Web. Para os módulos de ECMAScript funcionarem na nossa máquina local, precisamos servir o `index.html` sobre o protocolo `http://`, com um servidor de HTTP local.

Para iniciar um servidor de HTTP local, temos de certificar-nos que temos a [Node.js](https://nodejs.org/en/) instalada, depois executamos `npx serve` a partir da linha de comando no mesmo diretório onde o nosso ficheiro de HTML está. Nós também podemos usar qualquer outro servidor de HTTP que pode servidor ficheiros estáticos com os tipos de tipo de ficheiro corretos.

Nós podemos ter reparado que o modelo de marcação do componente importado está em linha como uma sequência de caracteres de JavaScript. Se usamos o VSCode, podemos instalar a extensão [`es6-string-html`](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) e prefixar as sequências de caracteres com um comentário `/*html*/` para obtermos destacamento da sua sintaxe.

## Próximos Passos {#next-steps}

Se saltaste a [Introdução](/guide/introduction), recomendamos fortemente a leitura dela antes de avançarmos para o resto da documentação.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application">
    <p class="next-steps-link">Continuar o Guia</p>
    <p class="next-steps-caption">O guia acompanha-nos por todos os aspetos da abstração em completo detalhe.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Experimentar o Tutorial</p>
    <p class="next-steps-caption">Para aqueles que preferem aprender as coisas na prática.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Consultar os Exemplos Interativos</p>
    <p class="next-steps-caption">Explore os exemplos de funcionalidades principais e tarefas de interfaces de aplicações comuns.</p>
  </a>
</div>
