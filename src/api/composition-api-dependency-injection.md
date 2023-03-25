# API de Composição: <br>Injeção de Dependências {#composition-api-dependency-injection}

## provide() {#provide}

Fornece um valor que pode ser injetado em componentes descendentes.

- **Tipo**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Detalhes**

  `provide()` recebe dois argumentos: a chave, que pode ser uma string ou um símbolo, e o valor a ser injetado.

  Ao usar TypeScript, a chave pode ser um símbolo forjado como `InjectionKey` - um tipo de utilidade fornecida pelo Vue que estende `Symbol`, que pode ser usado para sincronizar o tipo de valor entre `provide()` e `inject()`.

  Similar ao gatilho de ciclo de vida das APIs de registro, `provide()` deve ser chamado sincronamente durante a fase de `setup()` do componente.

- **Exemplo**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // fornece valor estático
  provide('foo', 'bar')

  // fornece valor reativo
  const count = ref(0)
  provide('count', count)

  // fornece com chave Symbol
  provide(fooSymbol, count)
  </script>
  ```

- **Veja também**:
  - [Guia - Fornecer / Injetar](/guide/components/provide-inject.html)
  - [Guia - Tipando Fornecer / Injetar](/guide/typescript/composition-api.html#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Injeta um valor fornecido por um componente ancestral ou pela aplicação (via `app.provide()`).

- **Tipo**

  ```ts
  // sem valor padrão
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // com valor padrão
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // com factory
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Detalhes**

  O primeiro argumento é a chave de injeção. O Vue irá percorrer a cadeia de progenitores até localizar o valor fornecido com uma chave correspondente. Se múltiplos componentes na cadeia de progenitores tiverem a mesma chave, o mais próximo do componente injetado irá "sombrear" esses acima da cadeia. Se nenhum valor com a chave correspondente for encontrado, `inject()` retorna `undefined` a não ser que um valor padrão seja fornecido.

  O segundo argumento é opcional e é o valor padrão que pode user usado quando nenhum valor correspondente for encontrado. Ele também pode ser uma função _factory_ que retorna valores que são custosos para criar. Se o valor padrão for uma função, `false` deverá então ser passado como terceiro argumento para indicar que a funcão deve ser usada como valor ao invés da _factory_.

  Similar ao gatilho de ciclo de vida das APIs de registro, `inject()` deve ser chamado sincronamente durante a fase de `setup()` do componente.

  Ao usar TypeScript, a chave pode ser do tipo `InjectionKey` - uma utilidade de tipo fornecida pelo Vue que estende `Symbol`, que pode ser usado para sincronizar valores entre `provide()` e `inject()`.

- **Exemplo**

  Assumindo que um componente pai tenha fornecido valores como mostrado no exemplo `provide()` anterior:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // injeta um valor estático como padrão
  const foo = inject('foo')

  // injeta um valor reativo
  const count = inject('count')

  // injeta com chave Symbol
  const foo2 = inject(fooSymbol)

  // injeta com valor padrão
  const bar = inject('foo', 'default value')

  // injeat com valor padrão factory
  const baz = inject('foo', () => new Map())

  // injeta valor padrão de funcão, ao passar o terceiro argumento
  const fn = inject('function', () => {}, false)
  </script>
  ```

- **Veja também**:
  - [Guia - Fornecer / Injetar](/guide/components/provide-inject.html)
  - [Guia - Tipando Fornecer / Injetar](/guide/typescript/composition-api.html#typing-provide-inject) <sup class="vt-badge ts" />
