# Options: Ciclo de Vida {#options-lifecycle}

:::info Veja também
Para uso compartilhado de ganchos de ciclo de vida, consulte [Guia - Ganchos de Ciclo de Vida](/guide/essentials/lifecycle.html)
:::

## beforeCreate {#beforecreate}
Chamado quando a instância é inicializada.


- **Type**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Chamado imediatamente quando a instância é inicializada, após a resolução das props, antes de processar outras opções como `data()` ou `computed`

  Observe que o gancho `setup()` da API de composição é chamado antes de qualquer gancho da API de opções, mesmo `beforeCreate()`

## created {#created}

Chamado depois que a instância concluiu o processamento de todas as opções relacionadas ao estado.

- **Type**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Quando esses ganchos são chamados, o seguinte foi configurado: dados reativos, propriedades computadas, métodos e observadores. No entanto, a fase de montagem ainda não foi iniciada e a propriedade `$el` ainda não estará disponível.

## beforeMount {#beforemount}

Chamado logo antes de o componente ser montado.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Quando esse gancho é chamado, o componente terminou de configurar seu estado reativo, mas nenhum nó DOM foi criado ainda. Ele está prestes a executar seu efeito de renderização DOM pela primeira vez.

  **Este gancho não é chamado durante a renderização do lado do servidor.**

## mounted {#mounted}

Chamado depois que o componente foi montado.

- **Type**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Um componente é considerado montado após:

  - Todos os seus componentes filhos síncronos foram montados (não inclui componentes assíncronos ou componentes dentro das árvores `<Suspense>`).

  - Sua própria árvore DOM foi criada e inserida no contêiner pai. Observe que isso só garante que a árvore DOM do componente esteja no documento se o contêiner raiz do aplicativo também estiver no documento.

  Esse gancho é normalmente usado para executar efeitos colaterais que precisam de acesso ao DOM renderizado do componente ou para limitar o código relacionado ao DOM ao cliente em um [aplicativo renderizado pelo servidor](/guide/scaling-up/ssr.html).

  **Este gancho não é chamado durante a renderização do lado do servidor.**

## beforeUpdate {#beforeupdate}

Chamado logo antes do componente estar prestes a atualizar sua árvore DOM devido a uma mudança de estado reativo.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Este gancho pode ser usado para acessar o estado do DOM antes que o Vue atualize o DOM. Também é seguro modificar o estado do componente dentro deste gancho.

  **Este gancho não é chamado durante a renderização do lado do servidor.**

## updated {#updated}

Chamado depois que o componente atualizou sua árvore DOM devido a uma mudança de estado reativo.

