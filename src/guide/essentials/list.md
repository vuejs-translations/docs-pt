# Interpretação de Lista {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Aula Gratuida Sobre Interpretação de Lista em Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Aula Gratuida Sobre Interpretação de Lista em Vue.js"/>
</div>

## `v-for` {#v-for}

Nós podemos utilizar a diretiva `v-for` para interpretar uma lista de itens baseados em um arranjo. A diretiva `v-for` exije uma sintaxe especial na forma de `item in items`, onde `items` é o arranjo de dados de origem e o `item` é um **pseudónimo** para o elemento do arranjo sobre qual é interado:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

Dentro do escopo de `v-for`, as expressões do modelo de marcação tem acesso a todas propriedades do escopo do pai. Além disto, a `v-for` também suporta um segundo pseudónimo opcional para índice do item atual:

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgcGFyZW50TWVzc2FnZSA9IHJlZignUGFyZW50JylcbmNvbnN0IGl0ZW1zID0gcmVmKFt7IG1lc3NhZ2U6ICdGb28nIH0sIHsgbWVzc2FnZTogJ0JhcicgfV0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8bGkgdi1mb3I9XCIoaXRlbSwgaW5kZXgpIGluIGl0ZW1zXCI+XG4gIFx0e3sgcGFyZW50TWVzc2FnZSB9fSAtIHt7IGluZGV4IH19IC0ge3sgaXRlbS5tZXNzYWdlIH19XG5cdDwvbGk+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgXHRyZXR1cm4ge1xuXHQgICAgcGFyZW50TWVzc2FnZTogJ1BhcmVudCcsXG4gICAgXHRpdGVtczogW3sgbWVzc2FnZTogJ0ZvbycgfSwgeyBtZXNzYWdlOiAnQmFyJyB9XVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGxpIHYtZm9yPVwiKGl0ZW0sIGluZGV4KSBpbiBpdGVtc1wiPlxuICBcdHt7IHBhcmVudE1lc3NhZ2UgfX0gLSB7eyBpbmRleCB9fSAtIHt7IGl0ZW0ubWVzc2FnZSB9fVxuXHQ8L2xpPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

