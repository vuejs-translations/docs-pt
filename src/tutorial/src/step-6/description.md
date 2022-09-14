# Interpretação Condicional

Nós podemos utilizar a diretiva `v-if` para interpretar um elemento condicionalmente:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

Este `<h1>` será interpretado apenas se o valor de `awesome` for [verdadeiro](https://developer.mozilla.org/en-US/docs/Glossary/Truthy). Se `awesome` mudar para um valor [falso](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), ele será removido do DOM.

Nós também podemos utilizar `v-else` e `v-else-if` para indicar outros ramos da condição:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

Atualmente, a demonstração está exibindo ambos `<h1>` ao mesmo tempo, e o botão não faz nada. Experimente adicionar as diretivas `v-if` e `v-else` a eles, e implementar o método `toggle()` para que assim possamos utilizar o botão para alternar entre eles.

Mais detalhes a respeito de `v-if`: <a target="_blank" href="/guide/essentials/conditional.html">Guia - Interpretação Condicional</a>
