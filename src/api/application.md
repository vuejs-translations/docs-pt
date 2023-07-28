# API da Aplicação {#application-api}

## `createApp()` {#createapp}

Cria uma instância da aplicação.

- **Tipo**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Detalhes**

  O primeiro argumento é o componente raiz. O segundo argumento são propriedades opcionais a serem passadas ao componente raiz.

- **Exemplo**

  Com o componente raiz em linha:

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* opções do componente raiz */
  })
  ```

  Com o componente importado:

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **Consulte também:** [Guia - Criando uma Aplicação de Vue](/guide/essentials/application)

## `createSSRApp()` {#createssrapp}

Cria uma instância da aplicação no modo de [Hidratação SSR](/guide/scaling-up/ssr#client-hydration). A forma de uso é exatamente igual à `createApp()`.

## `app.mount()` {#app-mount}

Monta a instância da aplicação em um elemento contentor.

- **Tipo**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Detalhes**

  O argumento pode ser tanto o elemento real do DOM ou um seletor CSS (o primeiro elemento compatível será usado). Retorna a instância do componente raiz.

  Se o componente tem um modelo de marcação ou uma função de interpretação definida, ele substituirá qualquer nódulo do DOM existente dentro do contentor. Caso contrário, se o compilador de tempo de execução estiver disponível, a `innerHTML` do contentor será usado como modelo.

  No modo de hidratação de SSR, ele hidratará os nódulos DOM existentes dentro do contentor. Se houverem [disparidades](/guide/scaling-up/ssr#hydration-mismatch), os nódulos DOM existentes serão transformados para corresponder ao resultado esperado.

  O `mount()` poderá ser chamado apenas uma vez para cada instância da aplicação.

- **Exemplo**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  Também se pode montar em um elemento DOM real:

  ```js
  app.mount(document.body.firstChild)
  ```

## `app.unmount()` {#app-unmount}

Desmonta uma instância de aplicação montada, disparando os gatilhos do ciclo de vida para todos os componentes na árvore de componentes da aplicação.

- **Tipo**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## `app.component()` {#app-component}

Regista um componente global ao passar um nome como string e uma definição de componente, ou busca um componente já registado se apenas o nome é passado.

- **Tipo**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **Exemplo**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // regista um objeto com opções
  app.component('my-component', {
    /* ... */
  })

  // busca um componente registado
  const MyComponent = app.component('my-component')
  ```

- **Consulte também:** [Registo de Componente](/guide/components/registration)

## `app.directive()` {#app-directive}

Regista uma diretiva global personalizada se passar uma sequência de caracteres de nome e uma definição de diretiva, ou buscar uma já registada se apenas o nome for passado.

- **Tipo**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **Exemplo**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // registar (objeto da diretiva)
  app.directive('my-directive', {
    /* gatilhos personalizados da diretiva */
  })

  // registar (atalho da função diretiva)
  app.directive('my-directive', () => {
    /* ... */
  })

  // busca uma diretiva registada
  const myDirective = app.directive('my-directive')
  ```

- **Consulte também:** [Diretivas Personalizadas](/guide/reusability/custom-directives)

## `app.use()` {#app-use}

Instala uma [extensão](/guide/reusability/plugins).

- **Tipo**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Detalhes**

  Exige a extensão como primeiro argumento, e opcionalmente configurações da extensão como segundo argumento.

  A extensão pode tanto ser um objeto com um método `install()`, ou apenas uma função que será usada como o método `install()`. As opções (segundo argumento do `app.use()`) serão passadas através do método `install()` da extensão.

  Quando `app.use()` for chamado com a mesma extensão múltiplas vezes, a extensão será instalada apenas uma vez.

- **Exemplo**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **Consulte também:** [Extensões](/guide/reusability/plugins)

## `app.mixin()` {#app-mixin}

Aplica uma mistura global (isolada à aplicação). Uma mistura global aplica suas opções incluídas à toda instância de componente na aplicação.

:::warning Não Recomendado
Misturas são suportadas na Vue 3 principalmente para compatibilidade retroativa, devido ao seu uso difundido nas bibliotecas do ecossistema. O uso de misturas, especialmente misturas globais, deve ser evitado no código da aplicação.

Para reutilização de lógica, prefira as [Funções de Composição](/guide/reusability/composables).
:::

- **Tipo**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## `app.provide()` {#app-provide}

Fornece um valor que pode ser injetado em todos os componentes descendentes dentro da aplicação.

- **Tipo**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **Detalhes**

  Exige a chave de injeção como primeiro argumento, e o valor fornecido como o segundo. Retorna a própria instância da aplicação.

- **Exemplo**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'olá')
  ```

  Dentro de um componente na aplicação:

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'olá'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'olá'
    }
  }
  ```

  </div>

- **Consulte também:**
  - [Fornecer / Injetar](/guide/components/provide-inject)
  - [Fornecimento a Nível de Aplicação](/guide/components/provide-inject#app-level-provide)
  - [`app.runWithContext()`](#app-runwithcontext)

## `app.runWithContext()`<sup class="vt-badge" data-text="3.3+" /> {#app-runwithcontext}

Executa uma função de resposta com a aplicação atual como contexto de injeção.

- **Tipo**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **Detalhes**
  
  Espera uma função de resposta e executa a função de resposta imediatamente. Durante a chamada síncrona da função de resposta, as chamadas de `inject()` são capazes de procurar as injeções a partir dos valores fornecidos pela aplicação atual, mesmo quando não existir nenhuma instância de componente ativa atualmente. O valor de retorno da função de resposta também será retornado.

- **Exemplo**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## `app.version` {#app-version}

Fornece a versão da Vue com que a aplicação foi criada. Isto é útil dentro de [extensões](/guide/reusability/plugins), onde podemos precisar de lógica condicional baseada em diferentes versões da Vue.

- **Tipo**

  ```ts
  interface App {
    version: string
  }
  ```

- **Exemplo**

  Realizando uma verificação da versão dentro de uma extensão:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('Esta extensão exige a Vue 3')
      }
    }
  }
  ```

