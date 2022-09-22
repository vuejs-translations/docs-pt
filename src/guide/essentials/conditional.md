# Interpretação Condicional

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Aula gratuita a respeito da Intepretação Condicional de Vue"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Aula gratuita a respeito da Intepretação Condicional de Vue"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if`

A diretiva `v-if` é utilizada para interpretar um bloco condicionalmente. O bloco só será interpretado se a expressão da diretiva retornar um valor verdadeiro.

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else`

Tu podes utilizar a diretiva `v-else` para indicar um bloco "`else`" para a `v-if`:

```vue-html
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYXdlc29tZSA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgXHRyZXR1cm4ge1xuXHQgICAgYXdlc29tZTogdHJ1ZVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

Um elemento `v-else` deve imediatamente seguir um elemento `v-if` ou `v-else-if` - de outra maneira ele não será reconhedico.

## `v-else-if`

A `v-else-if`, conforme o nome sugere, serve como um bloco "`else if`" para `v-if`. Ela também pode ser encadeiada várias vezes:

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

Similar ao `v-else`, um elemento `v-else-if` deve imediatamente seguir um elemento `v-if` ou um `v-else-if`. 

## `v-if` no `<template>`

Uma vez que a `v-if` é uma diretiva, ela tem que ser atribuida à um único elemento. Porém e se quisessemos alternar mais de um elemento? Neste caso podemos utilizar a `v-if` sobre um elemento `<template>`, que serve como um envolvedor invisível. O resultado interpretado final não incluirá o elemento `<template>`.

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

A `v-else` e a `v-else-if` também podem ser utilizadas sobre o elemento `<template>`.

## `v-show`

Uma outra opção para exibir condicionalmente um elemento é a diretiva `v-show`. A forma de utilização é em grande parte a mesma:

```vue-html
<h1 v-show="ok">Hello!</h1>
```

A diferença é que um elemento com `v-show` sempre será interpretado e permanecerá no DOM; A `v-show` só alterna a propriedade `display` de CSS do elemento.

A `v-show` não suporta o elemento `<template>`, nem funciona com a `v-else`.

## `v-if` vs `v-show`

A `v-if` é a interpretação condicional "real" porque ela garante que os ouvintes de evento e componentes filhos dentro de um bloco condicional sejam aproprieamente destroidos e recriados durante as alternâncias.

A `v-if` também é **preguiçosa**: se a condição for falsa na interpretação inicial, ela não fará nada - o bloco condicional não será interpretado até a condição tornar-se verdadeira pela primeira vez.

Em comparação, a `v-show` é muito mais simples - o elemento é intepretado sempre apesar da condição inicial, com alternância baseada em CSS.

Duma maneira geral, a `v-if` tem custos de alternância altos enquanto a `v-show` tem custos de intepretação inicial altos. Então prefira a `v-show` se precisares de alternar alguma coisa com frequência, e prefira a `v-if` se é pouco provável a condição mudar em tempo de execução.

## `v-if` com `v-for`

::: warning Nota
**Não** é recomendado utiliziar a `v-if` e `v-for` no mesmo elemento por causa da precedência implicita. Consulte o [guia de estilo](/style-guide/rules-essential.html#evite-v-if-com-v-for) para obter mais detalhes.
:::

Quando a `v-if` e `v-for` forem ambas utilizadas no mesmo elemento, a `v-if` será avaliada primeiro. Consulte a [guia de interpretação de lista](list#v-for-com-v-if) para obter mais detalhes.
