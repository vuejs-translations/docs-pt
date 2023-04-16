# Elementos Especiais {#built-in-special-elements}

:::info Não componentes
`<componente>`, `<slot>` e `<template>` são recursos semelhantes a componentes e fazem parte da sintaxe de template. Eles não são componentes verdadeiros e são compilados durante a compilação do template. Como tal, eles são escritos convencionalmente com letras minúsculas nos templates.
:::

## `<component>` {#component}

Um "meta componente" para renderizar dinâmicamente componentes ou elementos.

- **Propriedades**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Detalhes**

  O atual componente a ser renderizado é determinado pela propriedade `is`.

  - Quando `is` é uma string, pode ser um nome de tag HTML ou o nome registrado de um componente

  - Alternativamente, `is` também pode ser vinculado diretamente à definição de um componente.

- **Exemplo**

  Renderizando componentes por nome registrado (API de Opções):

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

  Renderizando componentes por definição (API de Composição com `<script setup>`):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Renderizando elementos HTML:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  Os [componentes embutidos](./built-in-components.html) podem ser todos passados por `is`, mas você deve registrá-los se quiser passá-los por nome. Por exemplo:

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

  O registro não é necessário se você passar o próprio componente para `is` em vez de seu nome, por exemplo em `<script setup>`.

  Se `v-model` for usado em uma tag `<component>`, o compilador de template irá expandi-lo para suporte com a propriedade `modelValue` e um event listener `update:modelValue`, assim como faria para qualquer outro componente. No entanto, isso não será compatível com elementos HTML nativos, como `<input>` ou `<select>`. Como resultado, usar `v-model` com um elemento nativo criado dinamicamente não funcionará:

  ```vue
  <script setup>
  import { ref } from 'vue'
  
  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- Isso não funcionará porque 'input' é um elemento HTML nativo -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  Na prática, esse caso extremo não é comum, pois os campos de formulário nativos geralmente são agrupados em componentes em aplicativos reais. Se você precisar usar um elemento nativo diretamente, poderá dividir o `v-model` em um atributo e evento manualmente.

- **Veja também:** [Componentes Dinâmicos](/guide/essentials/component-basics.html#dynamic-components)

## `<slot>` {#slot}

Indica saídas de conteúdo de slot em templates.

- **Propriedades**

  ```ts
  interface SlotProps {
    /**
     * Qualquer propriedade passada para <slot> para passar como argumentos
     * para slots com escopo
     */
    [key: string]: any
    /**
     * Reservado para especificar o nome do slot.
     */
    name?: string
  }
  ```

- **Detalhes**

  O elemento `<slot>` pode usar o atributo `name` para especificar um nome de slot. Quando nenhum `name` for especificado, ele renderizará o slot padrão. Atributos adicionais passados ​​para o elemento slot serão passados ​​como propriedades de slot para o slot com escopo definido no pai.

  O próprio elemento será substituído por seu conteúdo de slot correspondente.

  `<slot>` elementos em templates Vue são compilados em JavaScript, então eles não devem ser confundidos com [elementos `<slot>` nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

- **Veja também:** [Componentes - Slots](/guide/components/slots.html)

## `<template>` {#template}

A tag `<template>` é usada como espaço reservado quando queremos usar uma diretiva interna sem renderizar um elemento no DOM.

- **Detalhes:**

  O tratamento especial para `<template>` só é acionado se for usado com uma destas diretivas:

  - `v-if`, `v-else-if`, or `v-else`
  - `v-for`
  - `v-slot`
  
  Se nenhuma dessas diretivas estiver presente, ela será renderizada como um [elemento `<template>` nativo](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

  Um `<template>` com um `v-for` também pode ter um atributo [`key`](/api/built-in-special-attributes.html#key). Todos os outros atributos e diretivas serão descartados, pois não são significativos sem um elemento correspondente.

  Componentes de arquivo único (SFC) usam uma [tag `<template>` de alto nível](/api/sfc-spec.html#language-blocks) para agrupar todo o template. Esse uso é separado do uso de `<template>` descrito acima. Essa tag de nível superior não faz parte do próprio modelo e não oferece suporte à sintaxe do modelo, tais como diretivas.

- **Veja também:**
  - [Guia - `v-if` on `<template>`](/guide/essentials/conditional.html#v-if-on-template) 
  - [Guia - `v-for` on `<template>`](/guide/essentials/list.html#v-for-on-template) 
  - [Guia - Slots nomeados](/guide/components/slots.html#named-slots) 