- **Consulte também:** [API Global - versão](/api/general#version)

## `app.config` {#app-config}

Toda instância da aplicação expõe um objeto `config` que contém as definições de configuração para aquela aplicação. Nós podemos modificar estas propriedades (documentadas abaixo) antes de montar a nossa aplicação.

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## `app.config.errorHandler` {#app-config-errorhandler}

Atribui um manipulador global para erros não capturados que se propagam a partir de dentro da aplicação.

- **Tipo**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` é uma informação de erro específica da Vue,
      // e.g. em qual gatilho do ciclo de vida o erro foi lançado
      info: string
    ) => void
  }
  ```

- **Detalhes**

  O manipulador do erro recebe três argumentos: o erro, a instância do componente que disparou o erro, e uma sequência de caracteres de informação especificando o tipo da fonte do erro.

  Ele pode capturar erros das seguintes fontes:

  - Interpretação de componente
  - Manipuladores de evento
  - Gatilhos de Ciclo de Vida
  - Função `setup()`
  - Observadores
  - Gatilhos personalizados de diretiva
  - Gatilhos de transição

- **Exemplo**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // manipular o erro, por exemplo, informar para um serviço
  }
  ```

## `app.config.warnHandler` {#app-config-warnhandler}

Atribui um manipulador personalizado para avisos de tempo de execução da Vue.

- **Tipo**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **Detalhes**

  O manipulador de avisos recebe uma mensagem de aviso como primeiro argumento, a instância do componente fonte como segundo argumento, e uma string de rastro de componentes como terceiro.

  Pode ser usado para filtrar avisos específicos a fim de reduzir a verbosidade no _console_. Todos os avisos da Vue devem ser abordados durante o desenvolvimento, então isto é recomendado apenas durante sessões de depuração para focar em avisos específicos entre muitos, e deve ser removido uma vez que a depuração tenha sido finalizada.

  :::tip DICA
  Avisos funcionam apenas durante o desenvolvimento, então esta configuração é ignorada no modo de produção.
  :::

- **Exemplo**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` é o rastro da hierarquia de componentes
  }
  ```

## `app.config.performance` {#app-config-performance}

Defina isto para `true` para ativar o rastreio do desempenho do remendo, desenho, compilação e inicialização do componente no painel de desempenho ou linha do tempo da ferramenta de programação do navegador. Funciona apenas no modo de desenvolvimento e em navegadores que suportam a API [`performance.mark`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

- **Tipo**: `boolean`

- **Consulte também**: [Guia - Desempenho](/guide/best-practices/performance)

## `app.config.compilerOptions` {#app-config-compileroptions}

Configura opções do compilador de tempo de execução. Os valores definidos neste objeto serão passados para o compilador de modelos de marcação no navegador e afetarão todo componente na aplicação configurada. Observe que podemos sobrepor estas opções com base num componente usando a [opção `compilerOptions`](/api/options-rendering#compileroptions).

:::warning IMPORTANTE
Esta opção da configuração é respeitada apenas quando usasse a construção completa (por exemplo, o `vue.js` autónomo que pode compilar modelos de marcação no navegador). Se estivermos usando uma construção que executa apenas no tempo de execução com uma configuração de construção, as opções do compilador devem ser passadas para o `@vue/compiler-dom` através das configurações da ferramenta de construção.

- Para `vue-loader`: [passamos através da opção do carregador `compilerOptions`](https://vue-loader.vuejs.org/options#compileroptions). Consulte também [como configurá-lo na `vue-cli`](https://cli.vuejs.org/guide/webpack#modifying-options-of-a-loader).

- Para `vite`: [passamos através das opções `@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  :::

### `app.config.compilerOptions.isCustomElement` {#app-config-compileroptions-iscustomelement}

