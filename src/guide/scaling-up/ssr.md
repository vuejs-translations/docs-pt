---
outline: deep
---

# Interpretação no Lado do Servidor (SSR) {#server-side-rendering-ssr}

## Visão de Conjunto {#overview}

### O que é a SSR? {#what-is-ssr}

A Vue.js é uma abstração para construção de aplicações no lado do cliente. Por padrão, os componentes de Vue produzem e manipulam o DOM no navegador como saída. No entanto, também é possível interpretar os mesmos componentes para sequências de caracteres de HTML no servidor, enviá-los diretamente para o navegador, e finalmente "hidratar" a marcação estática para uma aplicação completamente interativa no cliente.

Uma aplicação de Vue.js interpretada no servidor também pode ser considerada "isomorfa" ou "universal", no sentido que a maioria do código da tua aplicação executa tanto no servidor **e** no cliente.

### Porquê SSR {#why-ssr}

Comparado a uma Aplicação de Página Única (SPA, sigla em Inglês) do lado do cliente, a vantagem da SSR primeiramente repousa na:

- **Tempo-para-conteúdo mais rápida**: isto é mais proeminente em internet lenta ou dispositivos lentos. A marcação gerada pelo servidor não precisa de esperar até todo JavaScript ter sido descarregado e executado para ser exibido, assim o teu utilizador verá uma página completamente gerada mais cedo. Além disto, a requisição de dados é feita no lado do servidor para a visita inicial, que provavelmente tem uma conexão mais rápida à tua base de dados do que o cliente. Isto geralmente resulta em métricas [Vitais da Web Fundamental](https://web.dev/vitals/) melhorada, melhor experiência de utilizador, e pode ser crítico para aplicações onde o tempo para o conteúdo está diretamente associado com a taxa de conversão.

- **Modelo mental unificado**: podes usar a mesma linguagem e o mesmo modelo mental orientado a componente declarativo para o desenvolvimento da tua aplicação inteira, ao invés de saltar para trás e para frente entre um sistema de criação de modelos de marcação de backend e uma abstração de frontend.

- **SEO Melhor**: os robôs do motor de pesquisa verá diretamente a página completamente interpretada.

  :::tip DICA
  A partir de agora, o Google e o Bing podem indexar aplicações de JavaScript síncronas muito bem. Síncrono sendo a palavra-chave lá. Se a tua aplicação começar com um rodopiador (spinner) de carregamento, depois pedir o conteúdo através de AJAX, o robô rastreador não esperará por ti para terminar. Isto significa que se tiveres conteúdo requisitado assincronamente nas páginas onde a SEO é importante, a SSR poderá ser necessária.
  :::

Também existem algumas contrapartidas a considerar quando usamos SSR:

- Restrições de desenvolvimento. O código específico de Navegador só pode ser usado dentro certos gatilhos do ciclo de vida; algumas bibliotecas externas podem precisar de tratamento especial para serem capazes de executar em uma aplicação interpretada no servidor.

- Configuração de construção mais envolvida e requisitos de desdobramento. Ao contrário de uma Aplicação de Página Única completamente estática que pode ser desdobrada em qualquer servidor de ficheiro estático, uma aplicação interpretada no servidor exige um ambiente onde um servidor Node.js possa ser executado.

- Mais carregamento do lado do servidor. A interpretação de uma aplicação completa na Node.js será mais intensa a nível de trabalho da CPU do que apenas servir ficheiros estáticos, se esperas tráfego elevado, esteja preparado para o carregamento do servidor correspondente e empregar prudentemente estratégias que te permitirão guardar informações para consulta imediata (cache).

Antes de usar a SSR na tua aplicação, a primeira questão que deverias fazer é se realmente precisas dela. Isto depende na maior parte das vezes de quão importante o tempo-para-o-conteúdo (time-to-content, em Inglês) é para tua aplicação. Por exemplo, se estiveres a construir um painel de controlo interno onde algumas centenas de milissegundos adicionais no carregamento inicial não importam tanto, a SSR pode ajudar-te a alcançar o melhor desempenho de carregamento inicial possível.

### SSR vs. SSG {#ssr-vs-ssg}

A **Geração de Sítio Estática (SSG, sigla em Inglês)**, também referenciado como pré-interpretação, é uma outra técnica popular para a construção páginas rápidas. Se os dados necessários para o servidor interpretar uma página for o mesmo para todos os utilizadores, então ao invés de interpretar a página toda vez que uma requisição chegar, podemos interpretá-la apenas uma vez, antes da hora marcada, durante o processo de construção. Páginas pré-interpretadas são geradas e servidas como ficheiros de HTML estáticos.

A SSG conserva as mesmas características de desempenho das aplicações de SSR: ela fornece excelente desempenho de tempo-para-o-conteúdo. Ao mesmo tempo, é mais barata e mais fácil de desdobrar do que aplicações de SSR porque a saída é HTML e recursos estáticos. A palavra-chave aqui é **estático**: a SSR só pode ser aplicada as páginas consumindo dados estáticos, por exemplo, dados que é conhecido no momento da construção e não muda entre os desdobramentos. Toda vez que dos dados mudarem, um novo desdobramento é necessário.

Se estiveres apenas a investigar a SSR para melhorar a SEO de uma meia dúzia de páginas de publicidade (marketing, em Inglês) (por exemplo, `/`, `/about`, `/contact`, etc.), então provavelmente desejas a SSG no lugar da SSR. A SSG também é excelente páginas baseadas em conteúdo tais como páginas de documentação ou artigos. De fato, esta página que estás a ler agora mesmo é gerada estaticamente com o uso da [VitePress](https://vitepress.vuejs.org/), um gerador de página estática alimentada pela Vue.js.

## Aula Básica {#basic-tutorial}

### Interpretando uma Aplicação {#rendering-an-app}

Vamos dar uma vista de olhos no exemplo mais básico da SSR de Vue em ação.

1. Crie um novo diretório e entre nele com `cd`
2. Execute `npm init -y`
3. Adicione `"type": "module"` no `package.json` para que a Node.js execute no [modo de módulos de ECMAScript](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
4. Execute `npm install vue`
5. Crie um ficheiro `example.js`:

```js
// isto executa a Node.js no servidor.
import { createSSRApp } from 'vue'
// A API de interpretação do servidor de Vue é exposta sob `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

Depois execute:

```sh
> node example.js
```

Isto deve imprimir o seguinte na linha de comando:

```
<button>1</button>
```

A [`renderToString()`](/api/ssr.html#rendertostring) recebe uma instância de aplicação de Vue e retorna uma Promessa que resolve para a HTML interpretada da aplicação. Também é possível agrupar a interpretação com o uso da [API de Stream de Node.js](https://nodejs.org/api/stream.html) or [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). ou [API de Streams da Web](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Consulte a [Referência da API da SSR](/api/ssr.html) por detalhes completos.

Nós podemos então mover o código da SSR de Vue para um manipulador de requisição do servidor, que envolve a marcação da aplicação com o HTML completo da página. Nós estaremos usar o [`express`](https://expressjs.com/) para as próximas etapas:

- Execute o comando `npm install express`
- Cria o seguinte ficheiro `server.js`:

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

Finalmente, execute `node server.js` e visitar `http://localhost:3000`. Tu deves ver a página a funcionar com o botão.

[Experimente-o na StackBlitz](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### Hidratação do Cliente {#client-hydration}

Se clicares no botão, notarás que o número não muda. O HTML é completamente estático no cliente já que não estamos a carregar a Vue no Navegador.

Para tornar a aplicação do lado do cliente interativa, a Vue precisa realizar a etapa de **hidratação**. Durante a hidratação, ela cria a mesma aplicação de Vue que foi executada no servidor, iguala cada componente aos nós de DOM que ela deveria controlar, e atribui os ouvintes de evento de DOM.

Para montar uma aplicação no modo de hidratação, precisamos usar [`createSSRApp()`](/api/application.html#createssrapp) no lugar da `createApp()`:

```js{2}
// isto executa no Navegador.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...a mesma aplicação no servidor
})

// a montagem de uma aplicação de SSR no cliente presume
// que o HTML foi pré-interpretado e realizará
// a hidratação no lugar de montar novos nós de DOM.
app.mount('#app')
```

### Estrutura do Código {#code-structure}

Repara o quão precisamos reutilizar a mesma implementação da aplicação conforme no servidor. Isto é onde precisamos começar a pensar sobre a estrutura do código em uma aplicação de SSR - como é que partilhamos o mesmo código de aplicação entre o servidor e o cliente?

Aqui demonstraremos a configuração mais básica. Primeiro, vamos dividir a lógica de criação da aplicação em um ficheiro dedicado, `app.js`:

```js
// app.js (partilhado entre o servidor e o cliente)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

Este ficheiro e suas dependências são partilhados entre o servidor e o cliente - nós os chamamos de **código universal**. Existe um número de coisas em que precisamos prestar atenção quando escrevemos código universal, conforme [discutiremos abaixo](#writing-ssr-friendly-code).

A nossa entrada do cliente importa o código universal, cria a aplicação, e realiza a montagem:

```js
// client.js
import { createApp } from './app.js'

createApp().mount('#app')
```

E o servidor usa a mesma lógica de criação de aplicação no manipulador de requisição:

```js{2,5}
// server.js (código irrelevante omitido)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

Além disto, para carregar os ficheiros do cliente no Navegador, também precisamos:

1. Servir os ficheiros do cliente adicionando `server.use(express.static('.'))` no `server.js`.
2. Carregar a entrada do cliente adicionando o `<script type="module" src="/client.js"></script>` à estrutura do HTML.
3. Suportar o uso de `import * from 'vue'` no Navegador adicionando um [Mapa de Importação](https://github.com/WICG/import-maps) à estrutura do HTML.

[Experimento o exemplo completo na StackBlitz](https://stackblitz.com/fork/vue-ssr-example?file=index.js). O botão agora é interativo!

## Soluções de Mais Alto Nível {#higher-level-solutions}

Movendo do exemplo para uma aplicação de SSR pronta para produção envolve muito mais. Nós precisaremos de:

- Suportar os SFCs de Vue e outros requisitos da etapa de construção. De fato, precisaremos de coordenar duas construções para a mesma aplicação: uma para o cliente, e outra para o servidor.

  :::tip Dica
  Os componentes de Vue são compilados de maneira diferente quando usados para SSR - os modelos de marcação são compilados para concatenações de sequência de caracteres no lugar de funções de interpretação do DOM Virtual para desempenho de interpretação mais eficiente.
  :::

- No manipulador de requisição do servidor, interpretar o HTML com as ligações de recurso corretas no lado do cliente e dicas de recurso ideias. Nós também podemos alternar entre o modo de SSR e SSG, ou até mesmo misturar ambos na mesma aplicação.

- Gerir o roteamento, requisição de dados, as memórias da gestão de estado de uma maneira universal.

Um implementação completa seria razoavelmente complexa e depende da corrente de ferramenta de construção que escolheste trabalhar. Portanto, recomendamos fortemente avançar com uma solução de mais alto nível, opiniosa que abstrai a complexidade por ti. Abaixo introduziremos algumas das soluções recomendadas no ecossistema de Vue.

### Nuxt {#nuxt}

[Nuxt](https://v3.nuxtjs.org/) é uma abstração de mais alto nível construída sobre o ecossistema da Vue que fornece uma experiência de programação otimizada para escrita de aplicações de Vue universais. Melhor ainda, também podes usá-la como um gerador de sítio estático! Nós recomendamos fortemente a experimentar.

### Quasar {#quasar}

[Quasar](https://quasar.dev) é uma solução baseada em Vue completa que permite-te escolher como alvo SPA, SSR, PWA, aplicação Móvel, aplicação de Secretária, extensão de Navegador, tudo usando uma base de código. Ele não apenas trata da configuração de construção, mas também fornece uma coleção completa de componentes de UI compatíveis com o Desenho Materialista (ou Material Design, em Inglês).

### SSR da Vite {#vite-ssr}

A Vite fornece [suporte embutido para interpretação no lado do servidor de Vue](https://vitejs.dev/guide/ssr.html), mas é intencionalmente de baixo nível. Se desejas partir diretamente com Vite, consulte o [vite-plugin-ssr](https://vite-plugin-ssr.com/), uma extensão da comunidade que abstrai muitos detalhes desafiantes por ti.

Tu também podes encontrar um projeto exemplo de Vue + Vite SSR usando a configuração manual [aqui](https://github.com/vitejs/vite/tree/main/playground/ssr-vue), o qual pode servir como uma base sobre a qual construir. Nota que isto é apenas recomendado se fores experiente com SSR / ferramentas de construção e de fato quiseres ter controlo completo sobre a arquitetura de mais alto nível.

## Escrevendo Código Amigável a SSR {#writing-ssr-friendly-code}

Independente da tua escolha da configuração de construção ou abstração de mais alto nível, existem alguns princípios que se aplicam a todas aplicações de SSR de Vue.

### Reatividade no Servidor {#reactivity-on-the-server}

Durante a SSR, cada URL de requisição faz um mapa para um estado desejado da nossa aplicação. Não existe interação de utilizador e nem atualizações de DOM, então a reatividade é desnecessária no servidor. Por padrão, a reatividade está desativada durante a SSR para melhor desempenho.

### Gatilhos do Ciclo de Vida do Componente {#component-lifecycle-hooks}

Já que não existem atualizações dinâmicas, os gatilhos do ciclo de vida tais como <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> or <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> **não** serão chamados durante a SSR e apenas serão executados no cliente.<span class="options-api"> Os únicos gatilhos que são chamados durante a SSR são `beforeCreate` e `created`</span>.

Tu deves evitar código que produz efeitos colaterais que precisam de limpeza no <span class="options-api">`beforeCreate` e `created`</span><span class="composition-api">`setup()` ou escopo de raiz do `<script setup>`</span>. Um exemplo de efeitos colaterais é a definição de temporizadores com `setInterval`. Apenas no código do lado do cliente podemos definir um temporizador e então deitado abaixo no <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> ou <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>. No entanto, porque os gatilhos desmontados nunca serão chamados durante a SSR, os temporizadores ficará por perto para sempre. Para evitar isto, mova de preferência o teu código de efeito colateral para <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

### Acesso à APIs Específicas de Plataforma {#access-to-platform-specific-apis}

O código universal não pode assumir o acesso às APIs específicas de plataforma, então se o teu código usa diretamente globais apenas do Navegador como `window` ou `document`, eles lançarão erros quando executados na Node.js, e vice versa.

Para tarefas que são partilhadas entre o servidor e o cliente mas com diferentes APIs de plataforma, é recomendado envolver as implementações específicas de plataforma dentro de uma API universal, ou usar bibliotecas que fazem isto por ti. Por exemplo, podes usar [`node-fetch`](https://github.com/node-fetch/node-fetch) para usar a mesma API de requisição tanto no servidor e cliente.

Para APIs específicas de Navegador, a abordagem comum é acessá-los preguiçosamente apenas dentro de gatilhos do ciclo de vida do cliente tais como <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Nota que se uma biblioteca de terceiro não for escrita com uso universal em mente, poderia ser difícil integrá-la com uma aplicação interpretada no servidor. Tu _podes_ ser capaz tê-la a funcionar pela imitação de alguns dos globais, mas isto seria deselegante e poderia interferir com o código de deteção de ambiente de outras bibliotecas.

### Poluição do Estado de Requisição Cruzada {#cross-request-state-pollution}

No capítulo de Gestão de Estado, introduzimos um [padrão simples de gestão de estado com uso das APIs de Reatividade](state-management#simple-state-management-with-reactivity-api). Num contexto de SSR, este padrão exige alguns ajustes adicionais.

O padrão declara o estado partilhado em um escopo de raiz do módulo de JavaScript. Isto torna-os **monotónicos (singletons, em Inglês)** - por exemplo existe apenas uma instância do objeto reativo ao longo do ciclo de vida inteiro da nossa aplicação. Isto funciona como esperado em uma aplicação de Vue do lado do cliente pura, já que os módulos na nossa aplicação inicializados fresca para cada visita de página do Navegador.

No entanto, num contexto de SSR, os módulos da aplicação são normalmente inicializados apenas uma vez no servidor, quando o servidor inicializa. As mesmas instâncias do módulo serão reutilizadas através de várias requisições do servidor, e então o mesmo acontecerá com os nossos objetos de estado monotónico (singleton, em Inglês). Se alterarmos o estado monotónico (singleton, em Inglês) partilhado com dados específicos a um utilizador, pode ser acidentalmente vazado para uma requisição de um outro utilizador. Nós chamamos isto de **poluição do estado da requisição cruzada**.

Nós podemos tecnicamente reinicializar todos os módulos de JavaScript em cada requisição, tal como fazemos nos navegadores. No entanto, a inicialização de módulos de JavaScript pode ser dispendiosa, assim isto afetaria de maneira significativa o desempenho do servidor.

A solução recomendada é criar uma nova instância da aplicação inteira - incluindo o roteador e as memórias globais - em cada requisição. Depois, no lugar de importá-lo diretamente nos nossos componentes, fornecemos o estado partilhado com o uso [fornecimento de aplicação de alto nível](/guide/components/provide-inject#app-level-provide) e injetá-lo nos componentes que precisam dele:

```js
// app.js (partilhado entre o servidor e cliente)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// chamada em cada requisição
export function createApp() {
  const app = createSSRApp(/* ... */)
  // cria nova instância da memória por requisição
  const store = createStore(/* ... */)
  // fornece a memória no nível da aplicação
  app.provide('store', store)
  // também expõe a memória para fins de hidratação
  return { app, store }
}
```

Bibliotecas de Gestão de Estado como a Pinia são desenhadas com isto em mente. COnsulte o [Guia de SSR da Pinia](https://pinia.vuejs.org/ssr/) por mais detalhes.

### Disparidade da Hidratação {#hydration-mismatch}

Se a estrutura da DOM do HTML pré-interpretado não responde a saída esperada da aplicação do lado do cliente, haverá um erro de disparidade da hidratação. Disparidade da hidratação é muito comummente introduzida pelas seguintes causas:

1. O modelo de marcação contém estrutura de encaixamento de HTML inválida, e o HTML interpretado foi "corrigido" pelo comportamento de analise de HTML nativo do navegador. Por exemplo, uma pegada comum é que [`<div>` não pode ser colocado dentro de `<p>`](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it):

   ```html
   <p><div>hi</div></p>
   ```

   Se produzirmos isto em nosso HTML interpretado pelo servidor, o navegador terminará o primeiro `<p>` quando o `<div>` for encontrado e o analisará sintaticamente para a seguinte estrutura de DOM:

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. Os dados usados durante a interpretação contém valores gerados aleatoriamente. Já que a mesma aplicação executará duas vezes - uma vez no servidor, e uma vez no cliente - os valores aleatórios não são garantidos que sejam os mesmos entre as duas execuções. Há duas maneiras de evitar disparidades de valor-aleatório-induzido:

   1. Use a `v-if` + `onMounted` para interpretar a parte que depende dos valores aleatórios apenas no cliente. A tua abstração também pode ter funcionalidades embutidas para tornar isto mais fácil, por exemplo o componente `<ClientOnly>` na VitePress.

   2. Use uma biblioteca de gerador de número aleatório que suporta a geração com sementes, e garante que a execução do servidor e a execução do cliente estão a usar a mesma semente (seed, em Inglês) (por exemplo, incluindo a semente no estado adaptado e recuperá-lo no cliente).

3. O servidor e o cliente estão em fusos horários diferentes. Algumas vezes, podemos desejar converter uma data na data local do utilizador. No entanto o fuso horário durante a execução do servidor e o fuso horário durante a execução do cliente não são sempre o mesmo, não podemos com confiança saber o fuso horário do utilizador durante a execução do servidor. Em tais casos, a conversão de  hora local também deve ser realizada como operação do lado do cliente.

Quando a Vue encontra uma disparidade de hidratação, tentará recuperar automaticamente e ajustar o DOM pré-interpretado para corresponder o estado do lado do cliente. Isto conduzirá a alguma perda desempenho de interpretação devido dos nós incorretos serem descartados e novos nós serem montados, mas a maior parte dos casos, a aplicação deve continuar a funcionar como esperado. Isto dito, ainda é melhor eliminar as disparidades de hidratação durante o desenvolvimento.

### Diretivas Personalizadas {#custom-directives}

Já que a maior parte das diretivas personalizadas envolvem manipulação direta do DOM, são ignoradas durante a SSR. No entanto, se quiseres especificar como uma diretiva personalizadas deve ser interpretada (por exemplo, quais atributos deve adicionar para o elemento interpretado), podes usar o gatilho de diretiva `getSSRProps`.

```js
const myDirective = {
  mounted(el, binding) {
    // implementação do lado do cliente:
    // atualizar diretamente o DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // implementação no lado do servidor:
    // retornar as propriedades para serem interpretadas
    // `getSSProps` apenas recebe o vinculo de diretiva.
    return {
      id: binding.value
    }
  }
}
```

### Teletransportações {#teleports}

As teletransportações exigem manipulação especial durante a SSR. Se a aplicação interpretada conter Teletransportações, o conteúdo teletransportado não será parta da sequência de caracteres interpretada. Uma solução mais fácil é condicional interpretar o Teletransporte na montagem.

Se precisares de hidratar o conteúdo teletransportado, são expostos sob a propriedade `teleports` do objeto do contexto da SSR:

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

Tu podes injetar a marcação do teletransporte na localização correta na tua página de HTML final semelhante a como precisamos injetar a marcação da aplicação principal.

:::tip DICA
Evite ter o `body` como alvo quando estiveres a usar as Teletransportações e a SSR juntos - normalmente, `<body>` conterá outro conteúdo interpretado no lado do cliente o que torna-o impossível para as Teletransportações determinar a localização inicial correta para hidratação.

No lugar disto, prefira um contentor dedicado, por exemplo,  `<div id="teleported"></div>` que contém apenas conteúdo teletransportado.
:::
