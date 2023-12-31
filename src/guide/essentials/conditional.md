# Interpretação Condicional {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Aula Gratuita de Interpretação Condicional da Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Aula Gratuita de Interpretação Condicional da Vue.js"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

A diretiva `v-if` é usada para interpretar um bloco condicionalmente. O bloco apenas será interpretado se a expressão da diretiva retornar um valor verdadeiro:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else` {#v-else}

Nós podemos usar a diretiva `v-else` para indicar um "bloco `else`" à `v-if`:

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

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

Um elemento `v-else` deve seguir imediatamente um elemento `v-if` ou `v-else-if` - de outro modo não será reconhecido.

## `v-else-if` {#v-else-if}

A diretiva `v-else-if`, como o nome sugere, serve como um "bloco `else if`" à `v-if`. Esta também pode ser encadeada várias vezes:

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

Semelhante à `v-else`, um elemento `v-else-if` deve seguir imediatamente um elemento `v-if` ou um `v-else-if`.

## `v-if` no `<template>` {#v-if-on-template}

Uma vez que a `v-if` é uma diretiva, esta precisa ser atribuída a um único elemento. Porém, e se quiséssemos alternar mais que um elemento? Neste caso podemos usar a `v-if` sobre um elemento `<template>`, que serve como um embrulhador invisível. O resultado final interpretado não incluirá o elemento `<template>`:

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

A `v-else` e a `v-else-if` também podem ser usadas sobre o `<template>`.

## `v-show` {#v-show}

Uma outra opção para exibir condicionalmente um elemento é a diretiva `v-show`. O uso é maioritariamente o mesmo:

```vue-html
<h1 v-show="ok">Hello!</h1>
```

A diferença é que um elemento com a `v-show` sempre será interpretado e permanecerá no DOM; A `v-show` apenas alterna a propriedade de CSS `display` do elemento.

A `v-show` não suporta o elemento `<template>`, nem funciona com a `v-else`.

## `v-if` vs `v-show` {#v-if-vs-v-show}

A `v-if` é a interpretação condicional "real" porque ela garante que os ouvintes de evento e componentes filhos dentro de um bloco condicional sejam apropriadamente destruídos e recriados durante as alternâncias.

A `v-if` também é **preguiçosa**: se a condição for falsa na interpretação inicial, ela não fará nada - o bloco condicional não será interpretado até a condição tornar-se verdadeira pela primeira vez.

Em comparação, a `v-show` é muito mais simples - o elemento é interpretado sempre apesar da condição inicial, com alternância baseada em CSS.

Duma maneira geral, a `v-if` tem custos de alternância altos enquanto a `v-show` tem custos de interpretação inicial altos. Então prefira a `v-show` se precisares de alternar alguma coisa com frequência, e prefira a `v-if` se é pouco provável a condição mudar em tempo de execução.

## `v-if` com `v-for` {#v-if-with-v-for}

:::warning AVISO
**Não** é recomendado utilizar a `v-if` e `v-for` no mesmo elemento por causa da precedência implícita. Consulte o [guia de estilo](/style-guide/rules-essential#avoid-v-if-with-v-for) para obter mais detalhes.
:::

Quando a `v-if` e `v-for` forem ambas utilizadas no mesmo elemento, a `v-if` será avaliada primeiro. Consulte a [guia de interpretação de lista](list#v-for-with-v-if) para obter mais detalhes.
