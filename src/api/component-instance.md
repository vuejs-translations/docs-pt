# Instância do Componente {#component-instance}

:::info
Esta página documenta as propriedades internas e os métodos expostos na instância pública do componente, ou seja, `this`.

Todas as propriedades listadas nesta página são somente leitura (exceto propriedades aninhadas em `$data`).
:::

## $data {#data}

O objeto retornado da opção [`data`](./options-state.html#data), tornado reativo pelo componente. A instância do componente representa o acesso às propriedades em seu objeto de dados.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

Um objeto que representa as props resolvidas atuais do componente.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Detalhes**

  Apenas props declarados através da opção [`props`](./options-state.html#props) serão incluídos. A instância do componente fornece acesso às propriedades em seu objeto props.

## $el {#el}

O nó DOM raiz que a instância do componente está gerenciando.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **Detalhes**

  `$el` será `undefined` até o component ser [montado](./options-lifecycle#mounted).

  - Para componentes com um único elemento raiz, `$el` apontará para esse elemento.
  - Para componentes com raiz de texto, `$el` apontará para o nó de texto.
  - Para componentes com vários nós raiz, `$el` será o espaço reservado para o nó DOM que o Vue usa para rastrear a posição do componente no DOM (um nó de texto ou um nó de comentário no modo de hidratação SSR).

  :::tip
  Para consistência, é recomendado usar [refs de modelo](/guide/essentials/template-refs.html) para acesso direto aos elementos em vez de depender de `$el`.
  :::

## $options {#options}

As opções de componente resolvidas usadas para instanciar a instância do componente atual.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Detalhes**

  O objeto `$options` expõe as opções resolvidas para o componente atual e é o resultado da mesclagem dessas possíveis fontes:

  - Global mixins
  - Componente `extends` base
  - Componente mixins

  Normalmente é usado para oferecer suporte a opções de componentes personalizados:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **Veja também:** [`app.config.optionMergeStrategies`](/api/application.html#app-config-optionmergestrategies)

## $parent {#parent}

A instância pai, se a instância atual tiver uma. Será `null` para a própria instância raiz.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

A instância do componente raiz da árvore de componentes atual. Se a instância atual não tiver pais, esse valor será ele mesmo.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

Um objeto que representa os [slots](/guide/components/slots.html) transmitidos pelo componente pai.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Detalhes**

  Normalmente usado ao criar manualmente [funções de renderização](/guide/extras/render-function.html), mas também pode ser usado para detectar se um slot está presente.

  Cada slot é exposto em `this.$slots` como uma função que retorna um array de vnodes sob a chave correspondente ao nome desse slot. O slot padrão é exposto como `this.$slots.default`.

  Se um slot for um [slot com escopo](/guide/components/slots.html#scoped-slots), os argumentos passados ​​para as funções do slot estarão disponíveis para o slot como seus suportes de slot.

- **Veja também:** [Funções de renderização - Slots de renderização](/guide/extras/render-function.html#rendering-slots)

## $refs {#refs}

Um objeto de elementos DOM e instâncias de componentes, registrados via [template refs](/guide/essentials/template-refs.html).

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **Veja também:**

  - [Template refs](/guide/essentials/template-refs.html)
  - [Atributos especiais - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

Um objeto que contém os atributos fallthrough do componente.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Detalhes**

  [Atributos Fallthrough](/guide/components/attrs.html) são atributos e manipuladores de eventos passados ​​pelo componente pai, mas não declarados como prop ou evento emitido pelo filho.

  Por padrão, tudo em `$attrs` será herdado automaticamente no elemento raiz do componente se houver apenas um único elemento raiz. Este comportamento é desativado se o componente tiver vários nós raiz e pode ser explicitamente desativado com a opção [`inheritAttrs`](./options-misc.html#inheritattrs).

- **Veja também:**

  - [Atributos Fallthrough](/guide/components/attrs.html)

## $watch() {#watch}

API imperativa para criar observadores.

- **Type**

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
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Detalhes**

  O primeiro argumento é a fonte do observador. Pode ser uma string de nome de propriedade de componente, uma string de caminho delimitada por ponto simples ou uma função getter.

  O segundo argumento é a função de callback. O callback recebe o novo valor e o valor antigo da fonte observada.

  - **`immediate`**: acionar o callback imediatamente na criação do observador. O valor antigo será `undefined` na primeira chamada
  - **`deep`**: força a travessia profunda da fonte se for um objeto, de modo que o callback seja acionado em mutações profundas. Veja [Deep Watchers](/guide/essentials/watchers.html#deep-watchers).
  - **`flush`**: ajuste o tempo de liberação do callback. Consulte [Tempo de recarga de Callback](/guide/essentials/watchers.html#callback-flush-timing) e [`watchEffect()`](/api/reactivity-core.html#watcheffect).
  - **`onTrack / onTrigger`**: debug das dependências do observador. Veja [Debugging do Observador](/guide/extras/reactivity-in-depth.html#watcher-debugging).

- **Exemplo**

  Observe um nome de propriedade:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Observe um caminho delimitado por pontos:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Usando getter para expressões mais complexas:

  ```js
  this.$watch(
    // toda vez que a expressão `this.a + this.b` retorna
    // um resultado diferente, o manipulador será chamado.
    // É como se estivéssemos observando uma propriedade computada
    // sem definir a própria propriedade calculada.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Parando o observador:

  ```js
  const unwatch = this.$watch('a', cb)

  // depois...
  unwatch()
  ```

- **Veja também:**
  - [Opções - `watch`](/api/options-state.html#watch)
  - [Guia - Observadores](/guide/essentials/watchers.html)

## $emit() {#emit}

Acione um evento personalizado na instância atual. Quaisquer argumentos adicionais serão passados ​​para o callback do ouvinte.

- **Type**

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

- **Veja também:**

  - [Componente - Eventos](/guide/components/events.html)
  - [`emits` opção](./options-state.html#emits)

## $forceUpdate() {#forceupdate}

Force a instância do componente a renderizar novamente.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Detalhes**

  Isso deve ser raramente necessário, dado o sistema de reatividade totalmente automático do Vue. Os únicos casos em que você pode precisar dele são quando você criou explicitamente um estado de componente não reativo usando APIs de reatividade avançada.

## $nextTick() {#nexttick}

Versão vinculada à instância do global [`nextTick()`](./general.html#nexttick).

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Detalhes**

  A única diferença da versão global de `nextTick()` é que o retorno de chamada passado para `this.$nextTick()` terá seu contexto `this` vinculado à instância do componente atual.

- **Veja também:** [`nextTick()`](./general.html#nexttick)
