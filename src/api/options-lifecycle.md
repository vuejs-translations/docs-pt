# Opções: Ciclo de Vida {#options-lifecycle}

:::info Consulte também
Para uso partilhado dos gatilhos do ciclo de vida, consulte o [Guia - Gatilhos do Ciclo de Vida](/guide/essentials/lifecycle).
:::

## `beforeCreate` {#beforecreate}

Chamada quando a instância for inicializada.

- **Tipo**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Chamada imediatamente quando a instância for inicializada, depois da resolução das propriedades, antes de processar outras opções tais como `data()` ou `computed`.

  Nota que o gatilho `setup()` da API de Composição é chamado antes de quaisquer gatilhos da API de Opções, até mesmo antes de `beforeCreate()`.

## `created` {#created}

Chamada depois da instância ter terminado de processar todas as opções relacionadas ao estado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Quando este gatilho é chamado, os seguintes foram configurados: dados reativos, propriedades computadas, métodos, e observadores. No entanto, a fase de montagem ainda não foi começada, e a propriedade `$el` ainda não estará disponível.

## `beforeMount` {#beforemount}

Chamada bem antes do componente ser montado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Quando este gatilho é chamado, o componente terminou de configurar o seu estado reativo, mas ainda nenhum dos nós de DOM foi criado. Está prestes a executar o seu efeito de interpretação de DOM pela primeira vez.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

## `mounted` {#mounted}

Chamado depois do componente ter sido montado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Um componente é considerado montado depois:

  - De todos os seus componentes filhos síncronos terem sido montados (isto não inclui componentes assíncronos ou componentes dentro das árvores do `<Suspense>`).

  - Da sua própria árvore do DOM ter sido criada e inserida no contentor pai. Nota que isto apenas garante que a árvore do DOM do componente está no documento se o contentor da raiz da aplicação também estiver no documento.

  Este gatilho é normalmente usado para executar os efeitos colaterais que precisam do acesso ao DOM interpretado do componente, ou para limitar o código relacionado ao DOM para o cliente numa [aplicação interpretada no servidor](/guide/scaling-up/ssr).

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

## `beforeUpdate` {#beforeupdate}

Chamada bem antes do componente estiver prestes a atualizar a sua árvore do DOM devido à uma mudança de estado reativo.

- **Tipo**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Este gatilho pode ser usado para acessar o estado do DOM antes da Vue atualizar o DOM. Também é seguro modificar o estado do componente dentro deste gatilho.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

## `updated` {#updated}

Chamada depois do componente ter atualizado a sua árvore do DOM devido à uma mudança de estado reativo.

