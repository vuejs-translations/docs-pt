# API de Reatividade: Avançado {#reactivity-api-advanced}

## `shallowRef()` {#shallowref}

Versão superficial de [`ref()`](./reactivity-core#ref).

- **Tipo**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Detalhes**

  Ao contrário de `ref()`, o valor interno duma referência superficial é armazenado e exposto como é, e não será profundamente reativa. Apenas o acesso de `.value` é reativo.

  `shallowRef()` é normalmente usado para otimizações de desempenho de grandes estruturas de dados ou integração com sistemas externos de gestão de estado.

- **Exemplo**

  ```js
  const state = shallowRef({ count: 1 })

  // NÃO aciona mudança
  state.value.count = 2

  // aciona mudança
  state.value = { count: 2 }
  ```

- **Consulte também:**
  - [Guia - Reduzir Custos de Reatividade para Grandes Estruturas Imutáveis](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
  - [Guia - Integração com Sistemas de Estado Externos](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## `triggerRef()` {#triggerref}

Força o acionamento de efeitos que dependem duma [referência superficial](#shallowref). Isso é normalmente usado depois de fazer-se mutações profundas no valor interno duma referência superficial.

- **Tipo**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Exemplo**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // Regista "Hello, world" uma vez para o primeiro ensaio
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // Isto não acionará o efeito porque a referência é superficial
  shallow.value.greet = 'Hello, universe'

  // Regista "Hello, universe"
  triggerRef(shallow)
  ```

## `customRef()` {#customref}

Cria uma referência personalizada com controlo explícito sobre o rastreio de dependência e acionamento de atualizações.

- **Tipo**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **Detalhes**

  `customRef()` espera uma função de fábrica, que recebe as funções `track` e `trigger` como argumentos e deve retornar um objeto com os métodos `get` e `set`.

  Em geral, `track()` deve ser chamado dentro de `get()`, e `trigger()` deve ser chamado dentro de `set()`. No entanto, temos controlo total sobre quando devem ser chamados ou se devem ser chamados.

- **Exemplo**

  Criação duma referência de velocidade reduzida que apenas atualiza o valor após uma certa pausa após a última chamada definida:

  ```js
  import { customRef } from 'vue'
  
  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  Uso no componente:

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [Experimentar na Zona de Testes](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

## `shallowReactive()` {#shallowreactive}

Versão superficial de [`reactive()`](./reactivity-core#reactive).

- **Tipo**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Detalhes**

  Ao contrário de `reactive()`, não existe conversão profunda: apenas as propriedades de nível raiz são reativas para um objeto reativo superficial. Os valores de propriedade são armazenados e expostos como são - isto também significa que as propriedades com valores de referência **não** serão desembrulhados automaticamente.

  :::warning Use com Cautela
  Estruturas de dados superficiais devem ser usadas apenas para o estado de nível de raiz num componente. Evite encaixá-lo dentro dum objeto reativo profundo, visto que cria uma árvore com comportamento de reatividade inconsistente que pode ser difícil de entender e depurar.
  :::

- **Exemplo**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // a mutação das propriedades do próprio estado é reativa
  state.foo++

  // ...mas não converte objetos encaixados
  isReactive(state.nested) // false

  // NÃO é reativo
  state.nested.bar++
  ```

## `shallowReadonly()` {#shallowreadonly}

Versão superficial de [`readonly()`](./reactivity-core#readonly).

- **Tipo**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Detalhes**

  Ao contrário de `readonly()`, não existe conversão profunda: apenas propriedades de nível de raiz são tornadas de somente leitura. Os valores de propriedade são armazenados e expostos como são - isto também significa que as propriedades com valores de referência **não** serão desembrulhados automaticamente.

  :::warning Use com Cautela
  Estruturas de dados rasas devem ser usadas apenas para o estado de nível de raiz num componente. Evite encaixá-lo dentro dum objeto reativo profundo, visto que cria uma árvore com comportamento de reatividade inconsistente que pode ser difícil de entender e depurar.
  :::

- **Exemplo**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // a mutação das propriedades do próprio estado falhará
  state.foo++

  // ...mas funciona sobre objetos encaixados
  isReadonly(state.nested) // false

  // funciona
  state.nested.bar++
  ```

## `toRaw()` {#toraw}

Retorna o puro, objeto original duma delegação criada pela Vue.

- **Tipo**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **Detalhes**

  `toRaw()` pode retornar o objeto original a partir das delegações criadas por [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly ), [`shallowReactive()`](#shallowreactive) ou [`shallowReadonly()`](#shallowreadonly).

  Isto é uma escotilha de fuga que pode ser usada para ler temporariamente sem ficar sujeito ao acesso da delegação ou custos de rastreio ou escrever sem acionar mudanças. **Não** é recomendado segurar uma referência persistente ao objeto original. Use com cautela.

- **Exemplo**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## `markRaw()` {#markraw}

Marca um objeto para nunca ser convertido à uma delegação. Retorna o próprio objeto.

- **Tipo**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Exemplo**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // também funciona quando encaixado dentro dos outros objetos reativos
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning Use com Cautela
  `markRaw()` e as APIs superficiais tais como `shallowReactive()` permitem-nos abandonar seletivamente a conversão profunda reativa ou de somente leitura padrão e fixar objetos brutos não delegados no nosso grafo de estado. Eles podem ser usados ​​por várias razões:

  - Alguns valores simplesmente não deveriam ser reativos, por exemplo, uma instância de classe de terceiros complexa ou um objeto de componente Vue.

  - Ignorar a conversão de delegação pode fornecer melhorias de desempenho quando interpretamos grandes listas com fontes de dados imutáveis.

  Eles são considerados avançados porque o puro abandono é apenas ao nível de raiz, então se definirmos um objeto puro não marcado encaixado num objeto reativo e então acessá-lo novamente, recebemos de volta a versão delegada. Isto pode conduzir à **riscos de identidade** - por exemplo, executar uma operação que depende da identidade do objeto porém usando ambas a pura e versão delegada do mesmo objeto:


  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // apesar de `foo` ser marcada como pura, `foo.nested` não é.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Os riscos de identidade são em geral raros. No entanto, para usar adequadamente estas APIs enquanto evitar-se riscos de identidade com segurança exige um conhecimento sólido de como o sistema de reatividade funciona.

  :::

## `effectScope()` {#effectscope}

Cria um objeto de âmbito de efeito que pode capturar os efeitos reativos (por exemplo, propriedades computadas e observadores) criados dentro dela para que estes efeitos possam ser colocados juntos. Para casos de uso detalhados desta API, consulte seu [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) correspondente.

- **Tipo**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // `undefined` se o âmbito estiver inativo
    stop(): void
  }
  ```

- **Exemplo**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
  })

  // colocar todos efeitos no âmbito
  scope.stop()
  ```

## `getCurrentScope()` {#getcurrentscope}

Retorna o [âmbito de efeito](#effectscope) ativo atual, se existir um.

- **Tipo**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## `onScopeDispose()` {#onscopedispose}

Regista uma função de resposta de despacho no [âmbito de efeito](#effectscope) ativo atual. A função de resposta será invocada quando o âmbito de efeito associado for parado.

Este método pode ser usado como uma substituição não associada ao componente de `onUnmounted` nas funções de composição reutilizáveis, uma vez que a função `setup()` de cada componente da Vue também é invocada num âmbito de efeito.

- **Tipo**

  ```ts
  function onScopeDispose(fn: () => void): void
  ```