- **Type**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  O gancho atualizado de um componente pai é chamado depois de seus componentes filhos.

  Esse gancho é chamado após qualquer atualização do DOM do componente, que pode ser causada por diferentes alterações de estado. Se você precisar acessar o DOM atualizado após uma mudança de estado específica, use [nextTick()](/api/general.html#nexttick).

  **Este gancho não é chamado durante a renderização do lado do servidor.**

  :::warning
  Não modifique o estado do componente no gancho atualizado - isso provavelmente levará a um loop de atualização infinito!
  :::

## beforeUnmount {#beforeunmount}

Chamado logo antes de uma instância de componente ser desmontada.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Quando esse gancho é chamado, a instância do componente ainda está totalmente funcional.

  **Este gancho não é chamado durante a renderização do lado do servidor.**

## unmounted {#unmounted}

Chamado depois que o componente foi desmontado.

- **Type**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **Detalhes**

  Um componente é considerado desmontado após:

  - Todos os seus componentes filhos foram desmontados.

  - Todos os seus efeitos reativos associados (efeito de renderização e computados / observadores criados durante `setup()`) foram interrompidos.

  Use este gancho para limpar efeitos colaterais criados manualmente, como temporizadores, ouvintes de eventos DOM ou conexões de servidor.

  **Este gancho não é chamado durante a renderização do lado do servidor.**

## errorCaptured {#errorcaptured}

Chamado quando um erro de propagação de um componente descendente foi capturado.

- **Type**

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

  Os erros podem ser capturados das seguintes fontes:

  - Renderizações de componentes
  - Manipuladores de eventos
  - Ganchos de ciclo de vida
  - função `setup()`
  - Vigilantes
  - Ganchos de diretiva personalizados
  - Ganchos de transição

  O gancho recebe três argumentos: o erro, a instância do componente que acionou o erro e uma cadeia de informações especificando o tipo de origem do erro.

  Você pode modificar o estado do componente em `errorCaptured()` para exibir um estado de erro para o usuário. No entanto, é importante que o estado de erro não renderize o conteúdo original que causou o erro; caso contrário, o componente será lançado em um loop de renderização infinito.

  O gancho pode retornar `false` para impedir que o erro se propague ainda mais. Veja os detalhes de propagação de erro abaixo.


  **Regras de Propagação de Erros**

  - Por padrão, todos os erros ainda são enviados para o nível do aplicativo [`app.config.errorHandler`](/api/application.html#app-config-errorhandler) se for definido, para que esses erros ainda possam ser relatados a um serviço de análise em um único local.

  - Se existirem vários ganchos `errorCaptured` na cadeia de herança ou na cadeia pai de um componente, todos eles serão invocados no mesmo erro, na ordem de baixo para cima. Isso é semelhante ao mecanismo de borbulhamento de eventos DOM nativos.

  - Se o próprio gancho `errorCaptured` lançar um erro, tanto este erro quanto o erro capturado original serão enviados para `app.config.errorHandler`.

  - Um gancho `errorCaptured` pode retornar `false` para evitar que o erro se propague ainda mais. Isso significa essencialmente que "esse erro foi tratado e deve ser ignorado". Isso impedirá que quaisquer ganchos `errorCaptured` adicionais ou `app.config.errorHandler` sejam invocados para este erro.

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

Chamado quando uma dependência reativa foi rastreada pelo efeito de renderização do componente.

**Esse gancho é somente no modo de desenvolvimento e não é chamado durante a renderização do lado do servidor.**

- **Type**

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

- **Veja também:** [Reatividade em Profundidade](/guide/extras/reactivity-in-depth.html)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered}

Chamado quando uma dependência reativa aciona o efeito de renderização do componente para ser executado novamente.

**Esse gancho é somente no modo de desenvolvimento e não é chamado durante a renderização do lado do servidor.**

- **Type**

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

- **Veja também:** [Reatividade em Profundidade](/guide/extras/reactivity-in-depth.html)

## activated {#activated}

Chamado depois que a instância do componente é inserida no DOM como parte de uma árvore armazenada em cache por [`<KeepAlive>`](/api/built-in-components.html#keepalive).

**Este gancho não é chamado durante a renderização do lado do servidor.**

- **Type**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **Veja também:** [Guia - Ciclo de vida da instância em cache](/guide/built-ins/keep-alive.html#lifecycle-of-cached-instance)

## deactivated {#deactivated}

Chamado depois que a instância do componente é removida do DOM como parte de uma árvore armazenada em cache por [`<KeepAlive>`](/api/built-in-components.html#keepalive).

**Este gancho não é chamado durante a renderização do lado do servidor.**

- **Type**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **Veja também:** [Guia - Ciclo de vida da instância em cache](/guide/built-ins/keep-alive.html#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="SSR only" /> {#serverprefetch}

Função assíncrona a ser resolvida antes que a instância do componente seja renderizada no servidor.

- **Type**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **Detalhes**

  Se o gancho retornar uma promessa, o renderizador do servidor aguardará até que a promessa seja resolvida antes de renderizar o componente.

  Esse gancho é chamado apenas durante a renderização do lado do servidor e pode ser usado para executar a busca de dados somente do servidor.

- **Exemplo**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // componente é renderizado como parte da solicitação inicial
      // pré-buscar dados no servidor, pois é mais rápido do que no cliente
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // se os dados forem nulos na montagem, significa que o componente
        // é renderizado dinamicamente no cliente. Execute um
        // busca do lado do cliente em vez disso.
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **Veja também:** [Server-Side Rendering](/guide/scaling-up/ssr.html)
