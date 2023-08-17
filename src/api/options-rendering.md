# Opções: Interpretação {#options-rendering}

## `template` {#template}

Um modelo de marcação de sequência de caracteres para o componente.

- **Type**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Detalhes**

  Um modelo de marcação fornecido através da opção `template` que será compilada instantaneamente em tempo de execução. É suportado apenas quando usamos uma construção de Vue que inclui o compilador de modelo de marcação. O compilador de modelo de marcação **NÃO** está incluído nas construções de Vue que têm a palavra `runtime` em seus nomes, por exemplo. `vue.runtime.esm-bundler.js`. Consulte o [guia de ficheiro de distribuição](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) por mais detalhes sobre as diferentes construções.

  Se a sequência de caracteres começar com `#` será usada como uma `querySelector` e usará o `innerHTML` do elemento selecionado como modelo de marcação de sequência de caracteres. Isto permite o modelo de marcação da fonte ser escrito usando elementos `<template>` nativos.

  Se a opção `render` também estiver presente no mesmo componente, o `template` será ignorado.

  Se o componente de raiz da nossa aplicação não tiver uma opção `template` ou `render` especificada, a Vue tentará usar o `innerHTML` do elemento montado como modelo de marcação.

  :::warning Aviso de Segurança
  Só deveríamos usar modelos de marcação de fontes que possamos confiar. Não devemos usar conteúdo fornecido pelo utilizador como nosso modelo de marcação. Consulte o [Guia de Segurança](/guide/best-practices/security.html#rule-no-1-never-use-non-trusted-templates) por mais detalhes.
  :::

## `render` {#render}

Uma função que retorna programaticamente a árvore de DOM virtual do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Detalhes:**

  `render` é uma alternativa aos modelos de marcação de sequência de caracteres que permite-nos influenciar todo o poder programático da JavaScript de declarar a saída da interpretação do componente.

  Os modelos de marcação pré-compilados, por exemplo aqueles nos Componentes de Ficheiro Único, são compilados para a opção `render` em tempo de construção. Se ambos `render` e `template` estiverem presentes num componente, `render` receberá prioridade mais alta.

- **Consulte também**
  - [Mecanismo de Interpretação](/guide/extras/rendering-mechanism.html)
  - [Funções de Interpretação](/guide/extras/render-function.html)

## `compilerOptions` {#compileroptions}

Configura as opções do compilador de tempo de execução para o modelo de marcação do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // predefinido como: 'condense'
      delimiters?: [string, string] // predefinido como: ['{{', '}}']
      comments?: boolean // predefinido como: false
    }
  }
  ```

- **Detalhes**

  Esta opção de configuração só é respeitada quando usamos a construção completa (por exemplo, o `.vue.js` autónomo que pode compilar modelos de marcação no navegador). Ela suporta as mesmas opções que o [`app.config.compilerOptions`](/api/application#app-config-compileroptions) do nível de aplicação, e tem prioridade mais alta para o componente atual.

- **Consulte também** [`app.config.compilerOptions`](/api/application#app-config-compileroptions)

## `slots`<sup class="vt-badge ts" data-text="typescript"/> {#slots}

Uma opção para ajudar com a inferência de tipo quando usamos ranhuras programaticamente nas funções de interpretação. Apenas suportado na 3.3+.

- **Detalhes**

  Este valor de tempo de execução da opção não é usado. Os tipos verdadeiros devem ser declarados através da moldagem de tipo usando o tipo auxiliar `SlotsType`:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```
