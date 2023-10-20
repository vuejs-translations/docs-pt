# APIs da Função de Interpretação {#render-function-apis}

## `h()` {#h}

Cria nós do DOM virtual (vnodes).

- **Tipo**

  ```ts
  // assinatura completa
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // omitindo propriedades
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Os tipos foram simplificados para fins de legibilidade.

- **Detalhes**

  O primeiro argumento pode ser ou uma sequência de caracteres (para os elementos nativos) ou uma definição de componente da Vue. O segundo argumento são as propriedades à serem passadas, e o terceiro são os filhos.

  Quando criamos um nó virtual de componente, os filhos devem ser passados como funções de ranhura. Uma única função de ranhura pode ser passada se o componente esperar apenas a ranhura padrão. De outro modo, as ranhuras devem ser passadas como um objeto de funções de ranhura.

  Por conveniência, o argumento de propriedades pode ser omitido quando os filhos não forem um objeto de ranhuras.

- **Exemplo**

  Criando elementos nativos:

  ```js
  import { h } from 'vue'

  // todos os argumentos exceto o tipo são opcionais
  h('div')
  h('div', { id: 'foo' })

  // ambos atributos e propriedades podem ser usados ​​em propriedades
  // a Vue escolhe automaticamente a maneira correta de atribuí-los
  h('div', { class: 'bar', innerHTML: 'hello' })

  // `class` e `style` têm o mesmo objeto ou vetor
  // suporte de valor tal como nos modelos de marcação
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // os ouvintes de evento devem ser passados como `onXxx`
  h('div', { onClick: () => {} })

  // os filhos podem ser uma sequência de caracteres
  h('div', { id: 'foo' }, 'hello')

  // as propriedades podem ser omitidas quando não existirem propriedades
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // o vetor de filhos pode conter nós virtuais e
  // sequências de caracteres misturados
  h('div', ['hello', h('span', 'hello')])
  ```

  Criando componentes:

  ```js
  import Foo from './Foo.vue'

  // passando propriedades
  h(Foo, {
    // equivalente de `some-prop="hello"`
    someProp: 'hello',
    // equivalente de `@update="() => {}"`
    onUpdate: () => {}
  })

  // passando a única ranhura padrão
  h(Foo, () => 'default slot')

  // passando ranhuras nomeadas
  // repara que o `null` é obrigatório para evitar
  // que o objeto de ranhuras seja tratado como propriedades
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **Consulte também** [Guia - Funções de Interpretação - Criando Nós Virtuais](/guide/extras/render-function#creating-vnodes)

## `mergeProps()` {#mergeprops}

Combina vários objetos de propriedades com tratamento especial para certas propriedades.

- **Tipo**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Detalhes**

  `mergeProps()` suporta a fusão de vários objetos de propriedades com tratamento especial para as seguintes propriedades:

  - `class`
  - `style`
  - Ouvintes de evento `onXxx` - vários ouvintes com o mesmo nome serão combinados num vetor.

  Se não precisarmos do comportamento de combinação e quisermos substituições simples, q propagação de objeto nativo pode ser usada.

- **Exemplo**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## `cloneVNode()` {#clonevnode}

Clona um nó virtual.

- **Tipo**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Detalhes**

  Retorna um nó virtual clonado, opcionalmente com propriedades adicionais para combinar com o original.

  Uma vez criados os nós virtuais devem ser considerados imutáveis e não devemos mudar as propriedades dum nó virtual existente. Ao invés disto, o clonamos com propriedades diferentes ou adicionais.

  Os nós virtuais têm propriedades internas especiais, então cloná-los não tão simples quando uma propagação de objeto. `cloneVNode()` manipula a maioria da lógica interna.

- **Exemplo**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## `isVNode()` {#isvnode}

Verifica se um valor é um nó virtual.

- **Tipo**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## `resolveComponent()` {#resolvecomponent}

Para resolver manualmente um componente registado por nome.

- **Tipo**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Detalhes**

  **Nota: não precisamos disto se pudermos importar o componente diretamente.**

  `resolveComponent()` deve ser chamada dentro <span class="composition-api">da `setup()` ou</span> da função de interpretação no sentido de resolver a partir do contexto do componente correto.

  Se o componente não for encontrado, um aviso de execução será emitido, e a sequência de caracteres do nome é retornada.

- **Exemplo**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **Consulte também** [Guia - Funções de Interpretação - Componentes](/guide/extras/render-function#components)

## `resolveDirective()` {#resolvedirective}

Para resolver manualmente uma diretiva registada por nome.

- **Tipo**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Detalhes**

  **Nota: não precisamos disto se pudermos importar a diretiva diretamente.**

  `resolveDirective()` dever chamada dentro <span class="composition-api">da `setup()` ou</span> da função de interpretação no sentido de resolver a partir do contexto do componente correto.

  Se a diretiva não for encontrada, um aviso de execução será emitido, e a função retorna `undefined`.

- **Consulte também** [Guia - Funções de Interpretação - Diretivas Personalizadas](/guide/extras/render-function#custom-directives)

## `withDirectives()` {#withdirectives}

Para adicionar diretivas personalizadas aos nós virtuais.

- **Tipo**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Directive, value, argument, modifiers]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Detalhes**

  Envolve um nó virtual existente com as diretivas personalizadas. O segundo argumento é um vetor de diretivas personalizadas. Cada diretiva personalizada é também representada como um vetor na forma de `[Directive, value, argument, modifiers]`. Os últimos elementos do vetor podem ser omitidos se não forem necessários.

- **Exemplo**

  ```js
  import { h, withDirectives } from 'vue'

  // uma diretiva personalizada
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **Consulte também** [Guia - Funções de Interpretação - Diretivas Personalizadas](/guide/extras/render-function#custom-directives)

## `withModifiers()` {#withmodifiers}

Para adicionar [modificadores de `v-on`](/guide/essentials/event-handling#event-modifiers) embutidos à uma função manipuladora de eventos.

- **Tipo**

  ```ts
  function withModifiers(fn: Function, modifiers: string[]): Function
  ```

- **Exemplo**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // equivalente de `v-on:click.stop.prevent`
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **Consulte também** [Guia - Funções de Interpretação - Modificadores de Evento](/guide/extras/render-function#event-modifiers)
