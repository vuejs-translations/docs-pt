# Especificação da Sintaxe {#sfc-syntax-specification}

## Visão Geral {#overview}

Um componente de ficheiro único da Vue, tradicionalmente usando a extensão de ficheiro `*.vue`, é um formato de ficheiro personalizado que usa uma sintaxe semelhante ao HTML para descrever um componente da Vue. Um componente de ficheiro único da Vue é sintaticamente compatível com a HTML.

Cara ficheiro `*.vue` é composto por três tipos de blocos da linguagem de alto nível: `<template>`, `<script>`, e `<style>`, e opcionalmente blocos personalizados adicionais:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  This could be e.g. documentation for the component.
</custom1>
```

## Blocos de Linguagem {#language-blocks}

### `<template>` {#template}

- Cada ficheiro `*.vue` pode conter no máximo um bloco `<template>` de alto nível.

- O conteúdo será extraído e passado ao `@vuw/compiler-dom`, pré-compilado dentro de funções de interpretação de JavaScript, e anexado ao componente exportado como sua opção `render`.

### `<script>` {#script}

- Cada ficheiro `*.vue` poder conter no máximo um bloco `<script>` de alto nível (excluindo [`<script setup>`](/api/sfc-script-setup)).

- O programa é executado como um módulo de ECMAScript.

- A **exportação padrão** deve ser um objeto de opções de componente da Vue, ou como um objeto simples ou como valor de retorno da [`defineComponent`](/api/general#definecomponent).

### `<script setup>` {#script-setup}

- Cada ficheiro `*.vue` pode conter no máximo um bloco `<script setup>` (excluindo o `<script>` normal).

- O programa é pré-processado e usado como a função `setup()` do componente, o que significa que será executado **para cada instância do componente**. Os vínculos de alto nível no `<script setup>` são automaticamente expostos ao modelo de marcação. Para mais detalhes, consulte a [documentação dedicada ao `<script setup>`](/api/sfc-script-setup).

### `<style>` {#style}

- Um único ficheiro `*.vue` pode conter vários marcadores de `<style>`.

- Um marcador `<style>` pode ter os atributos `scoped` ou `module` (consulte [Funcionalidades de Estilo do Componente de Ficheiro Único](/api/sfc-css-features) por mais detalhes) para ajudar a encapsular os estilos ao componente atual. Vários marcadores de `<style>` com diferentes modos de encapsulamento podem ser misturados no mesmo componente.

### Blocos Personalizados {#custom-blocks}

Os blocos personalizados podem ser incluídos num ficheiro `*.vue` por qualquer necessidade específica do projeto, por exemplo um bloco `<docs>`. Alguns exemplos do mundo real de blocos personalizados incluem:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

A manipulação dos blocos personalizados dependerá do ferramental - se quisermos construir as nossas próprias integrações de bloco personalizado, podemos consultar a [seção de ferramental de integrações de bloco personalizado do Componente de Ficheiro Único](/guide/scaling-up/tooling#sfc-custom-block-integrations) por mais detalhes.

## Inferência Automática de Nome {#automatic-name-inference}

Um componente de ficheiro único infere automaticamente o nome do componente a partir do seu **nome de ficheiro** nos seguintes casos:

- Formatação do aviso de desenvolvimento
- Inspeção das ferramentas de programação
- Auto-referência recursiva, por exemplo, um ficheiro nomeado `FooBar.vue` pode refer-se a si mesmo como `<FooBar/>` no seu modelo de marcação. Isto tem a menor prioridade do que os componentes registados ou importados explicitamente.

## Pré-Processadores {#pre-processors}

Os blocos podem declarar linguagens pré-processadoras usando o atributo `lang`. O caso mais comum é usar TypeScript para o bloco `<script>`:


```vue-html
<script lang="ts">
  // usar TypeScript
</script>
```

`lang` pode ser aplicado à qualquer bloco - por exemplo, podemos usar o `<style>` com  a [Sass](https://sass-docs-pt.netlify.app/) e o `<template>` com a [Pug](https://pugjs.org/api/getting-started.html):

```vue-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

Nota que a integração com os vários pré-processadores pode diferir conforme a cadeia de ferramenta. Consulte a respetiva documentação por exemplos:

- [Vite](https://pt.vitejs.dev/guide/features#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Importações com `src` {#src-imports}

Se preferirmos separar os nossos componentes `*.vue` em vários ficheiros, podemos usar o atributo `src` para importar um ficheiro externo para um bloco de linguagem:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Devemos estar ciente de que as importações de `src` seguem as mesmas regras de resolução de caminho que as requisições de módulo da Webpack, o que significa que:

- Os caminhos relativos precisam começar com `./`
- Nós podemos importar recursos a partir das dependências do npm:

```vue
<!-- importar um ficheiro dum pacote "todomvc-app-css" instalado -->
<style src="todomvc-app-css/index.css" />
```

As importações de `src` também funcionam com os blocos personalizados, por exemplo:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## Comentários {#comments}

Dentro de cada bloco usaremos a sintaxe de comentário da linguagem em uso (HTML, CSS, JavaScript, Pug, etc.). Para comentários de alto nível, usamos a sintaxe de comentário da HTML: `<!-- eis o conteúdo do comentário -->`
