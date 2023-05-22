# Funcionalidades de CSS para SFC {#sfc-css-features}

## CSS delimitado {#scoped-css}

Quando uma tag `<style>` tem o atributo `scoped`, seu CSS se aplica apenas aos elementos do componente atual. Isso é semelhante ao encapsulamento de estilo encontrado no Shadow DOM. Por mais que tenha algumas ressalvas, não requer nenhum polyfill. É alcançado usando o PostCSS para transformar o seguinte código:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">olá</div>
</template>
```

Nesse outro código:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>olá</div>
</template>
```

### Elementos raiz de componentes filhos {#child-component-root-elements}

Com `scoped`, os estilos do componente pai não vazam para os componentes filhos. No entanto, o nó raiz de um componente filho será afetado pelo CSS do componente pai e pelo CSS do componente filho. Isso é feito de propósito para que o pai possa estilizar o elemento raiz do filho para fins de layout.

### Seletores profundos {#deep-selectors}

Se você deseja que um seletor em estilos `scoped` seja "profundo", ou seja, afetando componentes filhos, você pode usar a pseudo-classe `:deep()`:

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

:::tip
Os nós DOM criados com `v-html` não são afetados pelos estilos delimitados, mas você ainda pode estilizá-los usando seletores profundos.
:::

### Seletores de slot {#slotted-selectors}

Por padrão, os estilos delimitados não afetam o conteúdo renderizado por `<slot/>`, pois eles são considerados de propriedade do componente pai que os passa. Para estilizar explicitamente o conteúdo do slot, use a pseudo-classe `:slotted`:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Seletores globais {#global-selectors}

Se você deseja que um seletor aplique-se globalmente, mas ainda esteja em um bloco de estilo `scoped`, você pode usar a pseudo-classe `:global` em vez de criar outro `<style>` (veja abaixo):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Misturando estilos locais e globais {#misturando-estilos-locais-e-globais}

Você também pode incluir estilos com e sem escopo no mesmo componente:

```vue
<style>
/* estilos globais */
</style>

<style scoped>
/* estilos locais */
</style>
```

### Dicas de estilo delimitado {#scoped-style-tips}

- **Estilos delimitados não eliminam a necessidade de classes**. Devido a forma que os navegadores renderizam vários seletores CSS, `p { color: red }` será muito mais lento quando delimitado (isto é, quando combinado com um seletor de atributo). Se você usar classes ou ids, como em `.example { color: red }`, então você virtualmente elimina esse impacto de desempenho.

- **Tenha cuidado com seletores descendentes em componentes recursivos!** Para uma regra CSS com o seletor `.a .b`, se o elemento que corresponde a `.a` contém um componente filho recursivo, então todos os `.b` nesse componente filho serão correspondidos pela regra.

## Módulos CSS {#css-modules}

Uma tag `<style module>` é compilada como um [Módulo CSS](https://github.com/css-modules/css-modules) e expõe as classes CSS resultantes para o componente como um objeto sob a chave `$style`:

```vue
<template>
  <p :class="$style.red">Isto deveria ser vermelho</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

As classes resultantes tem um hash aplicado para evitar colisões, alcançando o mesmo efeito de delimitar o CSS apenas ao componente atual.

Recorra à [Especificação de Módulos CSS](https://github.com/css-modules/css-modules) para mais detalhes como [exceções globais](https://github.com/css-modules/css-modules#exceptions) e [composição](https://github.com/css-modules/css-modules#composition).

### Nome de injeção personalizado {#custom-inject-name}

Você pode personalizar a propriedade chave do objeto de classes injetadas dando ao atributo `module` um valor:

```vue
<template>
  <p :class="classes.red">vermelho</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Uso com API de Composição {#usage-with-composition-api}

As classes injetadas podem ser acessadas em `setup()` e `<script setup>` por meio da API `useCssModule`. Para blocos `<style module>` com nomes de injeção personalizados, `useCssModule` aceita o valor do atributo `module` correspondente como primeiro argumento:

```js
import { useCssModule } from 'vue'

// dentro do escopo de setup()...
// padrão, retorna as classes da tag <style module>
useCssModule()

// personalizado, retorna as classes da tag <style module="classes">
useCssModule('classes')
```

## `v-bind()` em CSS {#v-bind-in-css}

As tags `<style>` de SFC suportam vincular valores CSS ao estado dinâmico do componente usando a função CSS `v-bind`:

```vue
<template>
  <div class="text">olá</div>
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

A sintáxe funciona com [`<script setup>`](./sfc-script-setup), e suporta expressões JavaScript (devem ser envolvidas em aspas):

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

O valor real será compilado em uma propriedade CSS personalizada com hash, portanto, o CSS ainda é estático. A propriedade personalizada será aplicada ao elemento raiz do componente por meio de estilos inline e atualizada reativamente se o valor de origem for alterado.
