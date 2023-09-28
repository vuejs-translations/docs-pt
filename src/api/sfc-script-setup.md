# `<script setup>` {#script-setup}

`<script setup>` é um açúcar sintático do tempo de compilação para o uso da API de Composições dentro dos Componentes de Ficheiro Único (isto é, `*.vue`). É a sintaxe recomendada se estivermos a usar ambos Componentes de Ficheiro Único e API de Composição. Ele fornece um número de vantagens sobre a sintaxe de `<script>` normal:

- Código mais sucinto com menos padrões
- Habilidade de declarar as propriedades e eventos emitidos usando TypeScript puro
- Melhor desempenho de tempo de execução (o modelo de marcação é compilado numa função de interpretação no mesmo âmbito de aplicação, sem uma delegação intermediária)
- Melhor desempenho de inferência de tipo do ambiente de desenvolvimento integrado (menos trabalho para o servidor de linguagem para extrair tipos a partir do código).

## Sintaxe Básica {#basic-syntax}

Para optar pela sintaxe, adicione o atributo `setup` ao bloco `<script>`:

```vue
<script setup>
console.log('hello script setup')
</script>
```

O código dentro é compilado como conteúdo da função `setup()` do componente. Isto significa que ao contrário do `<script>` normal, o qual é executado apenas uma vez quando o componente é importado primeiro, o código dentro de `<script setup>` **executará todas as vezes que uma instância do componente for criada**.

### Vínculos de Alto Nível são Expostos ao Modelo de Marcação {#top-level-bindings-are-exposed-to-template}

Quando usamos `<script setup>`, quaisquer vínculos de alto nível (incluindo variáveis, declarações de função e importações) declaradas dentro do `<script setup>` são diretamente usáveis no modelo de marcação:

```vue
<script setup>
// variável
const msg = 'Hello!'

// funções
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

As importações são expostas da mesma maneira. Isto significa que podemos usar diretamente uma função auxiliar importada nas expressões do modelo de marcação sem ter de a expor através da opção `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## Reatividade {#reactivity}

