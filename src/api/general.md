# API Global: Geral {#global-api-general}

## version {#version}

Expõe a versão existente do Vue.

- **Tipo:** `string`

- **Exemplo**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Uma utilidade para esperar o próximo fluxo de atualização do DOM.

- **Tipo**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Detalhes**

  Quando você muda um estado reativo no Vue, as atualizações de DOM resultantes não são aplicadas sincronamente. Em vez disso, o Vue acumula essas mudanças até o "próximo tick" para garantir que cada componente seja atualizado apenas uma vez, não importando quantas mudanças de estado você tenha realizado.

  `nextTick()` pode ser usado imediatamente depois de uma mudança de estado para esperar as atualizações do DOM se concluírem. Você pode tanto passar uma função de retorno como argumento, ou aguardar pela Promise retornada.

- **Exemplo**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM ainda não atualizado
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM agora atualizado
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

        // DOM ainda não atualizado
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM agora atualizado
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

- **Veja também:** [`this.$nextTick()`](/api/component-instance.html#nexttick)

## defineComponent() {#definecomponent}

Um auxiliar de tipo para definir um componente Vue com inferência de tipos.

- **Tipo**

  ```ts
  function defineComponent(
    component: ComponentOptions | ComponentOptions['setup']
  ): ComponentConstructor
  ```

  > Tipo está simplificado por legibilidade.

- **Detalhes**

  O primeiro argumento espera um objeto de opções de componente. O valor retornado será o mesmo objeto de opções, uma vez que a função é essencialmente um tempo de execução sem operações com o único propósito de inferir o tipo.

  Perceba que o tipo de retorno é um pouco especial: ele será um construtor de tipo do qual a instância de tipo é a instância do componente inferido baseada nas opções. Isso é usado para inferir o tipo quando o tipo retornado é usado como uma _tag_ em TSX.

  Você pode extrair o tipo de instância do componente (equivalente ao tipo do `this` em suas opções) do tipo de retorno do `defineComponent()` desta forma:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Nota sobre o _Treeshaking_ do webpack

  Como o `defineComponent()` é uma chamada de função, pode parecer que ela produzirá efeitos colaterais em algumas ferramentas de _build_, e.g. webpack. Isso irá prevenir que o componente seja _tree-shaken_ mesmo quando o componente nunca for usado.

  Para comunicar ao webpack que esta chamada de função é segura para ser _tree-shaken_, você pode adicionar a notação `/*#__PURE__*/` como comentário antes da chamada da função:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Observe que isto não é necessário se você estiver usando Vite, porque o Rollup (o _bundler_ estrutural de produção usado pelo Vite) é inteligente o bastante para determinar que o `defineComponent()` é de fato livre de efeitos colaterais, sem qualquer necessidade de anotações manuais.

- **Veja também:** [Guia - Utilizar Vue com TypeScript](/guide/typescript/overview.html#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

Define um componente assíncrono que é carregado ociosamente quando é interpretado. O argumento pode ser tanto uma função carregadora, ou um objeto de opções para um controle mais avançado do comportamento de carregamento.

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

- **Veja também:** [Guia - Componentes Assíncronos](/guide/components/async.html)

## defineCustomElement() {#definecustomelement}

Este método aceita o mesmo argumento que [`defineComponent`](#definecomponent), mas este retorna uma classe construtora de [Elemento Personalizado](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) nativo.

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

  O valor de retorno é um construtor de elemento personalizado que pode ser registrado usando [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Exemplo**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* opções de componente */
  })

  // Registra o elemento personalizado.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Veja também:**

  - [Guia - Construindo Elementos Personalizados com Vue](/guide/extras/web-components.html#building-custom-elements-with-vue)

  - Note também que `defineCustomElement()` exige uma [configuração especial](/guide/extras/web-components.html#sfc-as-custom-element) ao ser usado com Componentes de Arquivo Único.
