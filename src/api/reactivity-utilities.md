# Reactivity API: Utilidades {#reactivity-api-utilities}

## isRef() {#isref}

Checa se o valor é um objeto ref.

- **Type**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  
Observe que o tipo de retorno é um [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), o que significa que `isRef` pode ser usado como proteção de tipo:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // tipo de foo é reduzido para Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Retorna o valor interno se o argumento for uma ref, caso contrário, retorna o próprio argumento. Esta é uma sugar function para `val = isRef(val) ? val.value : val`.
- **Type**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Exemplo**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped é garantido para ser o número agora
  }
  ```

## toRef() {#toref}

Pode ser usado para criar uma referência para uma propriedade em um objeto reativo de origem. A referência criada é sincronizada com sua propriedade de origem: a mutação da propriedade de origem atualizará a referência e vice-versa.

- **Type**

  ```ts
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Exemplo**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const fooRef = toRef(state, 'foo')

  // mudar o ref atualiza o original
  fooRef.value++
  console.log(state.foo) // 2

  // a mutação do original também atualiza o ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Observe que isso é diferente de:

  ```js
  const fooRef = ref(state.foo)
  ```

  A referência acima **não** é sincronizada com `state.foo`, porque `ref()` recebe um valor de número simples.

  `toRef()` é útil quando você deseja passar a ref de um prop para uma função de composição:

  ```vue
  <script setup>
  import { toRef } from 'vue'
  
  const props = defineProps(/* ... */)

  // converte `props.foo` em uma ref, então passa para
  // um elemento que pode ser composto
  useSomeFeature(toRef(props, 'foo'))
  </script>
  ```
  Quando `toRef` é usado com props de componentes, as restrições usuais sobre a mutação dos props ainda se aplicam. Tentar atribuir um novo valor ao ref é equivalente a tentar modificar o prop diretamente e não é permitido. Nesse cenário, você pode querer considerar o uso de [`computed`](./reactivity-core.html#computed) com `get` e `set`. Veja o guia [usando `v-model` com componentes](/guide/components/v-model.html) para mais informações.

  `toRef()` retornará uma referência utilizável mesmo se a propriedade de origem não existir no momento. Isso permite trabalhar com propriedades opcionais, que não seriam captadas por [`toRefs`](#torefs).

## toRefs() {#torefs}

Converte um objeto reativo em um objeto simples onde cada propriedade do objeto resultante é uma referência apontando para a propriedade correspondente do objeto original. Cada referência individual é criada usando [`toRef()`](#toref).

- **Type**

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

  `toRefs` é útil ao retornar um objeto reativo de uma função combinável para que o componente consumidor possa desestruturar/espalhar o objeto retornado sem perder a reatividade:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...lógica operando no estado

    // converter para refs ao retornar
    return toRefs(state)
  }

  // pode se desestruturar sem perder a reatividade
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` só irá gerar referências para propriedades que são enumeráveis ​​no objeto de origem no momento da chamada. Para criar uma referência para uma propriedade que ainda não existe, use [`toRef`](#toref).

## isProxy() {#isproxy}

Verifica se um objeto é um proxy criado por [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core.html#readonly), [`shallowReactive()`](./reactivity-advanced.html#shallowreactive) ou [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly).

- **Type**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive() {#isreactive}

Verifica se um objeto é um proxy criado por [`reactive()`](./reactivity-core.html#reactive) ou [`shallowReactive()`](./reactivity-advanced.html#shallowreactive).

- **Type**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Verifica se o valor passado é um objeto somente leitura. As propriedades de um objeto somente leitura podem mudar, mas não podem ser atribuídas diretamente por meio do objeto passado.

Os proxys criados por [`readonly()`](./reactivity-core.html#readonly) e [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly) são considerados somente leitura, assim como uma ref [`computed()`](./reactivity-core.html#computed) sem uma função `set`.

- **Type**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