O estado reativo precisa de ser explicitamente criado usando as [APIs de Reatividade](./reactivity-core). Semelhante aos valores retornados a partir duma função `setup()`, as referências são automaticamente desembrulhadas quando referenciadas nos modelos de marcação:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Usando Componentes {#using-components}

Os valores no âmbito de `<script setup>` também podem ser usados diretamente como nomes de marcador de componente personalizados:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Pense de `MyComponent` como sendo referenciado como uma variável. Se usávamos JSX, neste contexto o modelo mental é semelhante. O `<my-component>` equivalente de caixa-espetada também funciona no modelo de marcação - no entanto os marcadores de componente de CaixaPascal são fortemente recomendados por fins de consistência. Também ajuda a diferenciar dos elementos personalizados nativos.

### Componentes Dinâmicos {#dynamic-components}

Uma vez que os componentes são referenciados como variáveis ao invés de registados sob chaves de sequência de caracteres, devemos usar o vínculo `:is` dinâmico quando usamos componentes dinâmicos dentro de `<script setup>`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Nota como os componentes podem ser usados como variáveis numa expressão de ternário.

### Componentes Recursivos {#recursive-components}

Um componente de ficheiro único pode referir-se a si mesmo implicitamente através do nome de ficheiro. Por exemplo, um ficheiro nomeado `FooBar.vue` pode referir-se a si mesmo como `<FooBar/>` no seu modelo de marcação.

Nota que isto tem prioridade menor do que os componentes importados. Se tivermos uma importação nomeada que entra em conflito com o nome inferido do componente, podemos definir um pseudónimo para a importação:

```js
import { FooBar as FooBarChild } from './components'
```

### Componentes de Nomes Espaçados {#namespaced-components}

Nós podemos usar marcadores de componente com pontos tal como `<Foo.Bar>` para referir-se aos componentes encaixados sob propriedades de objeto. Isto é útil quando importamos vários componentes a partir dum único ficheiro:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## Usando Diretivas Personalizadas {#using-custom-directives}

As diretivas personalizadas registadas globalmente funcionam exatamente como esperado. As diretivas personalizadas locais não precisam de ser explicitamente registadas com o `<script setup>`, mas devem seguir o esquema de nomeação `vNameOfDirective`:

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // fazer algo com o elemento
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

Se estivermos a importar uma diretiva a partir doutro lugar, pode ser renomeada para ajustar-se ao esquema de nomeação exigido:

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## `defineProps()` e `defineEmits()` {#defineprops-defineemits}

Para declarar opções tais como `props` e `emits` com o suporte total a inferência de tipo, podemos usar as APIs `defineProps` e `defineEmits`, as quais estão automaticamente disponíveis dentro do `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// código de configuração
</script>
```

- `defineProps` e `defineEmits` são **macros de compilador** utilizáveis apenas dentro de `<script setup>`. Eles não precisam de ser importados, e são compilados quando `<script setup>` é processado.

- `defineProps` aceita o mesmo valor que a opção `props`, enquanto `defineEmits` aceita o mesmo valor que a opção `emits`.

- `defineProps` e `defineEmits`  fornecem inferência de tipo adequada baseada nas opções passadas.

- As opções passadas às `defineProps` e `defineEmits` serão içadas para fora da configuração no âmbito do módulo. Portanto, as opções não podem referenciar as variáveis locais declaradas no âmbito de configuração. Fazer isto resultará num erro de compilação. No entanto, _pode_ referenciar vínculos importados uma vez que também estão no âmbito do módulo.

### Declarações de Propriedades ou Emissões de Tipo Exclusivo <sup class="vt-badge ts" data-text="typescript" /> {#type-only-props-emit-declarations}

As propriedades e emissões também podem ser declaradas usando a sintaxe de tipo pura passando um argumento de tipo literal à `defineProps` ou `defineEmits`:

```ts
const props = defineProps<{
  foo: string,
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void,
  (e: 'update', value: string): void
}>

// 3.3+: alternativa, sintaxe mais sucinta
const emit = defineEmits<{
  change: [id: number] // sintaxe de tupla nomeada
  update: [value: string]
}>
```

- `defineProps` ou `defineEmits` apenas pode usar ou a declaração de tempo de execução OU a declaração de tipo. Usar ambas ao mesmo tempo resultará num erro de compilação.

- Quando usamos a declaração de tipo, a declaração de tempo de execução equivalente é automaticamente gerada a partir da analise estática para remover a necessidade de dupla declaração e continuar a garantir comportamento de tempo de execução correto.

  - No modo de desenvolvimento, o compilador tentará inferir a validação de tempo de execução correspondente a partir dos tipos. Por exemplo `foo: String` é inferido a partir do tipo de `foo: string`. Se o tipo for uma referência à um tipo importado, o resultado inferido será `foo: null` (igual ao tipo `any`) uma vez que o compilador não tem a informação dos ficheiros externos.

  - No modo de produção, o compilador gerará o declaração de formato de vetor para reduzir o tamanho do pacote (as propriedades serão compiladas para `['foo', 'bar']`)

- Na versão 3.2 e para baixo, o parâmetro de tipo genérico para `defineProps()` estava limitado à um literal de tipo ou uma referência à uma interface local.

  Esta limitação tinha sido resolvida na 3.3. A versão mais recente da Vue suporta referência importada e um conjunto limitado de tipos complexos na posição do parâmetro de tipo. No entanto, uma vez que o tipo para a conversão de tempo de execução ainda é baseado na árvore de sintaxe abstrata, alguns tipos complexos que exigem de fato a analise de tipo, por exemplo tipos condicionais, não são suportados. Nós podemos usar os tipos condicionais para o tipo duma única propriedade, mas não para o objeto de propriedades inteiro.

### Valores de Propriedades Padrão Quando Usamos Declaração de Tipos {#default-props-values-when-using-type-declaration}

Uma desvantagem da declaração de `defineProps` de tipo exclusivo é que não tem uma maneira de fornecer valores padrão para as propriedades. Para resolver este problema, uma macro do compilador `withDefaults` também é fornecida:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'Hello',
  labels: () => ['one', 'two']
})
```

Isto será compilado às opções `default` de propriedades de tempo de execução equivalentes. Além disto, a auxiliar `withDefaults` fornece verificações de tipo para os valores padrão, e garante que o tipo de `props` retornado tenha as opções opcionais removidas para as propriedades que têm os valores padrão declarados.

## `defineExpose()` {#defineexpose}

Os componentes usando `<script setup>` estão **fechados por padrão** - isto quer dizer que, a instância pública do componente, a qual é recuperada através das referências do modelo de marcação ou cadeias de `$parent`, **não** exporão quaisquer vínculos declarados dentro do `<script setup>`.

Para expor explicitamente as propriedades num componente de `<script setup>`, usamos a macro do compilador `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

Quando um pai recebe uma instância deste componente através das referências do componente, a instância recuperada será da forma `{ a: number, b: number }` (as referências são automaticamente desembrulhadas tal como nas instâncias normais).

## `defineOptions()` {#defineoptions}

