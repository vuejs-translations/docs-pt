# \<script setup> {#script-setup}

`<script setup>` é um facilitador sintático em tempo de compilação para usar a API de Composição dentro de Componentes de Arquivo Único (SFCs). É a sintaxe recomendada se você está usando SFCs e a API de Composição.  Ele fornece uma série de vantagens sobre a sintaxe normal do `<script>`:

- Código mais sucinto com menos _boilerplate_
- Capacidade de declarar propriedades e eventos emitidos usando TypeScript puro
- Melhor desempenho em tempo de execução (o modelo é compilado em uma função _render_ no mesmo escopo, sem um _proxy_ intermediário)
- Melhor desempenho de inferência de tipo na IDE (menos trabalho para o servidor de linguagem extrair tipos de código)

## Sintaxe Básica {#basic-syntax}

Para ativar a sintaxe, adicione o atributo `setup` ao bloco `<script>`:

```vue
<script setup>
console.log('olá script setup')
</script>
```

O código em seu interior é compilado como o conteúdo da função `setup()` do componente. Isso significa que, diferentemente do `<script>` normal, que é executado apenas uma vez quando o componente é inicialmente importado, o código dentro do `<script setup>` será **executado toda vez que uma instância do componente for criada**.

### Vínculações de Nível Superior são expostas ao modelo {#top-level-bindings-are-exposed-to-template}

Ao usar `<script setup>`, quaisquer vínculações de nível superior (incluindo variáveis, declarações de função e importações) declaradas dentro de `<script setup>` podem ser usadas diretamente no modelo:

```vue
<script setup>
// variável
const msg = 'Olá!'

// funções
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

Importações são expostas da mesma maneira. Isso significa que você pode usar diretamente uma função auxiliar importada em expressões de modelo sem precisar expô-la através da opção `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## Reatividade {#reactivity}

O estado reativo precisa ser criado explicitamente usando [APIs de Reatividade](./reactivity-core.html). Semelhante aos valores retornados de uma função `setup()`, refs são automaticamente desembrulhadas quando referenciados em modelos:

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

Valores no escopo de `<script setup>` também podem ser usados ​​diretamente como nomes de identificadoers de componentes personalizados:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Pense em `MyComponent` sendo referenciado como uma variável. Se você usou JSX, o modelo mental é semelhante aqui. O equivalente kebab-case `<my-component>` também funciona no modelo - no entanto, as tags de componente PascalCase são fortemente recomendadas para consistência. Também ajudam a diferenciar de elementos nativos personalizados.

### Componentes Dinâmicos {#dynamic-components}

Como os componentes são referenciados como variáveis ​​em vez de registrados sob chaves string, devemos usar a vinculação dinâmica `:is` ao usar componentes dinâmicos dentro de `<script setup>`:

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

Observe como os componentes podem ser usados ​​como variáveis ​​em uma expressão ternária.

### Componentes Recursivos {#recursive-components}

Um SFC pode implicitamente referir-se a si próprio por meio de seu nome de arquivo. Por exemplo, um arquivo chamado `FooBar.vue` pode referir-se a si mesmo com `<FooBar/>` em seu modelo.

Note que isso tem prioridade menor do que os componentes importados. Se você tiver uma importação nomeada que conflite com o nome inferido do componente, você pode usar um psuedônimo na importação:

```js
import { FooBar as FooBarChild } from './components'
```

### Componentes Namespaced {#namespaced-components}

Você pode usar identificadores de componentes com pontos como `<Foo.Bar>` para se referir aos componentes aninhados nas propriedades de objeto. Isso é útil quando você importa múltiplos componentes de um único arquivo:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>etiqueta</Form.Label>
  </Form.Input>
</template>
```

## Usando Diretivas Personalizadas {#using-custom-directives}

As diretivas personalizadas registradas globalmente funcionam como esperado. Diretivas personalizadas locais não precisam ser registradas explicitamente com `<script setup>`, mas elas precisam seguir o esquema de nomeação `vNameOfDirective`:

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // faz algo com o elemento
  }
}
</script>
<template>
  <h1 v-my-directive>Isto é um Cabeçalho</h1>
</template>
```

