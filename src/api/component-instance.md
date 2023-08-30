# Instância do Componente {#component-instance}

:::info
Esta página documenta as propriedades e os métodos embutidos expostos na instância pública do componente, por exemplo, `this`.

Todas as propriedades listadas nesta página são de apenas leitura (exceto propriedades encaixadas na `$data`).
:::

## `$data` {#data}

O objeto retornado a partir da opção [`data`](./options-state#data), tornado reativo pelo componente. A instância do componente delega o acesso às propriedades sobre o seu objeto de dados.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## `$props` {#props}

Um objeto que representa as propriedades atuais e resolvidas do componente.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Detalhes**

  Apenas as propriedades declarados através da opção [`props`](./options-state#props) serão incluídas. A instância do componente delega o acesso às propriedades sobre o seu objeto de propriedades.

## `$el` {#el}

O nó de DOM de raiz que a instância do componente está gerir.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **Detalhes**

  `$el` será `undefined` até o component ser [montado](./options-lifecycle#mounted).

  - Para componentes com um único elemento de raiz, `$el` apontará para este elemento.
  - Para componentes com raiz de texto, `$el` apontará para o nó de texto.
  - Para componentes com vários nós de raiz, `$el` será o nó de DOM de espaço reservado que a Vue usa para continuar a rastrear a posição do componente no DOM (um nó de texto ou um nó de comentário no modo de hidratação da interpretação no lado do servidor).

  :::tip DICA
  Por questões consistência, é recomendado usar [referências de modelo de marcação](/guide/essentials/template-refs) para o acesso direto aos elementos em vez de depender de `$el`.
  :::

## `$options` {#options}

As opções de componente resolvidas usadas para instanciar a instância do componente atual.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Detalhes**

  O objeto `$options` expõe as opções resolvidas para o componente atual e é o resultado da combinação destas possíveis fontes:

  - Misturas globais
  - Base de `extends` do componente
  - Misturas do componente

  É normalmente usado para suportar opções de componente personalizadas:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **Consulte também:** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## `$parent` {#parent}

A instância pai, se a instância atual tiver uma. Será `null` para a própria instância de raiz.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## `$root` {#root}

A instância do componente de raiz da árvore do componente atual. Se a instância atual não tiver pais, este valor será ele próprio.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## `$slots` {#slots}

Um objeto que representa as [ranhuras](/guide/components/slots) passadas pelo componente pai.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Detalhes**

  Normalmente usada quando escrevemos manualmente [funções de interpretação](/guide/extras/render-function), mas também pode ser usada para detetar se uma ranhura está presente.

  Cada ranhura é exposta sobre `this.$slots` como uma função que retorna um vetor de nós virtuais sob a chave correspondendo ao nome daquela ranhura. A ranhura padrão é exposta como `this.$slots.default`.

  Se uma ranhura for uma [ranhura isolada](/guide/components/slots#scoped-slots), os argumentos passados às funções da ranhura estão disponíveis à ranhura como suas propriedades de ranhura.

- **Consulte também:** [Funções de Interpretação - Interpretação de Ranhuras](/guide/extras/render-function#rendering-slots)

## `$refs` {#refs}

Um objeto de elementos de DOM e as instâncias de componente, registadas através das [referências do modelo de marcação](/guide/essentials/template-refs).

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **Consulte também:**

  - [Referências do Modelo de Marcação](/guide/essentials/template-refs)
  - [Atributos Especiais - `ref`](./built-in-special-attributes#ref)

## `$attrs` {#attrs}

Um objeto que contém os atributos de passagem do componente.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Detalhes**

  [Atributos de Passagem](/guide/components/attrs) são atributos e manipuladores de eventos passados ​​pelo componente pai, mas não declarados como uma propriedade ou um evento emitido pelo filho.

  Por padrão, tudo na `$attrs` será herdado automaticamente no elemento de raiz do componente se houver apenas um único elemento de raiz. Este comportamento é desativado se o componente tiver vários nós de raiz e pode ser explicitamente desativado com a opção [`inheritAttrs`](./options-misc#inheritattrs).

- **Consulte também:**

  - [Atributos de Passagem](/guide/components/attrs)

## `$watch()` {#watch}

API imperativa para criar observadores.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // predefinida como: false
    deep?: boolean // predefinida como: false
    flush?: 'pre' | 'post' | 'sync' // predefinida como: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Detalhes**

  O primeiro argumento é a fonte do observador. Pode ser uma sequência de caracteres do nome da propriedade do componente, uma simples sequência de caracteres do caminho delimitada por ponto, ou uma função recuperadora.

  O segundo argumento é a função de resposta. A função de resposta recebe o novo valor e o valor antigo da fonte observada.

  - **`immediate`**: aciona a função de resposta imediatamente na criação do observador. O valor antigo será `undefined` na primeira chamada.
  - **`deep`**: força a travessia profunda da fonte se for um objeto, para que a função de resposta dispare sobre as mutações profundas. Consulte [Observadores Profundos](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: ajusta o tempo de descarga da função de resposta. Consulte [Tempo de Descarga da Função de Resposta](/guide/essentials/watchers#callback-flush-timing) e [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: depura as dependências do observador. Consulte [Depuração do Observador](/guide/extras/reactivity-in-depth#watcher-debugging).

- **Exemplo**

  Observar um nome de propriedade:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Observar um caminho delimitado por ponto:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Usar função recuperadora para expressões mais complexas:

  ```js
  this.$watch(
    // sempre que a expressão `this.a + this.b` retornar
    // um resultado diferente, o manipulador será chamado.
    // É como se estivéssemos observando uma propriedade computada
    // sem definir a própria propriedade computada.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Parar o observador:

  ```js
  const unwatch = this.$watch('a', cb)

  // depois...
  unwatch()
  ```

- **Consulte também:**
  - [Opções - `watch`](/api/options-state#watch)
  - [Guia - Observadores](/guide/essentials/watchers)

## `$emit()` {#emit}

Aciona um evento personalizado na instância atual. Quaisquer argumentos adicionais serão passados à função de resposta do ouvinte.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Exemplo**

  ```js
  export default {
    created() {
      // único evento
      this.$emit('foo')
      // com argumentos adicionais
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **Consulte também:**

  - [Componente - Eventos](/guide/components/events)
  - [Opção `emits`](./options-state#emits)

## `$forceUpdate()` {#forceupdate}

Força a instância do componente à desenhar novamente

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Detalhes**

  Isto deve ser raramente necessário dado o sistema de reatividade totalmente automático da Vue. Os únicos casos em que podemos precisar dela é quando críamos explicitamente um estado de componente que não é reativo usando APIs de reatividade avançadas.

## `$nextTick()` {#nexttick}

Versão vinculada à instância da [`nextTick()`](./general#nexttick) global.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Detalhes**

  A única diferença da versão global de `nextTick()` é que a função de resposta passada à `this.$nextTick()` terá o seu contexto `this` vinculado à instância do componente atual.

- **Consulte também:** [`nextTick()`](./general#nexttick)
