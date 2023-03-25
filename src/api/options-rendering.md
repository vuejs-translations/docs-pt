# Opções: Interpretação {#options-rendering}

## template {#template}

Um modelo de string para o componente.

- **Type**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Detalhes**

  Um modelo fornecido pela opção `template` que será compilado instantaneamente no tempo de execução. É suportado apenas ao usar uma build de Vue que inclui um compilador de modelo. O compilador de modelo **NÃO** está incluído nas builds de Vue que possuem a palavra `runtime` em seus nomes, e.g. `vue.runtime.esm-bundler.js`. Consulte o [guia de arquivo dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) para mais detalhes sobre as diferentes builds.

  Se a string começa com `#` ele será usado como `querySelector` e usará o `innerHTML` do elemento selecionado como modelo de string. Isto permitirá que o modelo fonte seja autorado usando elementos `<template>` nativos.

  Se a opção `render` também estiver presente no mesmo componente, o `template` será ignorado.

  Se o componente raiz da sua aplicação não possuir uma opcão `template` ou `render` especificada, Vue tentará usar o `innerHTML` do elemento montado como modelo.

  :::warning Aviso de Segurança
  Somente utilize modelos de fontes que você possa confiar. Não utilize conteúdo fornecido pelo usuário como seu modelo. Veja o [Guia de Segurança](/guide/best-practices/security.html#rule-no-1-never-use-non-trusted-templates) para mais detalhes.
  :::

## render {#render}

Uma funcão que retorna programaticamente a árvore DOM virtual do componente.

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

  `render` é uma alternativa aos modelos de string que permitem que você potencialize o poder programático completo do JavaScript para declarar a saída de interpretação do componente.

  Modelos pré-compilados, por exemplo aqueles de Componentes de Arquivo Único, são compilados com a opcão `render` no momento da build. Se tanto `render` como `template` estiverem presentes no componente, `render` terá maior prioridade.

- **Veja também:**
  - [Mecanismo de Interpretação](/guide/extras/rendering-mechanism.html)
  - [Funcões de Interpretação](/guide/extras/render-function.html)

## compilerOptions {#compileroptions}

Configura as opções do compilador em tempo de execução para o modelo do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // default: 'condense'
      delimiters?: [string, string] // default: ['{{', '}}']
      comments?: boolean // default: false
    }
  }
  ```

- **Detalhes**

  A opção de configuração só é respeitada ao usar a build completa (i.e. o `vue.js` autônomo que pode compilar modelos no navegador). Suporta as mesmas opcões do nível da aplicação [app.config.compilerOptions](/api/application.html#app-config-compileroptions), e possui maior prioridade para o componente atual.

- **Veja também:** [app.config.compilerOptions](/api/application.html#app-config-compileroptions)