Esta macro pode ser usada para declarar opções de componente diretamente de dentro do `<script setup>` sem ter de usar um bloco `<script>` separado:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- Suportada apenas na 3.3+
- Isto é uma macro, As opções serão içadas para o âmbito de módulo e não podem acessar variáveis locais no `<script setup>` que não são constantes literais.

## `defineSlots()` <sup class="vt-badge ts" data-text="typescript" /> {#defineslots}

Esta macro pode ser usada para fornecer sugestões de tipo aos ambientes de desenvolvimento integrado para nome de ranhura e verificação de tipo de propriedades.

`defineSlots()` apenas aceita um parâmetro de tipo e nenhum argumento de tempo de execução. O parâmetro de tipo deve ser um literal de tipo onde a chave da propriedade é o nome da ranhura, e o tipo de valor é a função da ranhura. O primeiro argumento da função é o objeto de propriedades que a ranhura espera receber, e o seu tipo será usado para as propriedades da ranhura no modelo de marcação. O tipo de retorno é atualmente ignorado e pode ser `any`, mas podemos influenciá-lo para verificação do conteúdo da ranhura no futuro.

Esta também retorna o objeto `slots`, o qual é equivalente ao objeto `slots` exposto sobre o contexto de configuração ou retornado pela `useSlots()`:

```vue
<script setup>
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

- Suportada apenas na 3.3+

## `useSlots()` e `useAttrs()` {#useslots-useattrs}

O uso de `slots` e `attrs` dentro do `<script setup>` deve ser relativamente raro, uma vez que podemos acessá-los diretamente como `$slots` e `$attrs` no modelo de marcação. No caso raro onde de fato precisamos deles, usamos as auxiliares `useSlots` e `useAttrs` respetivamente:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` e `useAttrs` são de fato funções de tempo de execução que retornam o equivalente de `setupContext.slots` e `setupContext.attrs`. Elas também podem ser usadas nas funções da API de composição normais.

## Uso ao Lado do `<script>` Normal {#usage-alongside-normal-script}

`<script setup>` pode ser usado ao lado do `<script>` normal. Um `<script>` normal pode ser necessário nos casos onde precisamos de:

- Declarar opções que não podem ser expressadas no `<script setup>`, por exemplo `inheritAttrs` ou opções personalizadas ativadas através de extensões (Pode ser substituído pela [`defineOptions`](/api/sfc-script-setup#defineoptions) na 3.3+).
- Declarar exportações nomeadas
- Executar efeitos colaterais ou criar objetos que apenas devem executar uma vez.

```vue
<script>
// <script> normal, executado no âmbito de módulo (apenas uma vez)
runSideEffectsOnce()

// declarar opções adicionais
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// executado no âmbito da `setup()` (para cada instância)
</script>
```

O suporte para combinação de `<script setup>` e `<script>` no mesmo componente está limitado aos cenários descritos acima. Especificamente:

- **NÃO** usar uma seção `<script>` separada para opções que já podem ser definidas usando `<script setup>`, tais como `props` e `emits`.
- As variáveis criadas dentro do `<script setup>` não são adicionadas como propriedades à instância do componente, tornando-as inacessíveis a partir da API de Opções. Misturar APIs desta maneira é fortemente desencorajado.

Se encontramos-nos em um dos cenários que não é suportado devemos considerar mudar para uma função [`setup()`](/api/composition-api-setup) explícita, ao invés de usar `<script setup>`.

## `await` de Alto Nível {#top-level-await}

A `await` de alto nível pode ser usada dentro do `<script setup>`. O código resultante será compilado tal como `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

Além disto, a expressão esperada será automaticamente compilada num formato que preserva o contexto da instância do componente atual depois de `await`.

:::warning NOTA
`async setup()` deve ser usado em conjunto com o `Suspense`, o qual atualmente ainda é uma funcionalidade experimental. Nós planeamos finalizar e documentá-lo num futuro lançamento - mas se agora estivermos curiosos, podemos consultar os seus [testes](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) para sabermos como funciona.
:::

## Genéricos <sup class="vt-badge ts" data-text="typescript" /> {#generics}

Os parâmetros de tipo genérico podem ser declarados usando o atributo `generic` sobre o marcador `<script>`:

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

O valor de `generic` funciona exatamente como a lista de parâmetro entre `<...>` na TypeScript. Por exemplo, podemos usar vários parâmetros, restrições de `extends`, tipos padrão, e referenciar tipos importados:

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

## Restrições {#restrictions}

Por causa da diferença nas semânticas da execução do módulo, o código dentro do `<script setup>` depende do contexto dum componente de ficheiro único. Quando movido para ficheiros `.js` ou `.ts` externos, pode conduzir à confusão para ambos programadores e ferramentas. Portanto, **`<script setup>`** não pode ser usada com o atributo `src`.