Se você estiver importando a diretiva de outro lugar, ela pode ser renomeada para se adequar ao esquema de nomeação exigido:

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() e defineEmits() {#defineprops-defineemits}

Para declarar opções como `props` e `emits` com suporte completo a inferência de tipos, podemos usar as APIs `defineProps` e `defineEmits`, que estão automaticamente disponíveis dentro do `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// código de configuração
</script>
```

- `defineProps` e `defineEmits` são **macros de compilador** utilizáveis apenas dentro de `<script setup>`. Eles não precisam ser importados e são compilados quando `<script setup>` é processado.

- `defineProps` aceita o mesmo valor que a opção `props`, enquanto `defineEmits` aceita o mesmo valor que a opção `emits`.

- `defineProps` e `defineEmits`  fornecem inferência de tipo adequada com base nas opções passadas.

- As opções passadas para `defineProps` e `defineEmits` serão elevadas para fora do _setup_ no escopo do módulo. Portanto, as opções não podem referenciar variáveis ​​locais declaradas no escopo do _setup_. Fazer isso resultará em um erro de compilação. No entanto, pode se referenciar a vinculações importadas pois elas também estão no escopo do módulo.

Se você estiver usando TypeScript, também é possível [declarar props e emits usando anotações puras de tipo](#typescript-only-features).

## defineExpose() {#defineexpose}

Componentes usando `<script setup>` são **fechados por padrão** - ou seja, a instância pública do componente, que é obtida por refs do modelo ou cadeias `$parent`, **não** irá expor qualquer vinculação declarada dentro de `<script setup>`.

Para expor explicitamente propriedades em um componente `<script setup>`, use o macro de compilação `defineExpose`:

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

Quando um pai busca uma instância deste componente via refs de modelo, a instância obtida terá a forma  `{ a: number, b: number }` (refs são automaticamente desembrulhadas como em instâncias normais).

## `useSlots()` e `useAttrs()` {#useslots-useattrs}

O uso de `slots` e `attrs` dentro de `<script setup>` deve ser relativamente raro, já que você pode acessá-los diretamente com `$slots` e `$attrs` no modelo. No caso raro em que você precisar deles, use os auxiliares `useSlots` e `useAttrs` respectivamente:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` e `useAttrs` são funções em tempo de execução reais que retornam o equivalente de `setupContext.slots` e `setupContext.attrs`. Eles também podem ser usados ​​em funções normais da API de Composição.

## Usando junto ao usual `<script>` {#usage-alongside-normal-script}

`<script setup>` pode ser usado junto com o usual `<script>`. Um `<script>` normal pode ser necessário nos casos em que você precisa:

- Declarar opções que não podem ser expressas em `<script setup>`, por exemplo `inheritAttrs` ou opções personalizadas habilitadas por plugins.
- Declarar exportações nomeadas.
- Realizar efeitos colaterais ou criar objetos que devem executar uma única vez.

```vue
<script>
// <script> normal, executado no escopo do módulo (apenas uma vez)
runSideEffectOnce()

// declara opções adicionais
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// executado no escopo setup() (para cada instância)
</script>
```

O suporte para combinar `<script setup>` e `<script>` no mesmo componente é limitado aos cenários descritos acima. Especificamente:

- **NÃO** use uma seção de `<script>` separada para opções que já podem ser definidas usando `<script setup>`, como `props` e `emits`.
- Variáveis criadas dentro de `<script setup>` não são adicionadas como propriedades na instância do componente, tornando-as inacessíveis para API de Opções. Misturar as APIs dessa maneira é fortemente desencorajado.

Se você se encontrar em um dos cenários que não é suportado, então você deve considerar mudar para uma função [`setup()`](/api/composition-api-setup.html) explícita, em vez de usar `<script setup>`.

## `await` em nível superior {#top-level-await}

`await` em nível superior pode ser usado dentro de `<script setup>`. O código resultante será compilado como `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

Além disso, a expressão aguardada será compilada automaticamente em um formato que preserva o contexto da instância do componente atual após o `await`.

:::warning Note
`async setup()` deve ser usado em combinação com `Suspense`, o qual atualmente é ainda um recurso experimental. Planejamos finalizá-lo e documentá-lo em um lançamento futuro - mas se você estiver curioso agora, você pode consultar seus [testes](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) para ver como funciona.
:::

## Funcionalidades exclusivas TypeScript <sup class="vt-badge ts" /> {#typescript-only-features}

### Declaracões de tipo exclusivas de props/emit {#type-only-props-emit-declarations}

Props e emits também podem ser declaradas usando uma sintaxe de tipos pura ao passar um argumento de tipo literal para `defineProps` ou `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

- `defineProps` ou `defineEmits` podem usar apenas declaração em tempo de execução OU declaração de tipo. Usar ambos ao mesmo tempo resultará em um erro de compilação.

- Ao usar a declaração de tipo, a declaração em tempo de execução equivalente é gerada automaticamente a partir da análise estática para eliminar a necessidade de declaração dupla e ainda garantir o comportamento correto em tempo de execução.

  - No modo dev, o compilador tentará inferir a validação em tempo de execução correspondente a partir dos tipos. Por exemplo, aqui `foo: String` é inferido do tipo de `foo: string`. Se o tipo é uma referência de um tipo importado, o resultado inferido será `foo: null` (igual ao tipo `any`) já que o compilador não possui informações de arquivos externos.

  - No modo de produção, o compilador gerará a declaração em formato de array para reduzir o tamanho do pacote (as props aqui serão compiladas em `['foo', 'bar']`)

  - O código emitido ainda é TypeScript com tipagem válida, o qual pode ser processado posteriormente por outras ferramentas.

- A partir de agora, o argumento de declaração de tipo deve ser um dos seguintes para garantir a análise estática correta:

  - Um literal de tipo
  - Uma referência a uma interface ou um literal de tipo no mesmo arquivo

  Atualmente, tipos complexos e importações de tipos de outros arquivos não são suportados. É possível suportar importações de tipo no futuro.

### Valores padrão de props ao usar declaração de tipo {#default-props-values-when-using-type-declaration}

Uma desvantagem da declaração exclusiva de tipo `defineProps` é que ela não tem uma maneira de fornecer valores padrão para as props. Para resolver este problema, uma macro do compilador `withDefaults` também é fornecido:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'olá',
  labels: () => ['um', 'dois']
})
```

Isto será compilado como opções `default` em tempo de execução equivalentes. Além disso, o auxiliar `withDefaults` fornece verificações de tipo para os valores padrão, e garante que o tipo de `props` retornado tenha os sinalizadores opcionais removidos para propriedades que possuem valores padrão declarados.

## Restrições {#restrictions}

Devido à diferença na semântica de execução do módulo, o código dentro de `<script setup>` depende do contexto de um SFC. Quando movido para arquivos externos `.js` ou `.ts`, pode causar confusão tanto para desenvolvedores quanto para ferramentas. Portanto, **`<script setup>`** não pode ser usado com o atributo `src`.