- **Tipo**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Uma gatilho `updated` dum componente pai é chamado depois do `updated` dos seus componentes filhos.

  Este gatilho é chamado depois de qualquer atualização do DOM do componente, que pode ser causada por diferentes mudanças de estado. Se precisarmos acessar o DOM atualizado depois duma mudança de estado específica, devemos usar [`nextTick()`](/api/general#nexttick).

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

  :::warning AVISO
  Não altere o estado do componente no gatilho `updated` - isto provavelmente conduzirá à um laço de atualização infinita!
  :::

## `beforeUnmount` {#beforeunmount}

Chamada bem antes duma instância de componente estiver a ser desmontada.

- **Tipo**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Quando este gatilho é chamado, a instância do componente permanece completamente funcional.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

## `unmounted` {#unmounted}

Chamada depois do componente ter sido desmontado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Um componente é considerado desmontado depois:

  - De todos os seus componentes filhos terem sido desmontados.

  - De todos os seus efeitos reativos associados (efeito de interpretação e computado ou observadores criados durante a `setup()`) terem sido interrompidos.

  Use este gatilho para limpar os efeitos colaterais criados manualmente tais como temporizadores, ouvintes de eventos de DOM oou conexões de servidor.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

## `errorCaptured` {#errorcaptured}

Chamada quando um erro propagando-se a partir dum componente descendente tiver sido capturado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
  ```

- **Detalhes**

  Os erros podem ser capturados a partir das seguintes fontes:

  - Interpretadores de componente
  - Manipuladores de evento
  - Gatilhos do ciclo de vida
  - função `setup()`
  - Observadores
  - Gatilhos de diretiva personalizada
  - Gatilhos de transição

  O gatilho recebe três argumentos: o erro, a instância do componente que acionou o erro, e uma sequência de caracteres de informação especificando o tipo da fonte do erro.

  Nós podemos modificar o estado do componente na `errorCaptured()` para exibir um estado de erro ao utilizador. No entanto, é importante que o estado de erro não interprete o conteúdo original que causou o erro; de outro modo o componente será lançado para um laço de interpretação infinita.

  O gatilho pode retornar `false` para impedir o erro de propagar-se mais. Consulte os detalhes sobre a propagação de erro abaixo.

  **Regras de Propagação de Erros**

  - Por padrão, todos os erros ainda serão enviados para o nível de aplicação [`app.config.errorHandler`](/api/application#app-config-errorhandler) se for definido, para que estes erros possam ser relatados à um serviço de análises num único lugar.

  - Se vários gatilhos de `errorCaptured` existirem numa cadeia de herança de componentes ou em uma cadeia de pais, todos serão invocados com o mesmo erro, na ordem de baixo para cima. Isto é semelhante ao mecanismo borbulhante de eventos de DOM nativos.

  - Se o próprio gatilho `errorCaptured` lançar um erro, tanto este erro quanto o erro original capturado serão enviados à `app.config.errorHandler`.

  - Um gatilho `errorCaptured` pode retornar `false` para evitar que o erro continue a propagar-se. Isto significa essencialmente que "este erro já foi manipulado e deve ser ignorado". Ele evitará quaisquer gatilhos `errorCaptured` adicionais ou `app.config.errorHandler` de serem invocados por este erro.

## `renderTracked` <sup class="vt-badge dev-only" data-text="desenvolvimento" /> {#rendertracked}

Chamada quando uma dependência reativa tiver sido rastreada pelo efeito de interpretação do componente.

**Este gatilho é apenas para o modo de desenvolvimento e não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Consulte também** [Reatividade em Profundidade](/guide/extras/reactivity-in-depth)

## `renderTriggered` <sup class="vt-badge dev-only" data-text="desenvolvimento" /> {#rendertriggered}

Chamada quando uma dependência reativa acionar o efeito de interpretação do componente a ser executado novamente.

**Este gatilho é apenas para o modo de desenvolvimento e não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **Consulte também** [Reatividade em Profundidade](/guide/extras/reactivity-in-depth)

## `activated` {#activated}

Chamada depois da instância do componente for inserida no DOM como parte duma árvore armazenada para consulta imediata pelo [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este gatilho não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **Consulte também** [Guia - Ciclo de Vida da Instância Armazenada para Consulta Imediata](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## `deactivated` {#deactivated}

Chamada depois da instância do componente ser removida do DOM como parte duma árvore armazenada para consulta imediata pelo [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este gatilho não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **Consulte também** [Guia - Ciclo de Vida da Instância Armazenada para Consulta Imediata](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## `serverPrefetch` <sup class="vt-badge" data-text="servidor" /> {#serverprefetch}

Função assíncrona a ser resolvida antes da instância do componente estiver à ser interpretada no servidor.

- **Tipo**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **Detalhes**

  Se um gatilho retornar uma promessa, o interpretador do servidor aguardará até a promessa ser resolvida antes de interpretar o componente.

  Este gatilho é chamado apenas durante a interpretação no lado do servidor e pode ser usado para realizar requisição de dados apenas no servidor.

- **Exemplo**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // componente é interpretado como parte da requisição inicial
      // pré-requisita dados no servidor pois é mais rápido do que no cliente
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // se data for null ao montar, significa que o componente
        // é interpretado dinamicamente no cliente.
        // Realizar uma requisição no lado do cliente.
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **Consulte também** [Interpretação no Lado do Servidor](/guide/scaling-up/ssr)