Especifica um método de verificação para reconhecer elementos personalizados nativos.

- **Tipo:** `(tag: string) => boolean`

- **Detalhes**

  Deve retornar `true` se o marcador deve ser tratado como elemento personalizado nativo. Para um marcador correspondente, a Vue interpretará como um elemento nativo ao invés de tentar resolvê-lo como um componente de Vue.

  Os marcadores de HTML e SVG nativos não precisam ser correspondidos nesta função - o analisador da Vue reconhece-os automaticamente.

- **Exemplo**

  ```js
  // tratar todos marcadores começando com
  // 'ion-' como elementos personalizados
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **Consulte também**: [Vue e os Componentes da Web](/guide/extras/web-components.html)

### `app.config.compilerOptions.whitespace` {#app-config-compileroptions-whitespace}

Ajusta o tratamento de espaço em branco do modelo de marcação.

- **Tipo:** `'condense' | 'preserve'`

- **Padrão:** `'condense'`

- **Detalhes**

  A Vue remove ou condensa os caracteres de espaço em branco nos modelos de marcação para produzir uma saída compilada mais eficiente. A estratégia padrão é "condensar", com o seguinte comportamento:

  1. Caracteres de espaço em branco iniciais ou finais dentro de um elemento são condensados em um único espaço.
  2. Caracteres de espaço em branco entre elementos que contêm novas linhas são removidos.
  3. Caracteres de espaço em branco consecutivos em nódulos de texto são condensados em um único espaço.

  A definição desta opção para `'preserve'` desativará os itens (2) e (3) acima.

- **Exemplo**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### `app.config.compilerOptions.delimiters` {#app-config-compileroptions-delimiters}

Ajusta os delimitadores usados para a interpolação de texto dentro do modelo de marcação.

- **Tipo:** `[string, string]`

- **Padrão:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Detalhes**

  Isto é normalmente usado para evitar conflitos com abstrações do lado do servidor que também podem usar a sintaxe de bigodes ou chavetas.

- **Exemplo**

  ```js
  // Delimitadores modificados para o 
  // estilo de sequência de caracteres de modelo da ES6
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### `app.config.compilerOptions.comments` {#app-config-compileroptions-comments}

Ajusta o tratamento de comentários HTML nos modelos de marcação.

- **Tipo:** `boolean`

- **Padrão:** `false`

- **Detalhes**

  Por padrão, a Vue removerá todos os comentários em produção. A definição desta opção para `true` forçará a Vue a preservar os comentários até em produção. Os comentários são sempre preservados durante o desenvolvimento. Esta opção é normalmente usada para quando a Vue for usada com outras bibliotecas que dependem de comentários de HTML.

- **Exemplo**

  ```js
  app.config.compilerOptions.comments = true
  ```

## `app.config.globalProperties` {#app-config-globalproperties}

Um objeto pode ser usado para registar propriedades globais que podem ser acessadas em qualquer instância de componente dentro da aplicação.

- **Tipo**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Detalhes**

  Isto é uma substituição da `Vue.prototype` da Vue 2, que não está mais presente na Vue 3. Como qualquer outra coisa global, isto deve ser usado com moderação.

  Se uma propriedade global entrar em conflito com uma propriedade de um componente, a propriedade do componente terá maior prioridade.

- **Uso**

  ```js
  app.config.globalProperties.msg = 'olá'
  ```

  Isto torna `msg` disponível dentro de qualquer modelo de marcação do componente na aplicação, e também no `this` de qualquer instância de componente:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'olá'
    }
  }
  ```

- **Consulte também** [Guia - Aumentando as Propriedades Globais](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## `app.config.optionMergeStrategies` {#app-config-optionmergestrategies}

Um objeto para definir estratégias de fusão para opções de componente personalizadas.

- **Tipo**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Detalhes**

  Algumas extensões ou bibliotecas adicionam suporte para opções de componente personalizas (injetando misturas globais). Essas opções podem exigir uma lógica de fusão especial quando a mesma opção precisa ser "mesclada" de múltiplas fontes (por exemplo, misturas ou herança de componente).

  Uma função de estratégia de fusão pode ser registada por uma opção personalizada ao atribuí-la ao objeto `app.config.optionMergeStrategies` usando o nome da opção como chave.

  A estratégia de fusão recebe o valor da opção definida nas instâncias pai e filho como primeiro e segundo argumentos, respetivamente.

- **Exemplo**

  ```js
  const app = createApp({
    // opção própria
    msg: 'Vue',
    // opção de uma mistura
    mixins: [
      {
        msg: 'Olá '
      }
    ],
    mounted() {
      // opções combinadas expostas na this.$options
      console.log(this.$options.msg)
    }
  })

  // definir uma estratégia de fusão personalizada para `msg`
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // mostra 'Olá Vue'
  ```

- **Consulte também**: [Instância do Componente - `$options`](/api/component-instance#options)
