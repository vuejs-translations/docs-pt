# TypeScript com a API de Composição {#typescript-with-composition-api}

> Esta página presume que já leste a visão geral no [Usando a Vue com a TypeScript](./overview).

## Tipos para as Propriedades do Componente {#typing-component-props}

### Usando `<script setup>` {#using-script-setup}

Quando estivermos a usar o `<script setup>`, a macro `defineProps()` suporta a inferência de tipos de propriedades baseado no seu argumento:

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

Nós podemos usar ou a declaração baseada em tipo OU a declaração de tempo de execução, mas não podemos usar ambas ao mesmo tempo.

Nós podemos também mover os tipos das propriedades para uma interface separada:

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

Na versão 3.2 e abaixo, o parâmetro de tipo genérico para `defineProps()` estavam limitados à um literal de tipo ou uma referência à uma inferência local.

Esta limitação tinha sido resolvida na 3.3, A versão mais recente da Vue suporta a referência dum conjunto importado e limitado de tipos complexos na posição do parâmetro de tipo. No entanto, uma vez que o tipo para conversão de tempo de execução ainda é baseado na Árvore de Sintaxe Abstrata, alguns tipos complexos que exigem a analise do tipo verdadeiro, por exemplo, tipos condicionais, não são suportados. Nós podemos usar os tipos condicionais para o tipo duma única propriedade, mas não para objeto de propriedades inteira.

### Valores Padrão das Propriedades {#props-default-values}

Quando estamos a usar a declaração baseada no tipo, perdemos a habilidade de declarar valores padrão para as propriedades. Isto pode ser resolvido pela macro `withDefaults` do compilador:

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

Isto será compilado para as opções `default` das propriedades de tempo de execução equivalentes. Além disto, a auxiliar `withDefaults` fornece verificação de tipo para os valores padrão, e garante que os tipo de `props` retornado tenha opções opcionais removidas para as propriedades que tiverem valores padrão declarados.

### Sem `<script setup>` {#without-script-setup}

Se não estivermos a usar `<script setup>`, é necessário usar `defineComponent()` para ativar a inferência de tipo das propriedades. O tipo do objeto das propriedades passadas para `setup()` é inferida a partir da opção `props`.

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

### Tipos de Propriedades Complexas {#complex-prop-types}

Com a declaração baseada no tipo, uma propriedade pode usar um tipo complexo tal como qualquer outro tipo:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Para a declaração de tempo de execução, podemos usar o tipo utilitário `PropType`:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Isto funciona exatamente da mesma maneira se estivéssemos a especificar a opção `props` diretamente:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

A opção `props` é mais comummente usada com a API de Opções, então encontrarás exemplos mais detalhados no guia para [TypeScript com a API de Opções](/guide/typescript/options-api#typing-component-props). As técnicas mostradas nestes exemplos também aplicam-se as declarações de tempo de execução usando `defineProps()`.

## Tipos para as Emissões do Componente {#typing-component-emits}

No `<script setup>`, o tipo da função `emit` também pode ser atribuído usando ou a declaração de tempo de execução OU a declaração de tipo:

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

O argumento de tipo deve ser um literal de tipo com [Assinaturas de Chamada](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). O literal de tipo será usado como tipo da função `emit` retornada. Conforme podemos ver, a declaração de tipo dá-nos o controlo mais refinado sobre as restrições do tipo dos eventos emitidos.

Quando não se está utilizando `<script setup>`, a `defineComponent()` é capaz de inferir os eventos permitidos para a função `emit` exposta sobre o contexto da configuração:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- verificação de tipo / conclusão automática
  }
})
```

## Tipos para a `ref()` {#typing-ref}

As referências inferem o tipo a partir do valor inicial:

```ts
import { ref } from 'vue'

// tipo inferido: Ref<number>
const year = ref(2020)

// => Erro de TypeScript: tipo 'string' não é atribuível ao tipo 'number'.
year.value = '2020'
```

Algumas vezes podemos precisar de especificar os tipos complexos para um valor interno da referência. Nós podemos fazer isto usando o tipo `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Ou, passando um argumento genérico quando estivermos chamando a `ref()` para sobrepor a inferência padrão:

```ts
// tipo resultante: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Se especificarmos um argumento de tipo genérico mas omitirmos o valor inicial, o tipo resultante será um tipo de união que inclui `undefined`:

```ts
// tipo inferido: Ref<number | undefined>
const n = ref<number>()
```

## Tipos para a `reactive()` {#typing-reactive}

A `reactive()` também infere implicitamente o tipo a partir do seu argumento:

```ts
import { reactive } from 'vue'

