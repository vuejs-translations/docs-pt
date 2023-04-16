# Especificação da Sintaxe SFC {#sfc-syntax-specification}

## Visão Geral {#overview}

Um Single-File Component (SFC) Vue, convencionalmente usando a extensão de arquivo `*.vue`, é um formato de arquivo customizado que usa uma sintaxe semelhante a HTML para descrever um componente Vue. Um Vue SFC é sintaticamente compatível com HTML.

Cada arquivo `*.vue` consiste em três tipos de blocos de linguagem de alto nível: `<template>`, `<script>`, e `<style>`, e opcionalmente blocos customizados adicionais:

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
  Isso pode ser, por exemplo documentação do componente.
</custom1>
```

## Blocos de Linguagem {#language-blocks}

### `<template>` {#template}

- Cada arquivo `*.vue` pode conter no máximo um bloco `<template>` de alto nível por vez.

- O conteúdo será extraído e passado para `@vue/compiler-dom`, pré-compilado em funções de renderização JavaScript e anexado ao componente exportado como sua opção `render`.

### `<script>` {#script}

- Cada arquivo `*.vue` pode conter no máximo um bloco `<script>` de alto nível por vez (excluíndo [`<script setup>`](/api/sfc-script-setup.html)).

- O escript é executado como um módulo ES.

- A **exportação padrão** `default export` deve ser um objeto de opções do componente Vue, seja como um objeto simples ou como o valor de retorno de [defineComponent](/api/general.html#definecomponent)

### `<script setup>` {#script-setup}

- Cada arquivo `*.vue` pode conter no máximo um bloco `<script setup>` de alto nível por vez (excluíndo `<script>` normal).

- O script é pré-processado e usado como a função `setup()` do componente, o que significa que será executado **para cada instância do componente**. Ligações de nível superior em `<script setup>` são automaticamente expostas ao template. Para obter mais detalhes, consulte [documentação dedicada a `<script setup>`](/api/sfc-script-setup).

### `<style>` {#style}

- Um único arquivo `*.vue` pode conter multiplas tags `<style>`.

- Uma tag `<style>` pode ter atributos `scoped` ou `module` (consulte [Recursos de estilo SFC](/api/sfc-css-features) para obter mais detalhes) para ajudar a encapsular os estilos no componente atual. Múltiplas tags `<style>` com diferentes modos de encapsulamento podem ser misturados no mesmo componente.

### Blocos Customizados {#custom-blocks}

Blocos customizados adicionas podem ser incluídos em um arquivo `*.vue` para qualquer necessidade específica do projeto, por exemplo um bloco `<docs>`. Alguns exemplos do mundo real de blocos customizados incluem:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

O manuseio de blocos personalizados dependerá de Ferramental - se você deseja criar suas próprias integrações de blocos personalizados, veja a [seção relevante de ferramental](/guide/scaling-up/tooling.html#sfc-custom-block-integrations) para obter mais detalhes.

## Inferência Automática de Nome {#automatic-name-inference}

Um SFC infere automaticamente o nome do componente de seu **nome de arquivo** nos seguintes casos:

- Formatação de aviso do Dev
- inspeção de DevTools
- Auto-referência recursiva. Por exemplo. um arquivo chamado `FooBar.vue` pode se referir a si mesmo como `<FooBar/>` em seu template. Isso tem prioridade mais baixa do que os componentes explicitamente registrados/importados.

## Pré-Processadores {#pre-processors}

Blocos pode declarar linguagens de pré-processadores usando o atributo `lang`. A caso mais comum é usando TypeScript para o bloco `<script>`:
```vue-html
<script lang="ts">
  // usa TypeScript
</script>
```

`lang` pode ser aplicado a qualquer bloco - por exemplo, nós podemos usar `<style>` com [Sass](https://sass-lang.com/) e `<template>` com [Pug](https://pugjs.org/api/getting-started.html):

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

Note que a integração com vários pré-processadores pode diferir por conjunto de ferramentas. Confira a respectiva documentação para exemplos:

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Importações com Src {#src-imports}

Se você prefere dividir seu componente `*.vue` em multiplos arquivos, você pode usar o atributo `src` para importar um arquivo externo para o bloco de linguagem:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Esteja ciente de que as importações `src` seguem as mesmas regras de resolução de caminho que as solicitações do módulo webpack, o que significa:

- Caminhos relativos precisam começar com `./`
- Você pode importar recursos de dependências do npm:

```vue
<!-- importa um arquivo do pacote de npm "todomvc-app-css" -->
<style src="todomvc-app-css/index.css" />
```

As importações com `src` também funcionam com blocos personalizados, por exemplo:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## Comentários {#comments}

Dentro de cada bloco você deverá utilizar a sintaxe de comentário da linguagem que está sendo utilizada (HTML, CSS, JavaScript, Pug, etc.). Para comentários de nível superior, use a sintaxe de comentário HTML: `<!-- comente o conteúdo aqui -->`
