# API de Interpretação Personalizada {#custom-renderer-api}

## createRenderer() {#createrenderer}

Cria um intepretador personalizado. Ao fornecer APIs de manipulação e criação de nódulos específicos de plataforma, você pode potencializar o núcleo em tempo de execução do Vue par atingir ambientes sem DOM.

- **Tipo**

  ```ts
  function createRenderer<HostNode, HostElement>(
    options: RendererOptions<HostNode, HostElement>
  ): Renderer<HostElement>

  interface Renderer<HostElement> {
    render: RootRenderFunction<HostElement>
    createApp: CreateAppFunction<HostElement>
  }

  interface RendererOptions<HostNode, HostElement> {
    patchProp(
      el: HostElement,
      key: string,
      prevValue: any,
      nextValue: any,
      // o restante é inutilizado para a maioria dos interpretadores personalizados
      isSVG?: boolean,
      prevChildren?: VNode<HostNode, HostElement>[],
      parentComponent?: ComponentInternalInstance | null,
      parentSuspense?: SuspenseBoundary | null,
      unmountChildren?: UnmountChildrenFn
    ): void
    insert(
      el: HostNode,
      parent: HostElement,
      anchor?: HostNode | null
    ): void
    remove(el: HostNode): void
    createElement(
      type: string,
      isSVG?: boolean,
      isCustomizedBuiltIn?: string,
      vnodeProps?: (VNodeProps & { [key: string]: any }) | null
    ): HostElement
    createText(text: string): HostNode
    createComment(text: string): HostNode
    setText(node: HostNode, text: string): void
    setElementText(node: HostElement, text: string): void
    parentNode(node: HostNode): HostElement | null
    nextSibling(node: HostNode): HostNode | null

    // opcional, específico ao DOM
    querySelector?(selector: string): HostElement | null
    setScopeId?(el: HostElement, id: string): void
    cloneNode?(node: HostNode): HostNode
    insertStaticContent?(
      content: string,
      parent: HostElement,
      anchor: HostNode | null,
      isSVG: boolean
    ): [HostNode, HostNode]
  }
  ```

- **Exemplo**

  ```js
  import { createRenderer } from '@vue/runtime-core'

  const { render, createApp } = createRenderer({
    patchProp,
    insert,
    remove,
    createElement
    // ...
  })

  // `render` é a API de baixo nível
  // `createApp` retorna a instância da aplicação
  export { render, createApp }

  // exporta novamente as APIs de núcleo do Vue
  export * from '@vue/runtime-core'
  ```

  O próprio `@vue/runtime-dom` do Vue é [implementado usando a mesma API](https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/index.ts). Para uma implementação mais simples, confira [`@vue/runtime-test`](https://github.com/vuejs/core/blob/main/packages/runtime-test/src/index.ts) que é um pacote privado para teste unitário próprio do Vue.
