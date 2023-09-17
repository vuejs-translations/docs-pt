# Elementos Especiais {#built-in-special-elements}

:::info Não São Componentes
`<componente>`, `<slot>` e `<template>` são funcionalidades parecidas com componente e parte da sintaxe do modelo de marcação. Eles não são componentes verdadeiros e são compilados durante a compilação. Como tal, são convenientemente escritos com letras minúsculas nos modelos de marcação.
:::

## `<component>` {#component}

Uma "meta componente" para desenhar componentes ou elementos dinâmicos.

- **Propriedades**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Detalhes**

  O verdadeiro componente à desenhar é determinado pela propriedade `is`.

  - Quando `is` for uma sequência de caracteres, poderia ser ou nome dum marcador de HTML ou o nome dum componente registado.

  - Alternativamente, `is` também pode ser diretamente vinculado à definição dum componente.

- **Exemplo**

  Interpretação dos componentes com nome registado (API de Opções):

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Interpretação dos componentes com a definição (API de Composição com `<script setup></script>`):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Interpretação dos elementos de HTML:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  Os todos os [componentes embutidos](./built-in-components) podem ser passados para `is`, mas devemos registá-los se quisermos passá-los pelo nome. Por exemplo:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  O registo não é obrigatório se passarmos o próprio componente à `is` no lugar do seu nome, por exemplo no `<script setup>`.

  Se `v-model` for usada num marcador `<component>`, o compilador do modelo de marcação a expandirá à uma propriedade `modelValue` e um ouvinte de evento `update:modelValue`, tal como faria com qualquer outro componente. No entanto, isto não será compatível com os elementos de HTML nativos, tais como `<input>` ou `<select>`. Como resultado, usar `v-model` com um elemento nativo criado dinamicamente não funcionará:

  ```vue
  <script setup>
  import { ref } from 'vue'
  
  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- Isto não funcionará porque 'input' é um elemento de HTML nativo -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  Na prática, este caso extremo não é comum, porque os campos de formulário nativos normalmente são envolvidos dentro de componentes em aplicações reais. Se precisarmos usar diretamente um elemento nativo então podemos dividir a `v-model` num atributo e evento manualmente.

- **Consulte também** [Componentes Dinâmicos](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

Denota as saídas de conteúdo da ranhura nos modelos de marcação

- **Propriedades**

  ```ts
  interface SlotProps {
    /**
     * Quaisquer propriedades passadas ao <slot>
     * são passadas como argumentos para ranhuras isoladas
     */
    [key: string]: any
    /**
     * Reservada para especificação do nome da ranhura.
     */
    name?: string
  }
  ```

- **Detalhes**

  O elemento `<slot>` pode usar o atributo `name` para especificar um nome de ranhura. Quando nenhum `name` for especificado, desenhará a ranhura padrão. Os atributos adicionais passados ao elemento da ranhura serão passados como propriedades de ranhura à ranhura isolada definida no pai.

  O próprio elemento será substituído pelo seu conteúdo de ranhura correspondente.

  Os elementos de `<slot>` nos modelos de marcação da Vue são compilados para JavaScript, então não são para serem confundidos com os [elementos `<slot>` nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

- **Consulte também** [Componentes - Ranhuras](/guide/components/slots)

## `<template>` {#template}

O marcador `<template>` é usado como um espaço reservado quando queremos usar uma diretiva embutida sem desenhar um elemento no DOM.

- **Detalhes**

  O manipulação especial do `<template>` apenas é acionada se for usada com uma destas diretivas:

  - `v-if`, `v-else-if`, ou `v-else`
  - `v-for`
  - `v-slot`
  
  Se nenhuma destas diretivas estiver presente, então será desenhado como um [elemento `<template>` nativo](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

  Um `<template>` com uma `v-for` também pode ter um [atributo `key`](/api/built-in-special-attributes#key). Todos os outros atributos e diretivas serão descartados, porque não são relevantes sem um elemento correspondente.

  Os componentes de ficheiro único usam [marcador `<template>` de alto nível](/api/sfc-spec#language-blocks) para envolver todo o modelo de marcação. Este uso é separado do uso de `<template>` descrito acima. Este marcador de alto nível não faz parte do próprio modelo de marcação e suporta a sintaxe de modelo de marcação, tais como as diretivas.

- **Consulte também**
  - [Guia - `v-if` sobre o `<template>`](/guide/essentials/conditional#v-if-on-template) 
  - [Guia - `v-for` sobre o `<template>`](/guide/essentials/list#v-for-on-template) 
  - [Guia - Ranhuras Nomeadas](/guide/components/slots#named-slots) 
