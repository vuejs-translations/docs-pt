# API Global: Geral {#global-api-general}

## `version` {#version}

Expõe a versão atual da Vue.

- **Tipo:** `string`

- **Exemplo**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## `nextTick()` {#nexttick}

Um utilitário para esperar o próximo fluxo de atualização do DOM.

- **Tipo**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Detalhes**

  Quando mudamos o estado reativo na Vue, as atualizações do DOM resultantes não são aplicadas de maneira síncrona. Em vez disso, a Vue amortece-as até o "próximo tiquetaque" para garantir que cada componente atualize apenas uma vez, não importa quantas mudanças de estado tenhamos realizado.

  `nextTick()` pode ser usado imediatamente depois de uma mudança de estado para esperar as atualizações do DOM concluírem. Nós podemos ou passar uma função de resposta como argumento, ou aguardar pela promessa retornada.

- **Exemplo**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM ainda não foi atualizado
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM agora está atualizado
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM ainda não foi atualizado
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM agora está atualizado
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **Consulte também:** [`this.$nextTick()`](/api/component-instance#nexttick)

## `defineComponent()` {#definecomponent}

Um auxiliar de tipo para definir um componente de Vue com inferência de tipos.

- **Tipo**

  ```ts
  function defineComponent(
    component: ComponentOptions | ComponentOptions['setup']
  ): ComponentConstructor
  ```

  > O tipo está simplificado por legibilidade.

- **Detalhes**

  O primeiro argumento espera um objeto de opções de componente. O valor retornado será o mesmo objeto de opções, uma vez que a função é essencialmente um tempo de execução sem operações com o único propósito de inferir o tipo.

  Perceba que o tipo de retorno é um pouco especial: ele será um construtor de tipo do qual a instância de tipo é a instância do componente inferido baseada nas opções. Isso é usado para inferir o tipo quando o tipo retornado é usado como um marcador em TSX.

  Nós podemos extrair o tipo de instância do componente (equivalente ao tipo do `this` em suas opções) do tipo de retorno do `defineComponent()` desta forma:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Assinatura da Função <sup class="vt-badge" data-text="3.3+" /> {#function-signature}

  `defineComponent()` também tem uma assinatura alternativa que está destinada à ser usada com a API de Composição e as [funções de interpretação ou JSX](/guide/extras/render-function).

  Ao invés da passagem dum objeto de opções, uma função é esperada. Esta função funciona da mesma maneira que a função [`setup()`](/api/composition-api-setup#composition-api-setup) da API de Composição: ela recebe as propriedades e o contexto de configuração. O valor de retorno deve ser uma função de interpretação - ambos `h()` e JSX são suportados:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // usar a API de Composição como no <script setup>
      const count = ref(0)

      return () => {
        // função de interpretação ou JSX
        return h('div', count.value)
      }
    },
    // opções adicionais, por exemplo, declarar propriedades e emissões
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  O caso de uso principal para esta assinatura é com a TypeScript (e em especial com a TSX), visto que suporta genéricos:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // usar a API de Composição como no <script setup>
      const count = ref(0)

      return () => {
        // função de interpretação ou JSX
        return <div>{count.value}</div>
      }
    },
    // declaração de propriedades de tempo de execução manual
    // atualmente ainda é necessária.
    {
      props: ['msg', 'list']
    }
  )
  ```

  No futuro, planeamos fornecer uma extensão de Babel que infere e injeta automaticamente as propriedades de tempo de execução (como para `defineProps` nos componentes de ficheiro único) para que a declaração de propriedades de tempo de execução possam ser emitidas.

  ### Nota sobre a agitação de árvores da Webpack {#note-on-webpack-treeshaking}

  Uma vez que `defineComponent()` é uma chamada de função, poderia parecer que produziria efeitos colaterais para algumas ferramentas de construção, por exemplo, Webpack. Isto prevenirá o componente de ter a árvore agitada mesmo quando o componente nunca for usado.

  Para dizer à Webpack que esta chamada de função está segura para ter a árvore agitada, podes adicionar uma notação de comentário `/*#__PURE__*/` antes da chamada da função:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Nota que isto não é necessário se estivermos a usar a Vite, porque a Rollup (o empacotador de produção subjacente usado pela Vite) é inteligente o suficiente para determinar que `defineComponent` está de fato livre de efeito colateral sem a necessidade de notações manuais.

- **Consulte também:** [Guia - Usar a Vue com a TypeScript](/guide/typescript/overview#general-usage-notes)

## `defineAsyncComponent()` {#defineasynccomponent}

Define um componente assíncrono que é carregado preguiçosamente apenas quando é interpretado. O argumento pode ser ou uma função carregadora, ou um objeto de opções para controlo mais avançado do comportamento de carregamento.

- **Tipo**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **Consulte também:** [Guia - Componentes Assíncronos](/guide/components/async)

## `defineCustomElement()` {#definecustomelement}

Este método aceita o mesmo argumento que [`defineComponent`](#definecomponent), porém este retorna um construtor de classe de [Elemento Personalizado](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) nativo.

- **Tipo**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Tipo está simplificado para legibilidade.

- **Detalhes**

  Além das opções normais de componente, o `defineCustomElement()` também suporta uma opção especial `styles`, que deve ser um _array_ de strings CSS alinhadas, para fornecer CSS que será injetado na _shadow root_ do elemento.
  Além das opções normais do componente, a `defineCustomElement()` também suporta uma opção especial `styles`, que deve ser um vetor de sequências de caracteres sublinhadas, para fornecer CSS que deve ser injetado na raiz da sombra do elemento.

  O valor de retorno é um construtor de elemento personalizado que pode ser registado usando [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Exemplo**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* opções do componente */
  })

  // Registar o elemento personalizado.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Consulte também:**

  - [Guia - Construindo Elementos Personalizados com Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Note também que `defineCustomElement()` exige uma [configuração especial](/guide/extras/web-components#sfc-as-custom-element) ao ser usado com Componentes de Ficheiro Único.
