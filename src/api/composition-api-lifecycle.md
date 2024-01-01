# API de Composição: Gatilhos do Ciclo de Vida {#composition-api-lifecycle-hooks}

:::info Nota de Uso
Todas as APIs listadas nesta página devem ser chamadas de maneira síncrona durante a fase `setup()` do componente. Consulte o [Guia - Gatilhos do Ciclo de Vida](/guide/essentials/lifecycle) por mais detalhes.
:::

## `onMounted()` {#onmounted}

Regista uma função de resposta a ser chamada depois do componente ter sido montado.

- **Tipo**

  ```ts
  function onMounted(callback: () => void): void
  ```

- **Detalhes**

  Um componente é considerado montado depois que:

  - Todos os seus componentes filho síncronos terem sido montados (isto não inclui componentes assíncronos ou componentes dentro de árvores de `<Suspense>`).

  - Sua própria árvore de DOM ter sido criada e inserida no contentor pai. Nota que isto apenas garante que a árvore de DOM do componente está no documento se o contentor raiz da aplicação também estiver no documento.

  Este gatilho é tipicamente usado para realizar efeitos colaterais que precisam de acesso ao DOM interpretado do componente, ou para limitar o código relacionado ao DOM para o cliente numa [aplicação interpretada no servidor](/guide/scaling-up/ssr).

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

- **Exemplo**

  Acessar um elemento através de referências do modelo de marcação:

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## `onUpdated()` {#onupdated}

Regista uma função de resposta a ser chamada depois do componente tiver atualizado a sua árvore de DOM devido a uma mudança de estado reativa.

- **Tipo**

  ```ts
  function onUpdated(callback: () => void): void
  ```

