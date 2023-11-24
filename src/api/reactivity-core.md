# API de Reatividade: Núcleo {#reactivity-api-core}

:::info Consultar Também
Para entender melhor as APIs de Reatividade, é recomendado a leitura dos seguintes capítulos no guia:

- [Fundamentos da Reatividade](/guide/essentials/reactivity-fundamentals) (com a preferência de API definida para API de Composição)
- [Reatividade em Profundidade](/guide/extras/reactivity-in-depth)
:::

## `ref()` {#ref}

Recebe um valor interno e retorna um objeto de referência reativa e mutável, que possui uma única propriedade `.value` que aponta para o valor interno.

- **Tipo**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Detalhes**

  O objeto de referência é mutável - por exemplo, podemos atribuir novos valores à `.value`. Também é reativo, o que significa que quaisquer operações de leitura à `.value` serão rastreadas, e operações de escrita acionarão os efeitos associados.

  Se um objeto for atribuído como valor duma referência, este objeto torna-se profundamente reativo com a [`reactive()`](#reactive). Isto também significa que se o objeto contiver referências encaixadas, serão profundamente desembrulhadas.

  Para evitar a conversão profunda, use [`shallowRef()`](./reactivity-advanced#shallowref).

- **Exemplo**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **Consulte também:**
  - [Guia - Variáveis Reativas com `ref()`](/guide/essentials/reactivity-fundamentals#reactive-variables-with-ref)
  - [Guia - Tipificando a `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## `computed()` {#computed}

Recebe uma função recuperadora e retorna um objeto de [referência](#ref) de somente leitura para o valor retornado a partir do recuperador. Também pode receber um objeto com funções `get` e `set`  para criar um objeto de referência gravável.

- **Tipo**

  ```ts
  // somente leitura
  function computed<T>(
    getter: () => T,
    // consulte a ligação "Depurando Propriedades Computadas" abaixo
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // gravável
  function computed<T>(
    options: {
      get: () => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Exemplo**

  Criando uma referência computada de somente leitura:

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // erro
  ```

  Criando uma referência computada gravável:

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Depuração:

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Consulte também:**
  - [Guia - Propriedades Computadas](/guide/essentials/computed)
  - [Guia - Depurando Propriedades Computadas](/guide/extras/reactivity-in-depth#computed-debugging)
  - [Guia - Tipos para `computed()`](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

## `reactive()` {#reactive}

Retorna uma delegação reativa do objeto.

- **Tipo**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Detalhes**

  A conversão reativa é "profunda": ela afeta todas as propriedades encaixadas. Um objeto reativo também desembrulha quaisquer propriedades que são [referências](#ref) embora preserve a reatividade.

  Deve-se notar que não existe desembrulhamento de referência realizado quando a referência é acessada como um elemento dum vetor reativo ou tipo de coleção nativo como `Map`.

  Para evitar esta conversão profunda e somente reter reatividade no nível da raiz, use [`shallowReactive()`](./reactivity-advanced#shallowreactive).

  O objeto retornado e seus objetos encaixados são embrulhados com a [Delegação da ECMAScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) e **não** são iguais ao objeto original. É recomendado trabalhar somente com a delegação reativa e evitar depender do objeto original.

- **Exemplo**

  Criando um objeto reativo:

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Desembrulhando uma referência:

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // a referência será desembrulhado
  console.log(obj.count === count.value) // true

  // atualizará `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // `count` será atualizado também
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```
  Note que as referências **não** são desembrulhadas quando acessadas como vetor ou elementos de coleções:

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // precisa de `.value` aqui
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // precisa de `.value` aqui
  console.log(map.get('count').value)
  ```
  Quando atribuímos uma [referência](#ref) à uma propriedade `reactive`, essa referência também será desembrulhada automaticamente. 

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **Consulte também:**
  - [Guia - Fundamentos de Reatividade](/guide/essentials/reactivity-fundamentals)
  - [Guia - Tipos para `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## `readonly()` {#readonly}

Recebe um objeto (reativo ou simples) ou uma [referência](#ref) e retorna uma delegação de somente leitura ao original.

- **Tipo**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Detalhes**

  Uma delegação de somente leitura é profunda: qualquer propriedade encaixada acessada serão de somente leitura também. Ela possui o mesmo mecanismo de desembrulhamento de referências que a `reactive()`, exceto que valores desembrulhados também serão de somente leitura.

  Para evitar a conversão profunda, use [shallowReadonly()](./reactivity-advanced#shallowreadonly).

- **Exemplo**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // funciona para o rastreio da reatividade
    console.log(copy.count)
  })

  // modificar o objeto original disparará observadores que dependem da cópia
  original.count++

  // modificações na cópia falharão e resultarão num aviso
  copy.count++ // aviso!
  ```

## `watchEffect()` {#watcheffect}

Executa uma função imediatamente enquanto rastreia reativamente suas dependências, e as re-executa sempre que as dependências forem modificadas.

- **Tipo**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): StopHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // pré-definido como: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Detalhes**

  O primeiro argumento é a função de efeito a ser executada. A função de efeito recebe uma função que pode ser usada para registar uma função de resposta de limpeza. A função de resposta de limpeza será chamada bem antes duma função de efeito ser re-executada, e pode ser usada para limpar efeitos colaterais invalidados, por exemplo, uma requisição assíncrona pendente (consulte o exemplo abaixo).

  O segundo argumento é um objeto de configuração opcional que pode ser usado para ajustar o tempo de descarga ou depurar as dependências do efeito.

  Por padrão, observadores executarão apenas antes da interpretação do componente. Definir `flush: 'post'` adiará o observador até depois da interpretação do componente. Consulte [Tempo de Descarga da Função de Resposta](/guide/essentials/watchers#callback-flush-timing) por mais informações. Nos casos raros, pode ser necessário acionar um observador imediatamente quando as dependências mudam, por exemplo, para invalidar uma memória de consulta imediata. Isto pode ser alcançado usando `flush: 'sync'`. No entanto, esta configuração deve ser usada com cautela, visto que pode conduzir à problemas de desempenho e consistência de dados se várias propriedades estiverem sendo atualizadas ao mesmo tempo.

  O valor de retorno é uma função de manipulação que pode ser chamada para impedir o efeito de executar novamente.

- **Example**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> logs 0

  count.value++
  // -> logs 1
  ```

  Limpeza de efeitos colaterais:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(id.value)
    // `cancel` será chamada se `id` mudar
    // para que requisições pendentes anteriores sejam canceladas
    // se ainda não foram completadas

    onCleanup(cancel)
    data.value = await response
  })
  ```

  Parando o observador:

  ```js
  const stop = watchEffect(() => {})

  // quando o observador não for mais necessário:
  stop()
  ```

  Opções:

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Consulte também**:
  - [Guia - Observadores](/guide/essentials/watchers#watcheffect)
  - [Guia - Depuração de Observadores](/guide/extras/reactivity-in-depth#watcher-debugging)

## `watchPostEffect()` {#watchposteffect}

Pseudónimo da [`watchEffect()`](#watcheffect) com a opção `flush: 'post'`.

## `watchSyncEffect()` {#watchsynceffect}

Pseudónimo da [`watchEffect()`](#watcheffect) com a opção `flush: 'sync'`.

## `watch()` {#watch}

Observa uma ou mais fontes de dados reativos e invoca uma função de resposta quando as
fontes mudam.

- **Tipo**

  ```ts
  // observando uma única fonte
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): StopHandle

  // observando várias fontes
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): StopHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // referência
    | (() => T) // recuperador
    | T extends object
    ? T
    : never // objeto reativo

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // pré-definido como: false
    deep?: boolean // pré-definido como: false
    flush?: 'pre' | 'post' | 'sync' // pré-definido como: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > Os tipos foram simplificados para facilitar a leitura.

- **Detalhes**

  `watch()` é preguiçosa por padrão - por exemplo, a função de resposta é apenas chamada quando a fonte observada for mudada.

  O primeiro argumento é a **fonte** do observador. A fonte pode ser uma das seguintes:

  - Uma função recuperadora que retorna um valor
  - Uma referência
  - Um objeto reativo
  - ...ou um vetor de itens acima.

  O segundo argumento é a função de resposta que será chamada quando a fonte mudar. A função de resposta recebe três argumentos: o novo valor, o valor antigo e a função para registar uma função de resposta da limpeza de efeito colateral. A função de resposta da limpeza será chamada imediatamente antes da próxima vez do efeito ser re-executado, e pode ser usada para limpar efeitos colaterais invalidados, por exemplo, uma requisição assíncrona pendente.

  Quando observamos várias fontes, a função de resposta recebe dois vetores contendo novos ou antigos valores correspondendo ao vetor de fonte.

  O terceiro argumento opcional é um objeto de opções que suporta as seguintes opções:

  - **`immediate`**: aciona a função de resposta imediatamente depois da criação do observador. O valor antigo será `undefined` na primeira chamada.
  - **`deep`**: força travessia profunda da fonte se for um objeto, para que a função de resposta dispare sobre as mutações profundas. Consulte [Observadores Profundos](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: ajusta o tempo de descarga da função de resposta. Consulte [Tempo de Descarga da Função de Resposta](/guide/essentials/watchers#callback-flush-timing) e [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: depura as dependências do observador. Consulte [Depuração de Observadores](/guide/extras/reactivity-in-depth#watcher-debugging).

  Comparado ao [`watchEffect()`](#watcheffect), `watch()` permite-nos:

  - Executar os efeitos colaterais preguiçosamente;
  - Ser mais específico sobre qual estado deve acionar o observador à ser re-executar;
  - Acessar ambos o valor anterior e atual estado do estado observado.

- **Exemplo**

  Observando um recuperador:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Observando uma referência:

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  Quando observamos várias fontes, a função de resposta recebe vetores contendo novos ou valores antigos correspondendo ao vetor de fonte:

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```
  Quando usamos a fonte dum recuperador, o observador apenas dispara se o valor de retorno do recuperador for mudado. Se quisermos que função de resposta dispara mesmo sobre mutações profundas, precisamos de explicitamente forçar o observador a entrar num modo profundo com `{ deep: true }`. Nota: no modo profundo, o novo valor e antigo serão o mesmo objeto se a função de resposta foi acionada por uma mutação profunda:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```
  
  Quando observamos diretamente um objeto reativo, o observador está automaticamente no modo profundo:

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* aciona sobre a mutação profunda para o estado */
  })
  ```

  `watch()` partilha o mesmo tempo de descarga e opções de depuração com [`watchEffect()`](#watcheffect):

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  Parando o observador:

  ```js
  const stop = watch(source, callback)

  // quando o observador não for mais necessário:
  stop()
  ```

  Limpeza de efeitos colaterais:

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` será chamada se `id` mudar, cancelando
    // requisições anteriores se ainda não foram completadas
    onCleanup(cancel)
    data.value = await response
  })
  ```

- **Consulte também**:

  - [Guia - Observadores](/guide/essentials/watchers)
  - [Guia - Depuração de Observadores](/guide/extras/reactivity-in-depth#watcher-debugging)