O escopo de variável da `v-for` é similar ao seguinte código de JavaScript:

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // tem acesso ao `parentMessage` do escopo externo 
  // mas `item` e `index` apenas estão disponíveis aqui
  console.log(parentMessage, item.message, index)
})
```

Repare como o valor de `v-for` corresponde a assinatura de função da resposta de `forEach`. Na realidade, podes utilizar a desestruturação no pseudónimo do item de `v-for` similar a desestruturação de argumentos de função:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- with index alias -->
<!-- com o pseudónimo de índice ("index") -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

Para `v-for` encaixados, o escopo também funciona de maneira similar as funções encaixadas. Cada escope de `v-for` em acesso aos escopos pai:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

Tu também podes utilizar `of` como delimitador no lugar de `in`, para que esteja mais próximo da sintaxe da JavaScript para iteradores:

```vue-html
<div v-for="item of items"></div>
```

## `v-for` com um Objeto {#v-for-with-an-object}

Tu também podes utilizar a `v-for` para iterar através das propriedades de um objeto. A ordem de iteração será baseada no resultado da chamada de `Object.keys()` sobre o objeto:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

Tu também podes fornecer um segundo pseudónimo para o nome da propriedade (também conhecido como chave):

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

E um outro para o índice:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBteU9iamVjdCA9IHJlYWN0aXZlKHtcbiAgdGl0bGU6ICdIb3cgdG8gZG8gbGlzdHMgaW4gVnVlJyxcbiAgYXV0aG9yOiAnSmFuZSBEb2UnLFxuICBwdWJsaXNoZWRBdDogJzIwMTYtMDQtMTAnXG59KVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PHVsPlxuICAgIDxsaSB2LWZvcj1cIih2YWx1ZSwga2V5LCBpbmRleCkgaW4gbXlPYmplY3RcIj5cblx0XHQgIHt7IGluZGV4IH19LiB7eyBrZXkgfX06IHt7IHZhbHVlIH19XG5cdFx0PC9saT5cbiAgPC91bD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgXHRyZXR1cm4ge1xuXHQgICAgbXlPYmplY3Q6IHtcbiAgXHQgICAgdGl0bGU6ICdIb3cgdG8gZG8gbGlzdHMgaW4gVnVlJyxcblx0ICAgICAgYXV0aG9yOiAnSmFuZSBEb2UnLFxuICAgICAgXHRwdWJsaXNoZWRBdDogJzIwMTYtMDQtMTAnXG4gICAgXHR9XG4gIFx0fVxuXHR9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8dWw+XG4gICAgPGxpIHYtZm9yPVwiKHZhbHVlLCBrZXksIGluZGV4KSBpbiBteU9iamVjdFwiPlxuXHRcdCAge3sgaW5kZXggfX0uIHt7IGtleSB9fToge3sgdmFsdWUgfX1cblx0XHQ8L2xpPlxuICA8L3VsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

## `v-for` com um Limite {#v-for-with-a-range}

A `v-for` também pode aceitar um inteiro. Neste caso repetirá o modelo de marcação que aquelas muitas vezes, baseado em um limite de `1...n`.

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Nota que aqui `n` começa com um valor inicial de `1` no lugar de `0`.

## `v-for` no `<template>` {#v-for-on-template}

Semelhante a `v-if` do modelo de marcação, também podes utilizar o marcador `<template>` para interpretar um bloco com vários elementos. Por exemplo:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` com `v-if` {#v-for-with-v-if}

:::warning AVISO
**Não** é recomendado utilizar `v-if` e `v-for` no mesmo elemento devido a precedência implicita. Consulte o [guia de estilo](/style-guide/rules-essential.html#avoid-v-if-with-v-for) para obter mais detalhes.
:::

Quando elas existem no mesmo nó, a `v-if` tem uma prioridade mais alta do que a `v-for`. Que significa que a condição `v-if` não terá acesso as variáveis do escope do `v-for`:

```vue-html
<!--
Isto lançará um erro porque a propriedade "todo"
não está definida na instância
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Isto pode ser corrigido movendo `v-for` para um marcodor `<template>` de embrulho (que também é mais explicito):

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## Mantendo o Estado com `key` {#maintaining-state-with-key}

Quando a Vue está atualizando um lista de elementos interpretados com a `v-for`, por padrão ela utiliza uma estratégia de "remendar no lugar (in-place patch)". Se a ordem dos itens de dados mudou, no lugar de mover os elementos do DOM para corresponder a ordem dos itens, a Vue remendará cada elemento no lugar e certificar-se de que ela refleta o que deveria ser interpretado naquele índice particular.

Este modo padrão é eficiente, mas **só é adequando quando o resultado da interpretação da tua lista não depender do estado do componente filho ou do estado temporário do DOM (por exemplo, valores de entrada de formulário)**.

Para dar a Vue uma sugestão para que ela possa rastreiar qualquer identidade do nó, e assim reutilizar e reorganizar os elementos existente, precisas fornecer um atributo `key` único para cada item:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- content -->
  <!-- conteúdo -->
</div>
```

Quando estiveres utilizando `<template v-for>`, o `key` deve ser colocado no contentor `<template>`:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip NOTA
Aqui `key` é um atributo especial sendo vinculado com a `v-bind`. Ela não deveria ser confundida com a variável chave (`key`) de propriedade quando estiveres [utilizando a `v-for` com um objeto](#v-for-with-an-object).
:::

[É recomendado](/style-guide/rules-essential#use-keyed-v-for) fornecer um atributo `key` com a `v-for` sempre que possível, a menos que o conteúdo de DOM iterado seja simples (por exemplo, não contém quaisquer componentes ou elementos de DOM com conteúdo), estás intencionalmente confiando no comportamento padrão para ganhos de desempenho.

O vinculação de `key` aguarda por valores primitivos - por exemplo, sequências de caracteres e números. Não utilize objetos como chaves de `v-for`. Para utilização detalhada do atributo `key`, favor de consultar a [documentação da API de `key`](/api/built-in-special-attributes#key).

## `v-for` com um Componente {#v-for-with-a-component}

> Esta secção presume conhecimento de [Componentes](/guide/essentials/component-basics). Esteja livre para ignorá-la e voltar mais tarde.

Tu podes utilizar a `v-for` diretamente sobre um componente, tal como qualquer elemento normal (não te esqueças de fornecer um `key`):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

No entanto, isto não passará quaisquer dados automaticamente para o componente, porque os componentes têm seus próprios escopos isolados. Para passar o dado iterado para dentro do componente, também devemos utilizar as propriedades:

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

A razão para não injetar automaticamte o `item` para dentro do componente é porque isto torna o componente fortemente acoplado à como a `v-for` funciona. Ser explicito a respeito de onde os teus dados vem torna o componente reutilizável em outras situações.

<div class="composition-api">

Consulte [este exemplo de uma lista de afazeres simples](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=) para veres como interpretar uma lista de componentes utilizando a `v-for`, passando diferentes dados para cada instância.

</div>
<div class="options-api">

Consulte [este exemplo de uma lista de afazeres simples](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=) para veres como interpretar uma lista de componentes utilizando a `v-for`, passando diferentes dados para cada instância.

</div>

## Deteção de Mudança de Arranjo {#array-change-detection}

### Métodos de Mutação {#mutation-methods}

A Vua é capaz de detetar quando métodos de mutação de um arranjo reativo são chamados e aciona as atualizações necessárias. Estes métodos de mutação são:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Substituindo um Arranjo {#replacing-an-array}

Os métodos de mutação, como o nome sugere, alteram o arranjo original sobre o qual eles são chamados. Em comparação, também existem métodos que não realizam mutação, por exemplo, `filter()`, `concat()` e `slice()`, que não alteram o arranjo original mas **sempre retornam um arranjo novo**. Quando estivermos trabalhando como métodos que não realizam mutação, devemos substituir o arranjo antigo com o arranjo novo:

<div class="composition-api">

```js
// `items` é uma referência com valor de arranjo
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

Tu podes achar que isto fará a Vue deixar fora o DOM existente e reinterpretar a lista inteira - felizmente, este não é o caso. A Vua implementa algumas heurísticas inteligentes para maximizar a reutilização do elemento do DOM, assim substituir um arranjo com um outro arranjo contendo objetos que se sobrepõem é uma operação muito eficiente.

## Exibindo Resultados Filtrados ou Organizados {#displaying-filtered-sorted-results}

Algumas vezes queremos exibir uma versão filtrada ou organizada de um arranjo sem alterar ou redefinir os dados originais. Neste caso, podes criar uma propriedade computada que retorna o arranjo filtrado ou organizado. 

Por exemplo:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

Em situações onde as propriedades computadas não são viáveis (por exemplo, dentro de laços `v-for` encaixados), podes utilizar um método:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Tenha cuidado com `reverse()` e `sort()` dentro de uma propriedade computada! Estes dois métodos alterarão o arranjo original, o que deve ser evitado nos recuperadores computados. Crie uma copia do arranjo original antes de chamar estes métodos:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