- **Detalhes**

  O gatilho de atualização dum componente pai é chamado apenas depois do gatilho dos seus componentes.

  Este gatilho é chamado depois de qualquer atualização de DOM do componente, que pode ser causada por mudanças de estado diferente. Se precisarmos acessar o DOM atualizado depois duma mudança de estado específica, devemos usar [`nextTick()`](/api/general#nexttick).

  **Este gatilho não é chamado durante a interpretação do lado do servidor.**

  :::warning AVISO
  Não altere o estado do componente no gatilho `updated` - isto provavelmente conduzirá à um laço de atualização infinita!
  :::

- **Exemplo**

  Acessando o DOM atualizado:

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // o conteúdo de texto deve ser o mesmo que o `count.value` atual
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## `onUnmounted()` {#onunmounted}

Regista uma função de resposta a ser chamada depois do componente tiver sido desmontado.

- **Tipo**

  ```ts
  function onUnmounted(callback: () => void): void
  ```

- **Detalhes**

  Um componente é considerado desmontado depois que:

  - Todos os seus componentes filho foram desmontados.

  - Todos os seus efeitos reativos associados (efeitos de interpretação e valores computados ou observadores criados durante `setup()`) foram interrompidos.

  Use este gatilho para limpar manualmente efeitos colaterais como temporizadores, ouvintes de evento de DOM, ou conexões de servidor.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

- **Exemplo**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## `onBeforeMount()` {#onbeforemount}

Regista um gatilho a ser chamado imediatamente antes do componente ser montado.

- **Tipo**

  ```ts
  function onBeforeMount(callback: () => void): void
  ```

- **Detalhes**

  Quando este gatilho é chamado, o componente terminou de configurar seu estado reativo, mas nenhum nós de DOM foi criado ainda. Está prestes a executar o seu efeito de interpretação de DOM pela primeira vez.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

## `onBeforeUpdate()` {#onbeforeupdate}

Regista um gatilho a ser chamado imediatamente antes do componente estar prestes a atualizar sua árvore de DOM devido a uma mudança de estado reativo.

- **Tipo**

  ```ts
  function onBeforeUpdate(callback: () => void): void
  ```

- **Detalhes**

  Este gatilho pode ser usado para acessar o estado do DOM imediatamente antes da Vue atualizar o DOM. Também é seguro modificar o estado do componente dentro deste gatilho.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

## `onBeforeUnmount()` {#onbeforeunmount}

Regista um gatilho a ser chamado imediatamente antes da instância do componente ser desmontada.

- **Tipo**

  ```ts
  function onBeforeUnmount(callback: () => void): void
  ```

- **Detalhes**

  Quando este gatilho é chamado, a instância do componente ainda está completamente funcional.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

## `onErrorCaptured()` {#onerrorcaptured}

Regista um gatilho a ser chamado quando um erro que se propaga a partir dum componente descendente tiver sido capturado.

- **Tipo**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **Detalhes**

  Erros podem ser capturados a partir das seguintes fontes:

  - Interpretações de componente
  - Manipuladores de evento
  - Gatilhos do ciclo de vida
  - Função `setup()`
  - Observadores
  - Gatilhos de diretiva personalizada
  - Gatilhos de transição

  O gatilho recebe três argumentos: o erro, a instância do componente que disparou o erro, e uma sequência de caracteres de informação especificando o tipo de erro da fonte.

  :::tip DICA
  Em produção, o terceiro argumento (`info`) será um código encurtado ao invés da sequência de caracteres da informação completa. Nós podemos encontrar o código ao mapeamento da sequência de caracteres na [Referência do Código de Erro de Produção](/error-reference/#runtime-errors).
  :::

  Nós podemos modificar o estado do componente em `errorCaptured()` para mostrar um estado de erro ao utilizador. No entanto, é importante que o estado de erro não desenhe o conteúdo original que causou o erro; de outro modo o componente será lançado num laço de interpretação infinita.

  O gatilho pode retornar `false` para impedir que o erro continue a propagar-se. Consulte os detalhes de propagação de erro abaixo.

  **Regras de Propagação de Erro**

  - Por padrão, todos os erros ainda serão enviados para o nível de aplicação [`app.config.errorHandler`](/api/application#app-config-errorhandler) se for definido, para que estes erros possam ser relatados à um serviço de análises num único lugar.

  - Se vários gatilhos de `errorCaptured` existirem numa cadeia de herança de componentes ou em uma cadeia de pais, todos serão invocados com o mesmo erro, na ordem de baixo para cima. Isto é semelhante ao mecanismo borbulhante de eventos de DOM nativos.

  - Se o próprio gatilho `errorCaptured` lançar um erro, tanto este erro quanto o erro original capturado serão enviados à `app.config.errorHandler`.

  - Um gatilho `errorCaptured` pode retornar `false` para evitar que o erro continue a propagar-se. Isto significa essencialmente que "este erro já foi manipulado e deve ser ignorado". Ele evitará quaisquer gatilhos `errorCaptured` adicionais ou `app.config.errorHandler` de serem invocados por este erro.

## `onRenderTracked()` <sup class="vt-badge dev-only" data-text="desenvolvimento" /> {#onrendertracked}

Regista um gatilho de depuração a ser chamado quando uma dependência reativa tiver sido rastreada pelo efeito da interpretação do componente.

**Este gatilho é apenas para o modo de desenvolvimento e não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Consulte também:** [Reatividade em Profundidade](/guide/extras/reactivity-in-depth)

## `onRenderTriggered()` <sup class="vt-badge dev-only" data-text="desenvolvimento" /> {#onrendertriggered}

Regista um gatilho de depuração a ser chamado quando uma dependência reativa aciona o efeito de interpretação do componente a ser executado novamente.

**Este gatilho é apenas para o modo de desenvolvimento e não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

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

- **Consulte também:** [Reatividade em Profundidade](/guide/extras/reactivity-in-depth)

## `onActivated()` {#onactivated}

Regista uma função de resposta a ser chamada depois da instância do componente for inserida no DOM como parte duma árvore armazenada para consulta imediata pelo [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este gatilho não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  function onActivated(callback: () => void): void
  ```

- **Consulte também:** [Guia - Ciclo de Vida da Instância Armazenada para Consulta Imediata](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## `onDeactivated()` {#ondeactivated}

Regista uma função de resposta a ser chamada depois da instância do componente ser removida do DOM como parte duma árvore armazenada para consulta imediata pelo [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este gatilho não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  function onDeactivated(callback: () => void): void
  ```

- **Consulte também:** [Guia - Ciclo de Vida da Instância Armazenada para Consulta Imediata](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## `onServerPrefetch()` <sup class="vt-badge" data-text="servidor" /> {#onserverprefetch}

Regista uma função assíncrona a ser resolvida antes da instância do componente estiver à ser interpretada no servidor.

- **Tipo**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **Detalhes**

  Se a função de resposta retornar uma promessa, o interpretador do servidor aguardará até a promessa ser resolvida antes de desenhar o componente.

  Este gatilho é chamado apenas durante a interpretação no lado do servidor, pode ser usada para realizar requisição de dados apenas no servidor.

- **Exemplo**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // componente é interpretado como parte da requisição inicial
    // pré-requisita dados no servidor pois é mais rápido do que no cliente
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // se data for null ao montar, significa que o componente
      // é interpretado dinamicamente no cliente.
      // Realizar uma requisição no lado do cliente.
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **Consulte também:** [Interpretação no Lado do Servidor](/guide/scaling-up/ssr)
