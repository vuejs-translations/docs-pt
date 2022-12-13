# TypeScript com a API de Composição {#typescript-with-composition-api}

> Esta página presume que já leste a visão geral no [Utilizando a Vue com a TypeScript](./overview).

## Atribuindo Tipos as Propriedades do Componente {#typing-component-props}

### Utilizando `<script setup>` {#using-script-setup}

Quando estiveres utilizando `<script setup>`, a macro `defineProps()` suporta a inferência de tipos de propriedades baseado no seu argumento:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Isto é chamado de "declaração de tempo de execução", porque o argumento passado para `defineProps()` será utilizado como opção `props` de tempo de execução.

No entanto, é normalmente mais direto definir as propriedades com os tipos puros através de um argumento de tipo genérico:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Isto é chamado "declaração baseada em tipo". O compilador tentará fazer o seu melhor para inferir as opções de tempo de execução equivalente baseado no argumento de tipo. Neste caso, o nosso segundo exemplo compila para as exatas mesmas opções de tempo de execução que as do primeiro exemplo.

Tu podes utilizar ou a declaração baseada em tipo OU a declaração de tempo de execução, mas não podes utilizar ambas ao mesmo tempo.

Nós podemos também mover as tipos das propriedades para uma interface separada:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

#### Limitações de Sintaxe {#syntax-limitations}

Para gerar o código de tempo de execução correto, o argumento genérico para `defineProps()` deve ser um dos seguintes:

- Um tipo literal de objeto:

  ```ts
  defineProps<{ /*... */ }>()
  ```

- Um referência para um interface ou tipo literal de objeto **no mesmo ficheiro**:

  ```ts
  interface Props {/* ... */}

  defineProps<Props>()
  ```

A interface ou tipo literal de objeto pode conter referências para os tipos importados de outros ficheiros, no entanto, o próprio argumento genérico passado para `defineProps` **não pode** ser um tipo importado:

```ts
import { Props } from './other-file'

// NÃO suportado
defineProps<Props>()
```

Isto é porque os componentes de Vue são compilados separadamente e o compilador atualmente não rastreia os ficheiros importados para analisar o tipo da fonte. Esta limitação poderia ser removida em um futuro lançamento.

### Valores Padrão das Propriedades {#props-default-values}

Quando estamo a usar a declaração baseada no tipo, perdemos a habilidade de declarar valores padrão para as propriedades. Isto pode ser resolvido pela macro `withDefaults` do compilador:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

Isto será compilado para as opções `default` das propriedades de tempo de execução equivalentes. Além disto, o auxiliar `withDefaults` fornece verificação de tipo para os valores padrão, e garante que os tipo de `props` retornado tenha opções opcionais removidas para as propriedades que tiverem valores padrão declarados.

Alternativamente, podes usar a atualmente experimental [Transformação da Reatividade](/guide/extras/reactivity-transform.html):

```vue
<script setup lang="ts">
interface Props {
  name: string
  count?: number
}

// desestruturação reativa para defineProps()
// valor padrão é compilado para a opção de tempo de execução equivalente
const { name, count = 100 } = defineProps<Props>()
</script>
```