// tipo inferido: { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

Para atribuir tipos explicitamente para uma propriedade de `reactive`, podemos usar as inferências:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip DICA
Não é recomendado usar o argumento genérico da `reactive()` porque o tipo retornado, o qual manipula o desembrulhar da referência encaixada, é diferente do tipo do argumento genérico.
:::

## Tipos para a `computed()` {#typing-computed}

A `computed()` infere o seu tipo baseado no valor de retorno do recuperador:

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// tipo inferido: ComputedRef<number>
const double = computed(() => count.value * 2)

// => Erro de TypeScript: A propriedade 'split' não existe no tipo 'number'
const result = double.value.split('')
```

Nós podemos também especificar um tipo explícito através de um argumento genérico:

```ts
const double = computed<number>(() => {
  // erro de tipo se isto não retornar um número
})
```

## Tipos para os Manipuladores de Evento {#typing-event-handlers}

Quando estivermos a lidar com eventos de DOM nativo, pode ser útil definir o tipo para o argumento que passamos para o manipulador corretamente. Daremos uma vista de olhos neste exemplo:

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

Sem a anotação de tipo, o argumento `event` terá implicitamente um tipo de `any`. Isto também resultará num erro de TypeScript se `"strict": true` ou `"noImplicitAny": true` forem utilizados no `tsconfig.json`. É portanto recomendado anotar explicitamente o argumento dos manipuladores de evento. Além disto, podemos precisar de usar as asserções de tipo quando acessamos as propriedades de  `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Tipos para `provide()` / `inject()` {#typing-provide-inject}

O fornecimento e a injeção são normalmente realizadas em componentes separados. Para corretamente definir os tipos dos valores injetados, a Vue fornece uma interface `InjectionKey`, que é um tipo genérico que estende o `Symbol`. Este pode ser usado para sincronizar o tipo do valor injetado entre o fornecedor e o consumidor:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

// fornecer valor que não é uma sequência de caracteres resultará em erro
provide(key, 'foo')

const foo = inject(key) // tipo de foo: string | undefined
```

É recomendado colocar a chave de injeção num ficheiro separado para que possa ser importada em vários componentes.

Quando estivermos usando as chaves de injeção de sequência de caracteres, o tipo do valor injetado será `unknown`, e precisará ser explicitamente declarados através dum argumento de tipo genérico:

```ts
const foo = inject<string>('foo') // type: string | undefined
```

Repara que o valor injetado ainda pode ser `undefined`, porque não existe garantia de que um fornecedor fornecerá este valor no tempo de execução.

Os tipos `undefined` podem ser removidos fornecendo um valor padrão:

```ts
const foo = inject<string>('foo', 'bar') // type: string
```

Se estivermos certos de que o valor é sempre fornecido, podemos também forçar o lançamento do valor:

```ts
const foo = inject('foo') as string
```

## Tipos para as Referências do Modelo de Marcação {#typing-template-refs}

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

Nota que para a segurança de tipo restrito, é necessário usar o encadeamento opcional ou guardas de tipo quando estivermos acessando `el.value`. Isto é porque o valor da referência inicial é `null` até o componente ser montado, e também pode ser definido para `null` se o elemento referenciado for desmontado pelo `v-if`.

## Tipos para Referências do Modelo de Marcação do Componente {#typing-component-template-refs}

Algumas vezes podemos precisar anotar uma referência de modelo de marcação para um componente filho para chamar o seu método público. Por exemplo, temos um componente filho `MyModal` com um método que abre o modal:

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

Para receber o tipo da instância de `MyModal`, precisamos primeiro recuperar o seu tipo através de `typeof`, depois usar o utilitário `InstanceType` embutido da TypeScript para extrair o tipo da sua instância:

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

Nota que se quiseres utilizar esta técnica nos ficheiros de TypeScript dos Componentes de Ficheiro Único de Vue, precisamos ativar o [Modo de Aquisição](./overview.html#volar-takeover-mode) da Volar.

Nos casos onde o tipo exato do componente não estiver disponível ou não for importante, `ComponentPublicInstance` pode ser usado. Isto apenas incluirá as propriedades que são partilhadas por todos os componentes, tais como `$el`:

```ts
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = ref<ComponentPublicInstance | null>(null)
```
