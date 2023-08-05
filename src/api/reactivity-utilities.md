# API de Reatividade: Utilitários {#reactivity-api-utilities}

## `isRef()` {#isref}

Verifica se um valor é um objeto de referência.

- **Tipo**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  
  Nota que o tipo de retorno é um [predicado de tipo](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), o que significa que `isRef` pode ser usado como um guarda de tipo:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // tipo de foo é reduzido para Ref<unknown>
    foo.value
  }
  ```

## `unref()` {#unref}

Retorna o valor interno se o argumento for uma referência, de outro modo retorna o próprio argumento. Isto é uma função açucareira para `val = isRef(val) ? val.value : val`.

- **Tipo**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Exemplo**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // `unwrapped` agora tem uma garantia de ser número
  }
  ```

## `toRef()` {#toref}

Pode ser usado para normalizar valores ou referências ou recuperadores para as referências (3.3+).

Também pode ser usado para criar uma referência para uma propriedade num objeto reativo de origem. A referência criada é sincronizada com sua propriedade de origem: a mutação da propriedade de origem atualizará a referência, e vice-versa.

- **Tipo**

  ```ts
  // assinatura da normalização (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // assinatura da propriedade do objeto
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Exemplo**

  Assinatura da normalização (3.3+):

  ```js
  // retorna as referências existentes como são
  toRef(existingRef)

  // cria um referência de apenas leitura que chama
  // o recuperador sobre o acesso de `.value`
  toRef(() => props.foo)

  // cria referências normais a partir de valores 
  // que são funções equivalentes à `ref(1)`
  toRef(1)
  ```

  Assinatura da propriedade do objeto:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // uma referência bidirecional que sincroniza com
  // a propriedade original
  const fooRef = toRef(state, 'foo')

  // mudanças na referência atualizam o original
  fooRef.value++
  console.log(state.foo) // 2

  // mudanças no original também atualizam a referência
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Nota que isto é diferente de:

  ```js
  const fooRef = ref(state.foo)
  ```

  A referência acima **não** está sincronizada com `state.foo`, porque a `ref()` recebe um valor numérico simples.

  `toRef()` é útil quando queremos passar a referência duma propriedade à uma função de composição:

  ```vue
  <script setup>
  import { toRef } from 'vue'
  
  const props = defineProps(/* ... */)

  // converter `props.foo` numa referência, depois
  // passar à uma função de composição
  useSomeFeature(toRef(props, 'foo'))

  // sintaxe de recuperador - recomendado na 3.3+
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  Quando `toRef` é usada com as propriedades dos componentes, as restrições habituais em torno da mutação de propriedades ainda aplicam-se. Tentar atribuir um novo valor à referência é equivalente a tentativa de modificar a propriedade diretamente e não é permitido. Neste cenário podemos considerar o uso de [`computed`](./reactivity-core#computed) com `get` e `set`. Consulte o guia [usando `v-model` com os componentes](/guide/components/v-model) por mais informações.

  Quando usamos a assinatura da propriedade do objeto, `toRef()` retornará uma referência usável mesmo se a propriedade de origem não existir atualmente. Isto torna possível trabalhar com propriedades opcionais, que não seriam escolhidas pelas [`toRefs`](#torefs).

## `toValue()` <sup class="vt-badge" data-text="3.3+" /> {#tovalue}

Normaliza valores ou referências ou recuperadores para valores. Isto é semelhante à [`unref()`](#unref), exceto que também normaliza recuperadores. Se o argumento for um recuperador, será invocado e seu valor de retorno será retornado.

Isto pode ser usado nas [Funções de Composição](/guide/reusability/composables) para normalizar um argumento que pode ser ou um valor, uma referência, ou um recuperador.

- **Tipo**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Exemplo**

  ```js
  toValue(1) //        --> 1
  toValue(ref(1)) //   --> 1
  toValue(() => 1) //  --> 1
  ```

  Normalização de argumentos nas funções de composição:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // reagir às mudanças do `id`
    })
  }

  // esta função de composição suporta alguma das seguintes:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## `toRefs()` {#torefs}

Converte um objeto reativo num objeto simples onde cada propriedade do objeto resultante é uma referência apontando para a propriedade correspondente do objeto original. Cada referência individual é criada usando [`toRef()`](#toref).

- **Tipo**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Exemplo**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Type de stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // A referência e a propriedade original estão "vinculadas"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` é útil quando retornamos um objeto reativo a partir duma função de composição para que o componente consumidor possa desestruturar ou propagar o objeto retornado sem perder a reatividade:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...lógica operando no estado

    // converter às referências quando retornar
    return toRefs(state)
  }

  // pode desestruturar sem perder a reatividade
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` apenas gerará referências para propriedades que são enumeráveis ​​no objeto de origem no momento da chamada. Para criar uma referência para uma propriedade que talvez ainda não exista, use [`toRef`](#toref).

## `isProxy()` {#isproxy}

Verifica se um objeto é uma delegação criada por [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive) ou [`shallowReadonly()`](./reactivity-advanced#shallowreadonly).

- **Tipo**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## `isReactive()` {#isreactive}

Verifica se um objeto é uma delegação criada por [`reactive()`](./reactivity-core#reactive) ou [`shallowReactive()`](./reactivity-advanced#shallowreactive).

- **Tipo**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## `isReadonly()` {#isreadonly}

Verifica se o valor passado é um objeto de somente leitura. As propriedades dum objeto de somente leitura podem mudar, mas não podem ser atribuídas diretamente através do objeto passado.

As delegações criadas por [`readonly()`](./reactivity-core#readonly) e [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) são ambas consideradas de somente leitura, visto que são uma referência [`computed()`](./reactivity-core#computed) sem uma função `set`.

- **Tipo**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