Este comportamento atualmente requer [opção de inclusão explícita](/guide/extras/reactivity-transform.html#explicit-opt-in).

### Sem `<script setup>` {#without-script-setup}

Se não estiveres utilizando `<script setup>`, é necessário utilizar `defineComponent()` para ativar a inferência de tipo das propriedades. O tipo do objeto de propriedades passadas para `setup()` é inferida a partir da opção `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- type: string
  }
})
```

## Atribuindo Tipos as Emissões do Componente

No `<script setup>`, o tipo da função `emit` pode também ser atribuindo utilizando ou a declaração de tempo de execução OU a declaração de tipo:

```vue
<script setup lang="ts">
// tempo de execução (runtime)
const emit = defineEmits(['change', 'update'])

// baseada em tipo (type-based)
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

O argumento de tipo deve ser um literal de tipo com [Assinaturas de Chamada](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). O literal de tipo será utilizado como tipo da função `emit` retornada. Conforme podemos ver, a declaração de tipo dá-nos o controlo mais refinado sobre as restrições do tipo dos eventos emitidos.

Quando não se está utilizando `<script setup>`, a `defineComponent()` é capaz de inferir os eventos permitidos para a função `emit` exposta sobre o contexto da configuração (ou `setup` se preferires):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- verificação de tipo / conclusão automática
  }
})
```

## Atribuindo Tipo ao `ref()` {#typing-ref}

As referências inferem o tipo a partir do valor inicial:

```ts
import { ref } from 'vue'

// tipo inferido: Ref<number>
const year = ref(2020)

// => Erro de TypeScript: tipo 'string' não é atribuível ao tipo 'number'.
year.value = '2020'
```

Algumas vezes podemos precisar especificar os tipos complexos para um valor interno da referência. Nós podemos fazer isto utilizando o tipo `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Ou, passando um argumento genérico quando estiveres chamando a `ref()` para sobrepor a inferência padrão:

```ts
// tipo resultante: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Se especificares um argumento de tipo genérico mas omitir o valor inicial, o tipo resultante será um tipo de união que inclui `undefined`:

```ts
// tipo inferido: Ref<number | undefined>
const n = ref<number>()
```

## Atribuindo Tipo ao `reactive()` {#typing-reactive}

A `reactive()` também infere implicitamente o tipo a partir do seu argumento:

```ts
import { reactive } from 'vue'

// tipo inferido: { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

Para explicitamente tipar uma propriedade de `reactive`, podes utilizar as inferências:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip Dica
Não é recomendado utilizar o argumento genérico da `reactive()` porque o tipo retornado, o qual manipula o desembrulhar da referência encaixada, é diferente do tipo do argumento genérico.
:::

## Atribuindo Tipo ao `computed()` {#typing-computed}

A `computed()` infere o seu tipo baseado no valor de retorno do recuperador (ou getter se preferires):

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// tipo inferido: ComputedRef<number>
const double = computed(() => count.value * 2)

// => Erro de TypeScript: A propriedade 'split' não existe no tipo 'number'
const result = double.value.split('')
```

Tu podes também especificar um tipo explícito através de um argumento genérico:

```ts
const double = computed<number>(() => {
  // erro de tipo se isto não retornar um número
})
```

## Atribuindo Tipos aos Manipuladores de Evento {#typing-event-handlers}

Quando estiveres lidando com eventos de DOM nativo, pode ser útil definir tipo para o argumento que passamos para o manipulador corretamente. Vamos dar um vista de olhos neste exemplo:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` tem implicitamente o tipo `any`
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Sem a anotação de tipo, o argumento `event` terá implicitamente um tipo de `any`. Isto também resultará em um erro de TypeScript se `"strict": true` ou `"noImplicitAny": true` forem utilizados no `tsconfig.json`. É portanto recomendado anotar explicitamente o argumento dos manipuladores de evento. Além disto, podes precisar lançar as propriedades sobre o `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Atribuindo Tipo ao `provide()` / `inject()` {#typing-provide-inject}

O fornecer e injetar são normalmente realizados em componentes separados. Para corretamente definir os tipos dos valores injetados, a Vue fornece uma interface `InjectionKey`, que é um tipo genérico que estende o `Symbol`. Ela pode ser utilizada para sincronizar o tipo do valor injetado entre o fornecedor e o consumidor:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // fornecer valor que não uma sequência de caracteres resultará em erro

const foo = inject(key) // tipo de foo: string | undefined
```

É recomendado colocar a chave de injeção em um ficheiro separado para ela possa ser importada em vários componentes.

Quando estiveres utilizando as chaves de injeção de sequência de caracteres, o tipo do valor injetado serão `unknown`, e precisarão ser explicitamente declarados através de um argumento de tipo genérico:

```ts
const foo = inject<string>('foo') // type: string | undefined
```

Repara que o valor injetado pode ainda ser `undefined`, porque não existe garantia de que um fornecedor fornecerá este valor no tempo de execução.

Os tipos `undefined` podem ser removidos fornecendo um valor padrão:

```ts
const foo = inject<string>('foo', 'bar') // type: string
```

Se estiveres certo de que o valor é sempre fornecido, podes também forçar o lançamento do valor:

```ts
const foo = inject('foo') as string
```

## Atribuindo Tipos as Referências do Modelo de Marcação {#typing-template-refs}

As referências de modelo de marcação devem ser criadas com um argumento de tipo genérico explícito e um valor inicial de `null`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

Nota que para a segurança de tipo restrito, é necessário utilizar o encadeamento opcional ou sentinelas de tipo quando estiveres acessando `el.value`. Isto é porque o valor da referência inicial é `null` até o componente ser montado, e também pode ser definido para `null` se o elemento referenciado for desmontado pelo `v-if`.

## Atribuindo Tipos as Referências do Modelo de Marcação de Componente {#typing-component-template-refs}

Algumas vezes podes precisar anotar uma referência de modelo de marcação para um componente filho para chamar o seu método público. Por exemplo, temos um componente filho `MyModal` com um método que abre o modal:

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```

Para receber o tipo da instância de `MyModal`, precisamos primeiro recuperar o seu tipo através de `typeof`, depois utilizar o utilitário `InstanceType` embutido da TypeScript para extrair o tipo da sua instância:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

Nota que se quiseres utilizar esta técnica nos ficheiros de TypeScript dos Componentes de Ficheiro Único de Vue, precisamos ativar o [Modo de Aquisição (Takeover Mode)](./overview.html#volar-takeover-mode) da Volar.
