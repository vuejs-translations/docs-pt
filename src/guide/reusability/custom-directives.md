# Diretivas Personalizadas {#custom-directives}

<script setup>
const vFocus = {
  mounted: el => {
    el.focus()
  }
}
</script>

## Introdução {#introduction}

Além do conjunto padrão de diretivas disponibilizadas no núcleo (tais como `v-model` ou `v-show`), a Vue também permite-te registar as tuas próprias diretivas personalizadas.

Nós introduzimos duas formas de reutilizar código na Vue: [Componentes](/guide/essentials/component-basics) e [Funções de Composição](./composables). Os componentes são os principais blocos do edifício, enquanto os constituíveis são focadas na reutilização da lógica com estado. As diretivas, por outro lado, são principalmente destinadas para a reutilização de lógica que envolve acesso de DOM de baixo nível sobre os elementos simples.

Uma diretiva personalizada é definida como um objeto contendo gatilhos de ciclo de vida semelhantes àqueles de um componente. Os gatilhos recebem o elemento em que a diretiva está vinculada. Cá está um exemplo de uma diretiva que foca em uma entrada quando o elemento é inserido no DOM pela Vue:

<div class="composition-api">

```vue
<script setup>
// ativa "v-focus" nos modelos de marcação
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // ativa "v-focus" no modelo de marcação
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

<div class="demo">
  <input v-focus placeholder="This should be focused" />
</div>

Presumindo de que não tens clicado noutro lado na página, a entrada acima deveria ser auto-focada. Esta diretiva é mais útil do que o atributo `autofocus` porque ela funciona não apenas sobre o carregamento da página - ele também funciona quando o elemento for dinamicamente inserido pela Vue.

<div class="composition-api">

No `<script setup>`, qualquer variável em "camelCase" que começa com o prefixo `v` pode ser utilizado como uma diretiva personalizada. No exemplo acima, `vFocus` pode ser utilizado no modelo de marcação como `v-focus`.

Se não estiveres a utilizar `<script setup>`, as diretivas personalizadas podem ser registadas utilizando a opção `directives`:

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // ativa "v-focus" no modelo de marcação
    focus: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

Semelhante aos componentes, as diretivas personalizadas devem ser registadas para que elas possam ser utilizadas nos modelos de marcação. No exemplo acima, estamos a utilizar o registo local através da opção `directives`.

</div>

É também comum registar globalmente as diretivas personalizadas no nível de aplicação:

```js
const app = createApp({})

// torna "v-focus" utilizável em todos os componentes
app.directive('focus', {
  /* ... */
})
```

:::tip DICA
As diretivas personalizadas devem apenas ser utilizadas quando a funcionalidade desejada pode ser apenas alcançado através da manipulação direta do DOM. Prefira a marcação de modelos declarativa utilizando as diretivas embutidas tais como `v-bind` quando possível porque elas são mais eficientes e amigáveis a interpretação no lado do servidor.
:::

## Gatilhos de Diretiva {#directive-hooks}

Um objeto de definição de diretiva pode fornecer várias funções de gatilho (todas opcionais):

```js
const myDirective = {
  // chamada antes dos atributos do elemento serem vinculados
  // ou antes dos ouvintes de evento serem aplicados
  created(el, binding, vnode, prevVnode) {
    // consulte abaixo os detalhes sobre os argumentos
  },
  // chamada bem antes do elemento ser inserido no DOM.
  beforeMount() {},
  // chamada quando o componente pai do elemento estiver vinculado
  // e todos os seus filhos estiverem montados.
  mounted() {},
  // chamada antes do componente pai ser atualizado
  beforeUpdate() {},
  // chamada depois do componente pai e
  // todos os seus filhos tiverem sido atualizados
  updated() {},
  // chamada antes do componente pai ser desmontado
  beforeUnmount() {},
  // chamada quando o componente pai estiver desmontado
  unmounted() {}
}
```

### Argumentos de Gatilho {#hook-arguments}

Aos gatilhos de diretiva são passados estes argumentos:

- `el`: o elemento em que a diretiva está vinculada. Isto pode ser utilizado para manipular diretamente o DOM.

- `binding`: um objeto contendo as seguintes propriedades.

  - `value`: O valor passado para a diretiva. Por exemplo em `v-my-directive="1 + 1"`, o valor seria `2`.
  - `oldValue`: O valor anterior, apenas disponível em `beforeUpdate` e `updated`. Está disponível quer o valor tenha mudado ou não.
  - `arg`: O argumento passado para a diretiva, se houver. Por exemplo em `v-my-directive:foo`, o `arg` seria `"foo"`.
  - `modifiers`: Um objeto contendo os modificadores, se houver. Por exemplo `v-my-directive.foo.bar`, o objeto de modificadores seria `{ foo: true, bar: true }`.
  - `instance`: A instância do componente onde a diretiva é utilizada.
  - `dir`: O objeto de definição da diretiva.

- `vnode`: O nó de vue (VNode em Inglês) subjacente representando o elemento vinculado.
- `prevNode`: O nó de vue (VNode em Inglês) representando o elemento vinculado da interpretação anterior. Apenas disponível os gatilhos `beforeUpdate` e `updated`.

Como um exemplo, considere a seguinte utilização de diretiva:

```vue-html
<div v-example:foo.bar="baz">
```

O argumento `binding` (vinculação, em Português) seria um objeto na forma de:

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* valor de `baz` */,
  oldValue: /* valor de `baz` da atualização anterior */
}
```

Semelhante as diretivas embutidas, os argumentos de diretiva personalizada podem ser dinâmicos. Por exemplo:

```vue-html
<div v-example:[arg]="value"></div>
```

Aqui o argumento da diretiva será atualizado de maneira reativa baseada na propriedade `arg` no nosso estado de componente.

:::tip NOTA
Para além de `el`, deves tratar estes argumentos como de apenas-leitura e nunca modificá-los. Se precisares de partilhar a informação através dos gatilhos, é recomendado fazer isto através do atributo [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) do elemento.
:::

## Abreviação de Função {#function-shorthand}

É comum para uma diretiva personalizada ter o mesmo comportamento para `mounted` e `updated`, sem precisar de outros gatilhos. Nestes casos podemos definir a diretiva como uma função:

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // isto será chamado para ambos `mounted` e `updated`
  el.style.color = binding.value
})
```

## Literais de Objeto {#object-literals}

Se a tua diretiva precisar de vários valores, podes também um literal de objeto de JavaScript. Lembra-te de que, as diretivas podem receber qualquer expressão de JavaScript válida.

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## Utilização sobre Componentes {#usage-on-components}

Quando utilizadas sobre os componentes, as diretivas personalizadas sempre aplicar-se-ão à um nó de raiz do componente, semelhante aos [Atributos Herdados](/guide/components/attrs).

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- modelo de marcação de MyComponent -->

<div> <!-- a diretiva "v-demo" será aplicada aqui -->
  <span>My component content</span>
</div>
```

Nota que os componentes podem potencialmente ter mais de um nó de raiz. Quando aplicada à um componente com vários nó de raiz, a diretiva será ignorada e um aviso será lançado. Ao contrário dos atributos, as diretivas não podem ser passadas para um elemento diferente com `v-bind="$attrs"`. No geral, **não é** recomendado utilizar diretivas personalizadas sobre os componentes.
