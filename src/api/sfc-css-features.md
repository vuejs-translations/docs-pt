# Funcionalidades de CSS {#sfc-css-features}

## CSS Isolado {#scoped-css}

Quando um marcador `<style>` tiver o atributo `scoped`, o seu CSS apenas aplicar-se-á aos elementos do componente atual. Isto é semelhante ao encapsulamento de estilo encontrado no DOM de Sombra. Ele vem com algumas advertências, mas não exige quaisquer preenchimento de funcionalidade. Ele é alcançado usando PostCSS para transformar o seguinte:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

No seguinte:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### Elementos de Raiz do Componente Filho {#child-component-root-elements}

Com `scoped`, os estilos do componente pai não passarão para os componentes filhos. No entanto, um nó de raiz do componente filho será afetado por ambas CSS isolada do pai e a CSS isolada do filho. Isto é de propósito para que o pai possa estilizar o elemento de raiz filho para fins de disposição.

### Seletores Profundos {#deep-selectors}

Se quisermos que um seletor nos estilos `scoped` torne-se "profundo", ou seja, afete componentes filho, podemos usar a pseudo-classe `:deep()`:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

O código acima será compilado para:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip DICA
Os conteúdos do DOM criados com `v-html` não são afetados pelos estilos isolados, mas ainda podemos estilizá-los usando seletores profundos.
:::

### Seletores Inseridos {#slotted-selectors}

Por padrão, os estilos isolados não afetam os conteúdos interpretados pelo `<slot/>`, uma vez que são considerados ser propriedade do componente pai que está a passá-los. Para explicitamente atingir o conteúdo da ranhura, usamos a pseudo-classe `:slotted`:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Seletores Globais {#global-selectors}

Se quisermos que apenas uma regra aplique-se globalmente, podemos usar a pseudo-classe `:global` ao invés de criar um outro `<style>` (consulte o exemplo abaixo):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Misturando Estilos Locais e Globais {#mixing-local-and-global-styles}

Nós também podemos incluir ambos estilos isolados e não isolados no mesmo componente:

```vue
<style>
/* estilos globais */
</style>

<style scoped>
/* estilos locais */
</style>
```

### Dicas de Estilo Isolado {#scoped-style-tips}

- **Os estilos isolados não eliminam a necessidade de classes**. Por causa da maneira que os navegadores interpretam os vários seletores de CSS, `p { color: red }` será muitas vezes mais lento quando isolado (ou seja, quando combinado com um seletor de atributo). Se usarmos as classes (por exemplo, `.class-name`) ou identificadores (por exemplo, `#id-name`), tal como em `.example { color: red }`, então eliminamos virtualmente este impacto de desempenho.

- **Temos que ter cuidado com os seletores de descendentes nos componentes recursivos!** Para um regara de CSS com o seletor `.a .b`, se o elemento que corresponde `.a` contiver um componente filho recursivo, então todos os `.b` neste componente filho serão correspondidos pela regra.

## Módulos de CSS {#css-modules}

Um marcador `<style module>` é compilado como [Módulos de CSS](https://github.com/css-modules/css-modules) e expõe as classes de CSS resultantes ao componente como um objeto sob a chave de `$style`:

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

As classes resultantes têm o seu nome gerados com caracteres embaralhados para evitar colisões, alcançando o mesmo efeito de isolar o CSS apenas ao componente atual.

Consulte a [especificação dos Módulos de CSS](https://github.com/css-modules/css-modules) por mais detalhes, tais como [exceções globais](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#exceptions) e [composição](https://github.com/css-modules/css-modules#composition).

### Nome de Injeção Personalizado {#custom-inject-name}

Nós podemos personalizar a chave da propriedade do objeto de classes injetadas dando ao atributo `module` um valor:

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Uso com API de Composição {#usage-with-composition-api}

As classes injetadas podem ser acessadas na `setup()` e no `<script setup>` através da API `useCssModule`. Para os blocos `<style module>` com nomes de injeção personalizados, `useCssModule` aceita o valor do atributo `module` correspondente como primeiro argumento:

```js
import { useCssModule } from 'vue'

// dentro do âmbito de setup()...
// padrão, retorna as classes do marcador `<style module>`
useCssModule()

// personalizado, retorna as classes do marcador `<style module="classes">`
useCssModule('classes')
```

## `v-bind()` na CSS {#v-bind-in-css}

Os marcadores `<style>` do componente de ficheiro único suportam vincular os valores de CSS ao estado do componente dinâmico usando a função de CSS `v-bind`:

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

A sintaxe funciona com o [`<script setup>`](./sfc-script-setup), e suporta expressões de JavaScript (devem estar envoltos por aspas):

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>olá</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

O verdadeiro valor será compilado numa propriedade personalizada de CSS com nome composto por caracteres embaralhados, assim a CSS continua estática. A propriedade personalizada será aplicada ao elemento de raiz do componente através de estilos em linha e atualizada de maneira reativa se o valor de origem for mudado.
