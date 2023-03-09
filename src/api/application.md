# API da Aplicação {#application-api}

## createApp() {#createapp}

Cria uma instância da aplicacão.

- **Tipo**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Detalhes**

  O primeiro argumento é o componente raiz. O segundo argumento opcional são propriedades a ser passadas para o componente raiz.

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

- **Veja também:** [Guia - Criando uma Aplicação Vue](/guide/essentials/application.html)

## createSSRApp() {#createssrapp}

Cria uma instância da aplicação no modo [Hidratação SSR](/guide/scaling-up/ssr.html#client-hydration). A forma de uso é exatamente igual à `createApp()`.

## app.mount() {#app-mount}

Monta a instância da aplicação em um elemento recipiente.

- **Tipo**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Detalhes**

  O argumento pode ser tanto o elemento real do DOM ou um seletor CSS (o primeiro elemento compatível será usado). Retorna a instância do componente raiz.

  Se o componente tem um modelo ou uma função _render_ definida, ele substituirá qualquer nódulo DOM existente dentro do recipiente. Caso contrário, se o compilador de tempo de execução estiver disponível, o `innerHTML` do recipiente será usado como modelo.

  No modo de hidratação SSR, ele hidratará os nódulos DOM existentes dentro do recipiente. Se houverem [disparidades](/guide/scaling-up/ssr.html#hydration-mismatch), os nódulos DOM existentes serão transformados para corresponder ao resultado esperado.

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

## app.unmount() {#app-unmount}

Desmonta uma instância de aplicação montada, disparando os gatilhos do ciclo de vida para todos os componentes na árvore de componentes da aplicação.

- **Tipo**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.provide() {#app-provide}

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

- **Veja também:**
  - [Fornecer / Injetar](/guide/components/provide-inject.html)
  - [Fornecimento a Nível de Aplicação](/guide/components/provide-inject.html#app-level-provide)

## app.component() {#app-component}

Registra um componente global ao passar um nome como string e uma definição de componente, ou busca um componente já registrado se apenas o nome é passado.

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

  // registra um objeto com opções
  app.component('my-component', {
    /* ... */
  })

  // busca um componente registrado
  const MyComponent = app.component('my-component')
  ```

- **Veja também:** [Registro de Componente](/guide/components/registration.html)

## app.directive() {#app-directive}

Registra uma diretiva global personalizada ao passar um nome como string e uma definição de diretiva, ou busca uma já registrada se apenas o nome é passado.

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

  // registrar (objeto da diretiva)
  app.directive('my-directive', {
    /* ganchos personalizados da diretiva */
  })

  // registrar (atalho da função diretiva)
  app.directive('my-directive', () => {
    /* ... */
  })

  // busca uma diretiva registrada
  const myDirective = app.directive('my-directive')
  ```

- **Veja também:** [Diretivas Personalizadas](/guide/reusability/custom-directives.html)

## app.use() {#app-use}

Instala uma [extensão](/guide/reusability/plugins.html).

- **Tipo**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Detalhes**

  Exige a extensão como primeiro argumento, e opcionalmente configurações da extensão como segundo argumento.

  A extensão pode tanto ser um objeto com um método `install()`, ou apenas uma funcão que será usada como o método `install()`. As opções (segundo argumento do `app.use()`) serão passadas através do método `install()` da extensão.

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

- **Veja também:** [Extensões](/guide/reusability/plugins.html)

## app.mixin() {#app-mixin}

Aplica uma mixin global (com escopo na aplicação). Uma mixin global aplica suas opções embutidas em toda instância de componente na aplicação.

:::warning Não Recomendado
Mixins são suportadas no Vue 3 principalmente por compatibilidade retroativa, devido ao seu uso difundido no ecossistema de bibliotecas. O uso de mixins, especialmente mixins globais, deve ser evitado no código da aplicação.

Para reutilização de lógica, opte por [Constituíveis](/guide/reusability/composables.html).
:::

- **Tipo**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.version {#app-version}

Fornece a versão do Vue com que a aplicação foi criada. Isto é útil dentro de [extensões](/guide/reusability/plugins.html), onde você pode precisar de lógica condicional para diferentes versões do Vue.

- **Tipo**

  ```ts
  interface App {
    version: string
  }
  ```

- **Exemplo**

  Conferindo a versão dentro de uma extensão:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('Esta extensão exige Vue 3')
      }
    }
  }
  ```

- **Veja também:** [API Global - versão](/api/general.html#version)

## app.config {#app-config}

Toda instância da aplicação expõe um objeto `config` que contém as preferências de configuracão para aquela aplicação. Você pode modificar essas propriedades (documentadas abaixo) antes de montar a sua aplicação.

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

Atribui um manipulador global para erros não capturados propagados dentro da aplicação.

- **Tipo**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` é uma informação de erro específica do Vue,
      // e.g. qual gatilho do ciclo de vida o erro aconteceu
      info: string
    ) => void
  }
  ```

- **Detalhes**

  O manipulador do erro recebe três argumentos: o erro, a instância do componente que disparou o erro, e uma string informativa que especifica o tipo de erro da fonte.

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
    // manusear o erro, e.g. informar para um serviço
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Atribui um manipulador personalizado para avisos em tempo de execução do Vue.

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

  Pode ser usado para filtrar avisos específicos a fim de reduzir a verbosidade no console. Todos os avisos Vue devem ser adereçados durante o desenvolvimento, então isto é recomendado apenas durante sessões de depuramento para focar em avisos específicos entre muitos, e deve ser removido uma vez que o depuramento tenha finalizado.

  :::tip
  Avisos funcionam apenas durante o desenvolvimento, esta configuração é ignorada no modo de produção.
  :::

- **Exemplo**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` é o rastro da hierarquia de componentes
  }
  ```

## app.config.performance {#app-config-performance}

Defina isto como `true` para habilitar o rastreamento de desempenho de correção, compilacão e inicialização no painel de desempenho ou linha do tempo no devtool do navegador. Funciona apenas no modo de desenvolvimento e em navegadores que suportam a API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

- **Tipo**: `boolean`

- **Veja também:** [Guia - Desempenho](/guide/best-practices/performance.html)

## app.config.compilerOptions {#app-config-compileroptions}

Configura opções do compilador em tempo de execução. Valores definidos neste objeto serão passados para o compilador de modelos do navegador e afetarão todo componente configurado na aplicação. Observe que você pode sobrepor essas opções com base em um componente usando a [opção `compilerOptions`](/api/options-rendering.html#compileroptions).

::: warning Importante
Esta opção da configuração é respeitada apenas ao usar a _build_ completa (i.e. o `vue.js` autônomo que pode compilar modelos no navegador). Se você ester usando uma _build_ que roda apenas no tempo de execução com uma configuração de _build_, as opções do compilador devem ser passadas para o `@vue/compiler-dom` através da ferramenta de configurações da _build_.

- Para `vue-loader`: [passe através da opção do carregador `compilerOptions`](https://vue-loader.vuejs.org/options.html#compileroptions). Veja também [como configurar com `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- Para `vite`: [passe através das opções `@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  :::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

Especifica um método de verificação para reconhecer elementos personalizados nativos.

- **Tipo:** `(tag: string) => boolean`

- **Detalhes**

  Deve retornar `true` se a _tag_ deve ser tratada como elemento personalizado nativo. Para uma _tag_ correspondente, o Vue irá interpretar como um elemento nativo ao invés de tentar determinar um componente Vue.

  _Tags_ HTML e SVG nativas não precisam ser correspondidas nesta função - o compilador do Vue reconhece elas automaticamente.

- **Exemplo**

  ```js
  // tratar todas as tags começando com 'ion-' como elementos personalizados
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **Veja também:** [Vue e Web Components](/guide/extras/web-components.html)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

Ajusta o tratamento de espaço em branco no modelo.

- **Tipo:** `'condense' | 'preserve'`

- **Padrão:** `'condense'`

- **Detalhes**

  Vue remove/condensa caracteres de espaço em branco em modelos para produzir um resultado compilado mais eficiente. A estratégia padrão é "condensar", com o seguinte comportamento:

  1. Caracteres de espaço em branco iniciais ou finais dentro de um elemento são condensados em um único espaço.
  2. Caracteres de espaço em branco entre elementos que contêm novas linhas são removidos.
  3. Caracteres de espaço em branco consecutivos em nódulos de texto são condensados em um único espaço.

  Configurar essa opção como `'preserve'` irá desabilitar os itens (2) e (3).

- **Exemplo**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

Ajusta os delimitadores usados para a interpolação de texto dentro do modelo.

- **Tipo:** `[string, string]`

- **Padrão:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Detalhes**

  Isto é tipicamente usado para evitar conflitos com _frameworks_ do lado do servidor que também podem usar a sintaxe mustache.

- **Exemplo**

  ```js
  // Delimitadores modificados para o estilo de string do modelo ES6
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

Adjusts treatment of HTML comments in templates.

- **Type:** `boolean`

- **Default:** `false`

- **Details**

  By default, Vue will remove the comments in production. Setting this option to `true` will force Vue to preserve comments even in production. Comments are always preserved during development. This option is typically used when Vue is used with other libraries that rely on HTML comments.

- **Example**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

An object that can be used to register global properties that can be accessed on any component instance inside the application.

- **Type**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Details**

  This is a replacement of Vue 2's `Vue.prototype` which is no longer present in Vue 3. As with anything global, this should be used sparingly.

  If a global property conflicts with a component’s own property, the component's own property will have higher priority.

- **Usage**

  ```js
  app.config.globalProperties.msg = 'hello'
  ```

  This makes `msg` available inside any component template in the application, and also on `this` of any component instance:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'hello'
    }
  }
  ```

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

An object for defining merging strategies for custom component options.

- **Type**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Details**

  Some plugins / libraries add support for custom component options (by injecting global mixins). These options may require special merging logic when the same option needs to be "merged" from multiple sources (e.g. mixins or component inheritance).

  A merge strategy function can be registered for a custom option by assigning it on the `app.config.optionMergeStrategies` object using the option's name as the key.

  The merge strategy function receives the value of that option defined on the parent and child instances as the first and second arguments, respectively.

- **Example**

  ```js
  const app = createApp({
    // option from self
    msg: 'Vue',
    // option from a mixin
    mixins: [
      {
        msg: 'Hello '
      }
    ],
    mounted() {
      // merged options exposed on this.$options
      console.log(this.$options.msg)
    }
  })

  // define a custom merge strategy for `msg`
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // logs 'Hello Vue'
  ```

- **See also:** [Component Instance - `$options`](/api/component-instance.html#options)
