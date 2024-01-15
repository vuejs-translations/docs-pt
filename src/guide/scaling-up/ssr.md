---
outline: deep
---

# Interpretação no Lado do Servidor (SSR) {#server-side-rendering-ssr}

## Visão Geral {#overview}

### O que é SSR? {#what-is-ssr}

Vue.js é uma abstração para a construção de aplicações no lado do cliente. Por padrão, os componentes de Vue produzem e manipulam o DOM no navegador como resultado. No entanto, também é possível interpretar no servidor os mesmos componentes em strings HTML, enviá-los diretamente para o navegador, e finalmente "hidratar" a marcação estática para uma aplicação completamente interativa no cliente.

Uma aplicação Vue.js interpretada no servidor também pode ser considerada "isomórfica" ou "universal", no sentido que a maioria do código da aplicação executa no servidor **e** também no cliente.

### Por que SSR? {#why-ssr}

Comparado a uma Aplicação de Página Única (SPA, sigla em inglês) do lado do cliente, a vantagem de SSR primeiramente encontra-se em:

- **Carregamento mais rápido**: isto é mais proeminente em dispositivos lentos ou em conexões lentas. A marcação gerada pelo servidor não precisa de esperar até que todo o JavaScript seja carregado e executado para ser mostrada, assim o usuário verá uma página completamente gerada mais cedo. Além disto, a requisição de dados é feita no lado do servidor para a visita inicial, que provavelmente tem uma conexão mais rápida à base de dados do que o cliente. Isto geralmente resulta em melhores métricas [Core Web Vitals](https://web.dev/vitals/), melhor experiência de usuário, e pode ser crítico para aplicações onde o tempo de carregamento está diretamente associado com a taxa de conversão.

- **Modelo mental unificado**: pode-se usar a mesma linguagem e o mesmo modelo mental declarativo e orientado ao componente para o desenvolvimento de toda a aplicação, ao invés de ficar para lá e para cá entre um sistema de criação de modelos de marcação backend e uma abstração frontend.

- **SEO Melhor**: os rastreaedores dos motores de busca enxergarão a página completamente interpretada diretamente.

  :::tip DICA
  Neste momento, Google e Bing podem indexar aplicações de JavaScript síncronas muito bem. Onde a palavra-chave aqui é síncrono. Se a aplicação começar com um carregador, depois requisitar conteúdo através de AJAX, o rastreador não a esperará. Isto significa que se houver conteúdo requisitado de maneira assíncrona nas páginas onde SEO é importante, SSR pode ser necessário.
  :::

Também existem algumas contrapartidas a considerar ao usar SSR:

- Restrições no desenvolvimento. O código específico de navegador só pode ser usado dentro certos gatilhos do ciclo de vida; algumas bibliotecas externas podem precisar de tratamento especial para serem capazes de funcionar em uma aplicação interpretada no servidor.

- Mais configurações de construção e de requisitos de implantação. Ao contrário de uma SPA completamente estática que pode ser implantada em qualquer servidor de arquivo estático, uma aplicação interpretada no servidor exige um ambiente onde um servidor Node.js possa executar.

- Mais carga do lado do servidor. A interpretação de uma aplicação completa em Node.js será mais intensa para a CPU do que apenas servir arquivos estáticos, então caso se espere tráfego elevado, prepare-se para uma carga correspondente no servidor e empregue prudentemente estratégias de cache.

Antes de usar SSR em uma aplicação, a primeira pergunta que se deve fazer é se realmente se necessita dela. Isto depende na maior parte das vezes de quão o carregamento de conteúdo é importante é para a aplicação. Por exemplo, se em uma construção de um painel de controle interno onde algumas centenas de milissegundos adicionais no carregamento inicial não importam tanto, SSR seria exagero. Entretanto, em casos onde o carregamento é absolutamente crítico, SSR pode ajudar a alcançar o melhor desempenho de carregamento inicial possível.

### SSR x SSG {#ssr-vs-ssg}

**Geração de Site Estático (SSG, sigla em Inglês)**, também referenciado como pré-interpretação, é uma outra técnica popular para construir sites rápidos. Se os dados necessários para o servidor interpretar uma página são os mesmo para todos os usuários, então ao invés de interpretar a página cada vez que uma requisição chegar, podemos interpretá-la apenas uma vez, com antecedência, durante o processo de construção. Páginas pré-interpretadas são geradas e servidas como arquivos HTML estáticos.

SSG conserva as mesmas características de desempenho de aplicações SSR: fornece excelente desempenho de carregamento de conteúdo. Ao mesmo tempo, é mais barata e mais fácil de implantar do que aplicações de SSR pois a saída são HTML e recursos estáticos. A palavra-chave aqui é **estático**: SSG só pode ser aplicado as páginas que consomem dados estáticos, por exemplo, dados que são conhecidos no momento da construção e não mudam entre implantações. Toda vez que os dados mudarem, uma nova implantação é necessária.

Ao buscar SSR para melhorar SEO de algumas páginas de publicidade (por exemplo, `/`, `/about`, `/contact`, etc.), então provavelmente é melhor SSG no lugar de SSR. SSG também é ótima para sites baseados em conteúdo tais como páginas de documentação ou blogs. Na verdade, esta exata página atual é gerada estaticamente com o uso de [VitePress](https://vitepress.vuejs.org/), um gerador de site estático movido por Vue.js.

## Tutorial Básico {#basic-tutorial}

### Interpretando uma Aplicação {#rendering-an-app}

Vamos dar uma olhada no exemplo mais básico de SSR Vue.

1. Crie um novo diretório e entre nele com `cd`
2. Execute `npm init -y`
3. Adicione `"type": "module"` no `package.json` para que Node.js execute no [modo de módulos de ECMAScript](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
4. Execute `npm install vue`
5. Crie um arquivo `example.js`:

```js
// isto roda em Node.js no servidor.
import { createSSRApp } from 'vue'
// A API Vue de interpretação do servidor é exposta sob `vue/server-renderer`.
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

[`renderToString()`](/api/ssr.html#rendertostring) recebe uma instância de aplicação Vue e retorna uma Promise que resolve para HTML interpretada da aplicação. Também é possível interpretar em fluxo usando [API Stream Node.js](https://nodejs.org/api/stream.html) ou [API Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Consulte a [Referência da API de SSR](/api/ssr.html) para detalhes completos.

Podemos então mover o código Vue SSR para um manipulador de requisição do servidor, que envolve a marcação da aplicação com o HTML completo da página. Usaremos o [`express`](https://expressjs.com/) para as próximas etapas:

- Execute `npm install express`
- Cria o seguinte arquivo `server.js`:

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
        <title>Exemplo Vue SSR</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('pronto')
})
```

Finalmente, execute `node server.js` e visite `http://localhost:3000`. A página funcional deve ser mostrada com o botão.

[Experimente na StackBlitz](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### Hidratação do Cliente {#client-hydration}

Se clicarmos no botão, notamos que o número não muda. O HTML é completamente estático no cliente já que não estamos carregando Vue no navegador.

Para tornar a aplicação no lado do cliente interativa, Vue precisa realizar a etapa de **hidratação**. Durante a hidratação, ela cria a mesma aplicação de Vue que foi executada no servidor, combina cada componente aos nós DOM que ela deveria controlar, e conecta os ouvintes de evento DOM.

Para montar uma aplicação no modo de hidratação, precisamos usar [`createSSRApp()`](/api/application.html#createssrapp) ao invés de `createApp()`:

```js{2}
// isso executa no navegador.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...a mesma aplicação do servidor
})

// a montagem de uma aplicação de SSR no cliente presume
// que o HTML foi pré-interpretado e realizará
// a hidratação ao invés de montar novos nós DOM.
app.mount('#app')
```

### Estrutura do Código {#code-structure}

Percebe-se como precisamos reutilizar a mesma implementação da aplicação como é feita no servidor. Aqui é onde precisamos começar a pensar sobre como estruturar o código em uma aplicação SSR - como compartilhamos o mesmo código de aplicação entre o servidor e o cliente?

Aqui demonstraremos a configuração mais básica. Primeiro, dividiremos a lógica de criação da aplicação em um arquivo dedicado, `app.js`:

```js
// app.js (compartilhado entre o servidor e o cliente)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

Este arquivo e suas dependências são compartilhados entre o servidor e o cliente - nós o chamamos de **código universal**. Há uma porção de coisas em que precisamos prestar atenção quando escrevemos código universal, conforme [discutiremos abaixo](#writing-ssr-friendly-code).

A nossa entrada do cliente importa o código universal, cria a aplicação, e realiza a montagem:

```js
// client.js
import { createApp } from './app.js'

createApp().mount('#app')
```

E o servidor usa a mesma lógica de criação da aplicação no manipulador de requisição:

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

Além disso, para carregar os arquivos do cliente no navegador, também precisamos:

1. Servir os arquivos do cliente adicionando `server.use(express.static('.'))` no `server.js`.
2. Carregar a entrada do cliente adicionando `<script type="module" src="/client.js"></script>` à estrutura do HTML.
3. Suportar o uso de `import * from 'vue'` no navegador adicionando um [Mapa de Importação](https://github.com/WICG/import-maps) na estrutura do HTML.

[Experimento o exemplo completo na StackBlitz](https://stackblitz.com/fork/vue-ssr-example?file=index.js). O botão agora é interativo!

## Soluções de Alto Nível {#higher-level-solutions}

Indo do exemplo para uma aplicação SSR pronta para produção envolve muito mais. Precisaremos de:

- Suportar SFCs Vue e outros requisitos da etapa de construção. Na verdade, precisaremos coordenar duas construções para a mesma aplicação: uma para o cliente, e outra para o servidor.

  :::tip Dica
  Componentes Vue são compilados de maneira diferente quando usados para SSR - os modelos de marcação são compilados em concatenações string ao invés de funções de interpretação no DOM Virtual para um desempenho de interpretação mais eficiente.
  :::

- No manipulador de requisição do servidor, interpretar o HTML com as ligações de recurso corretas e sugestões de recurso ideais no lado do cliente. Podemos também precisar alternar entre SSR e SSG, ou até mesmo misturar ambos na mesma aplicação.

- Gerenciar o roteamento, requisição de dados, e as bases de gerenciamento de estado de uma maneira universal.

Uma implementação completa seria bastante complexa e depende do conjunto de ferramentas de construção que foram escolhidas para se trabalhar. Portanto, recomendamos fortemente proceder com uma solução de alto nível, opinativa, que abstrai a complexidade. Abaixo introduziremos algumas das soluções recomendadas no ecossistema Vue.

### Nuxt {#nuxt}

[Nuxt](https://v3.nuxtjs.org/) é uma abstração de alto nível construída sobre o ecossistema Vue que fornece uma experiência de desenvolvimento otimizada para escrever aplicações Vue universais. Ainda melhor, também se pode usá-la como um gerador de site estático! Recomendamos fortemente que você experimente.

### Quasar {#quasar}

[Quasar](https://quasar.dev) é uma solução completa baseada em Vue que permite escolher entre SPA, SSR, PWA, aplicativo móvel, aplicativo de computador, e extensão de navegador, tudo usando uma base de código. Ela não apenas trata da configuração de construção, mas também fornece uma coleção completa de componentes UI aderentes ao Material Design.

### Vite SSR {#vite-ssr}

Vite fornece [suporte para interpretação Vue no lado do servidor](https://vitejs.dev/guide/ssr.html) embutido, mas é intencionalmente de baixo nível. Se desejar seguir diretamente com Vite, consulte o [vite-plugin-ssr](https://vite-plugin-ssr.com/), uma extensão da comunidade que abstrai muitos detalhes desafiadores.

Também pode-se encontrar um exemplo de projeto Vue + Vite SSR usando configuração manual [aqui](https://github.com/vitejs/vite/tree/main/playground/ssr-vue), o qual pode servir como uma base para construir sobre. Nota que isto é apenas recomendado para experientes com SSR / ferramentas de construção e se realmente quiser ter controle completo sobre a arquitetura de alto nível.

## Escrevendo Código SSR Amigável {#writing-ssr-friendly-code}

Independentemente da escolha de configuração de construção ou abstração de alto nível, existem alguns princípios que se aplicam a todas aplicações SSR Vue.

### Reatividade no Servidor {#reactivity-on-the-server}

Durante a SSR, cada URL de requisição faz um mapa para um estado desejado da nossa aplicação. Não existe interação de usuário e nem atualizações no DOM, então a reatividade é desnecessária no servidor. Por padrão, a reatividade é desabilitada durante a SSR para melhor desempenho.

### Gatilhos do Ciclo de Vida do Componente {#component-lifecycle-hooks}

Como não existem atualizações dinâmicas, os gatilhos do ciclo de vida tais como <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> ou <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> **NÃO** serão chamados durante a SSR e serão executados apenas no cliente.<span class="options-api"> Os únicos gatilhos que são chamados durante a SSR são `beforeCreate` e `created`</span>.

Deve-se evitar código que produz efeitos colaterais que precisam de limpeza no <span class="options-api">`beforeCreate` e `created`</span><span class="composition-api">`setup()` ou no escopo raiz do `<script setup>`</span>. Um exemplo de tais efeitos colaterais é a definição de temporizadores com `setInterval`. Apenas no código do lado do cliente podemos definir um temporizador e então destruí-lo no <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> ou <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>. No entanto, como os gatilhos de desmontagem nunca serão chamados durante a SSR, os temporizadores ficarão ativos para sempre. Para evitar isto, mova o código de efeito colateral para <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

### Acesso à APIs Específicas de Plataforma {#access-to-platform-specific-apis}

O código universal não pode assumir o acesso às APIs específicas de plataforma, então se o código usa diretamente globais exclusivas do navegador como `window` ou `document`, eles lançarão erros ao serem executados em Node.js, e vice-versa.

Para tarefas que são compartilhadas entre o servidor e o cliente mas com diferentes APIs de plataforma, é recomendado envolver as implementações específicas de plataforma dentro de uma API universal, ou usar bibliotecas que fazem isto. Por exemplo, pode-se usar [`node-fetch`](https://github.com/node-fetch/node-fetch) para usar a mesma API de requisição tanto no servidor e no cliente.

Para APIs específicas de navegador, a abordagem comum é acessá-las ociosamente apenas dentro de gatilhos do ciclo de vida do cliente tais como <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Note que se uma biblioteca de terceiros não for escrita com uso universal em mente, pode ser difícil integrá-la em uma aplicação interpretada no servidor. Talvez _seja possível_ fazê-la funcionar ao simular alguns dos globais, mas pode ser ousado e pode interferir com o código de detecção de ambiente de outras bibliotecas.

### Poluição do Estado em Requisição Cruzada {#cross-request-state-pollution}

No capítulo de Gerencimamento de Estado, introduzimos um [padrão simples de gerenciamento de estado com uso das APIs de Reatividade](state-management#simple-state-management-with-reactivity-api). Em um contexto SSR, este padrão exige alguns ajustes adicionais.

O padrão declara o estado compartilhado em um escopo raiz de um módulo JavaScript. Isto torna-os **singletons** - por exemplo, existe apenas uma instância do objeto reativo ao longo de todo o ciclo de vida da nossa aplicação. Isso funciona como esperado em uma aplicação Vue pura do lado do cliente, já que os módulos em nossa aplicação são inicializados para cada visita de página no navegador.

No entanto, num contexto SSR, os módulos da aplicação são normalmente inicializados apenas uma vez no servidor, quando o servidor é ligado. As mesmas instâncias de módulo serão reutilizadas através de várias requisições de servidor, e então o mesmo acontecerá com os nossos objetos de estado singleton. Se alterarmos o estado singleton compartilhado com dados específicos de um usuário, isso pode vazar acidentalmente para uma requisição de outro usuário. Nós chamamos isso de **poluição do estado em requisição cruzada**.

Nós podemos tecnicamente reinicializar todos os módulos JavaScript em cada requisição, tal como fazemos nos navegadores. No entanto, a inicialização de módulos de JavaScript pode custar caro, então isto afetaria de maneira significativa o desempenho do servidor.

A solução recomendada é criar uma nova instância da aplicação inteira - incluindo o roteador e as memórias globais - em cada requisição. Depois, ao invés de importá-lo diretamente em nossos componentes, fornecemos o estado partilhado usando [fornecimento a nível de aplicação](/guide/components/provide-inject#app-level-provide) e injetando-o nos componentes que precisam dele:

```js
// app.js (compartilhado entre o servidor e cliente)
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

Bibliotecas de Gerenciamento de Estado como Pinia são projetadas com isto em mente. Consulte o [Guia SSR Pinia](https://pinia.vuejs.org/ssr/) para mais detalhes.

### Incompatibilidade na Hidratação {#hydration-mismatch}

Se a estrutura DOM do HTML pré-interpretado não corresponde a saída esperada da aplicação do lado do cliente, haverá um erro de incompatibilidade na hidratação. Incompatibilidade na hidratação é mais habitulamente introduzida pelas seguintes causas:

1. O modelo de marcação contém estrutura de aninhamento HTML inválida, e o HTML interpretado foi "corrigido" pelo interpretador de HTML nativo do navegador. Por exemplo, uma pegadinha comum é que [`<div>` não pode ser colocado dentro de `<p>`](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it):

   ```html
   <p><div>oi</div></p>
   ```

   Se produzirmos isto em nosso HTML interpretado pelo servidor, o navegador terminará o primeiro `<p>` quando o `<div>` for encontrado e o interpretará como a seguinte estrutura DOM:

   ```html
   <p></p>
   <div>oi</div>
   <p></p>
   ```

2. Os dados usados durante a interpretação contêm valores gerados aleatoriamente. Já que a mesma aplicação executará duas vezes - uma vez no servidor, e uma vez no cliente - não é garantido que os valores aleatórios sejam os mesmos entre as duas execuções. Há duas maneiras de evitar disparidades de valor-aleatório-induzido:

   1. Use `v-if` + `onMounted` para interpretar a parte que depende de valores aleatórios apenas no cliente. A abstração também pode ter funcionalidades embutidas para tornar isto mais fácil, por exemplo o componente `<ClientOnly>` em VitePress.

   2. Use uma biblioteca de gerador de número aleatório que suporta geração com sementes, e garante que a execução do servidor e a execução do cliente usarão a mesma semente (por exemplo, ao incluir a semente no estado serializado e obtê-la no cliente).

3. O servidor e o cliente estão em fusos horários diferentes. Algumas vezes, podemos querer converter um registro de data e hora para a data local do usuário. Entretanto, o fuso horário durante a execução do servidor e o fuso horário durante a execução do cliente não são sempre os mesmos, e não podemos saber com confiança o fuso horário do usuário durante a execução do servidor. Em tais casos, a conversão para hora local também deve ser realizada como uma operação no lado do cliente.

Quando Vue encontra uma incompatibilidade na hidratação, tentará se recuperar automaticamente e ajustar o DOM pré-interpretado para corresponder ao estado no lado do cliente. Isto conduzirá a alguma perda de desempenho de interpretação devido aos nós incorretos serem descartados e novos nós serem montados, mas na maioria dos casos, a aplicação deve continuar a funcionar como esperado. Dito isto, ainda é melhor eliminar as incompatibilidades na hidratação durante o desenvolvimento.

### Diretivas Personalizadas {#custom-directives}

Já que a maior parte das diretivas personalizadas envolvem manipulação direta do DOM, elas são ignoradas durante a SSR. No entanto, se é preciso especificar como uma diretiva personalizadas deve ser interpretada (por exemplo, quais atributos ela deve adicionar ao elemento interpretado), pode-se usar o gatilho de diretiva `getSSRProps`.

```js
const myDirective = {
  mounted(el, binding) {
    // implementação do lado do cliente:
    // atualiza diretamente o DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // implementação no lado do servidor:
    // retornar as propriedades a serem interpretadas
    // `getSSProps` apenas recebe o vinculo de diretiva.
    return {
      id: binding.value
    }
  }
}
```

### Teletransportes {#teleports}

Teletransportes exigem manipulação especial durante a SSR. Se a aplicação interpretada contém Teletransportes, o conteúdo teletransportado não será parta da string interpretada. Uma solução mais fácil é interpretar condicoinalmente o Teletransporte na montagem.

Se é preciso hidratar o conteúdo teletransportado, eles são expostos sob a propriedade `teleports` do objeto do contexto SSR:

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

Precisamos injetar a marcação do teletransporte na localização correta na página de HTML final semelhante a como precisamos injetar a marcação da aplicação principal.

:::tip DICA
Evite o `body` como alvo ao usar Teletransportes e SSR juntos - geralmente, `<body>` conterá outro conteúdo interpretado no lado do servidor que torna-o impossível para os Teletransportes determinarem a localização inicial correta para hidratação.

Em vez disto, prefira um contentor dedicado, por exemplo, `<div id="teleported"></div>` que contém apenas conteúdo teletransportado.
:::
