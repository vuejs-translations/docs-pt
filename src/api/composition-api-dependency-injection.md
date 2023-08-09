# API de Composição: <br>Injeção de Dependência {#composition-api-dependency-injection}

## `provide()` {#provide}

Fornece um valor que pode ser injetado pelos componentes descendentes.

- **Tipo**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Detalhes**

  `provide()` recebe dois argumentos: a chave, que pode ser uma sequência de caracteres ou um símbolo, e o valor a ser injetado.

  Quando usamos a TypeScript, a chave pode ser um símbolo moldado como `InjectionKey` - um tipo de utilitário fornecido pela Vue que estende o `Symbol`, que pode ser usado para sincronizar o tipo de valor entre `provide()` e `inject()`.

  Semelhante às APIs de registo de gatilho de ciclo de vida, `provide()` deve ser chamada de maneira síncrona durante a fase `setup()` dum componente.

- **Exemplo**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // fornecer valor estático
  provide('foo', 'bar')

  // fornecer valor reativo
  const count = ref(0)
  provide('count', count)

  // fornecer com chaves de símbolo
  provide(fooSymbol, count)
  </script>
  ```

- **Consulte também**:
  - [Guia - Fornecer ou Injetar](/guide/components/provide-inject)
  - [Guia - Tipos para `provide()` / `inject()`](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" data-text="typescript" />

## `inject()` {#inject}

Injeta um valor fornecido por um componente ancestral ou pela aplicação (através de `app.provide()`).

- **Tipo**

  ```ts
  // sem valor padrão
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // com valor padrão
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // com fábrica
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Detalhes**

  O primeiro argumento é a chave de injeção. A Vue percorrerá a cadeia dos pais para localizar um valor fornecido com uma chave correspondente. Se vários componentes na cadeia dos pais fornecerem a mesma chave, o componente mais próximo do componente injetor "sombreará" os componentes mais acima na cadeia. Se nenhum valor com a chave correspondente for encontrado, `inject()` retorna `undefined` a menos que um valor padrão seja fornecido.

  O segundo argumento é opcional e é o valor padrão a ser usado quando nenhum valor correspondente foi encontrado.

  O segundo argumento também pode ser uma função de fábrica que retorna valores cuja criação é dispendiosa. Neste caso, `true` deve ser passado como terceiro argumento para indicar que a função deveria ser usada como uma fábrica ao invés do próprio valor.

  Semelhante às APIs de registo de gatilho de ciclo de vida, `inject()` deve ser chamada de maneira síncrona durante a fase `setup()` dum componente.

  Quando usamos a TypeScript, a chave pode ser do tipo de `InjectionKey` - um tipo de utilitário fornecido pela Vue que estende o `Symbol`, que pode ser usado para sincronizar o tipo de valor entre `provide()` e `inject()`.

- **Exemplo**

  Assumindo que um componente pai forneceu valores como mostrado no exemplo anterior de `provide()`:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // injetar valor estático sem padrão
  const foo = inject('foo')

  // injetar valor reativo
  const count = inject('count')

  // injetar com chaves de símbolo
  const foo2 = inject(fooSymbol)

  // injetar com valor padrão
  const bar = inject('foo', 'default value')

  // injetar com valor padrão de função
  const fn = inject('function', () => {})

  // injetar com fábrica de valor padrão
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```

- **Consulte também**:
  - [Guia - Fornecer ou Injetar](/guide/components/provide-inject)
  - [Guia - Tipos para `provide()` e `inject()`](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" data-text="typescript" />
