# APIs de Função de Renderização {#render-function-apis}

## h() {#h}

Cria nós de virtual DOM (vnodes).

- **Type**

  ```ts
  // assinatura completa
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // omitindo propiedades
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Os tipos são simplificados para facilitar a leitura.

- **Detalhes**

  O primeiro argumento pode ser uma string (para elementos nativos) ou uma definição de componente Vue. O segundo argumento são os propriedades a serem passadas ​​e o terceiro argumento são os filhos.

  Ao criar um vnode de componente, os filhos devem ser passados ​​como funções de slot. Uma única função de slot pode ser passada se o componente esperar apenas o slot padrão. Caso contrário, os slots devem ser passados ​​como um objeto de funções de slot.

  Por conveniência, o argumento de propriedades pode ser omitido quando o filho não for um objeto slots.

- **Exemplo**

  Criando elementos nativos:

  ```js
  import { h } from 'vue'

  // todos os argumentos exceto o tipo são opcionais
  h('div')
  h('div', { id: 'foo' })

  // ambos atributos e propriedades podem ser usados ​​em propriedades
  // Vue escolhe automaticamente o caminho certo para atribuí-los
  h('div', { class: 'bar', innerHTML: 'hello' })

  // class e style tem o mesmo object / array
  // suporte de valor como em templates
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // event listeners devem ser passados como onXxx
  h('div', { onClick: () => {} })

  // filhos podem ser uma string
  h('div', { id: 'foo' }, 'hello')

  // propriedades podem ser omitidos quando não há propriedades
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // o array de filhos pode conter vnodes e strings misturados
  h('div', ['hello', h('span', 'hello')])
  ```

  Criando componentes:

  ```js
  import Foo from './Foo.vue'

  // passando propriedades
  h(Foo, {
    // equivalente a some-prop="hello"
    someProp: 'hello',
    // equivalente a @update="() => {}"
    onUpdate: () => {}
  })

  // passando default slot único
  h(Foo, () => 'default slot')

  // passando slots nomeados
  // observe que o `null` é necessário para evitar
  // que o objeto slots seja tratado como propriedades
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **Veja também:** [Guia - Funções de Renderização - Criando VNodes](/guide/extras/render-function.html#creating-vnodes)

## mergeProps() {#mergeprops}

Mesclar vários objetos de propriedades com tratamento especial para determinadas propriedades.

- **Type**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Detalhes**

  `mergeProps()` suporta a fusão de vários objetos de propriedades com tratamento especial para as seguintes propriedades:

  - `class`
  - `style`
  - `onXxx` event listeners - vários listeners com o mesmo nome serão mesclados em um array.

  Se você não precisa do comportamento de mesclagem e deseja substituições simples, a dispersão de objetos nativos pode ser usada.

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

## cloneVNode() {#clonevnode}

Clona um vnode.

- **Type**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Detalhes**

  Retorna um vnode clonado, opcionalmente com propriedades extras para mesclar com o original.

  Os Vnodes devem ser considerados imutáveis ​​depois de criados e você não deve modificar as propriedades de um vnode existente. Em vez disso, clone-o com propriedades diferentes/extras.

  Os Vnodes têm propriedades internas especiais, portanto, cloná-los não é tão simples quanto um object spread. `cloneVNode()` lida com a maior parte da lógica interna.

- **Exemplo**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Verifica se um valor é um vnode.

- **Type**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

Para resolver manualmente um componente registrado por nome.

- **Type**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Detalhes**

  **Nota: você não precisa disso se puder importar o componente diretamente.**

  `resolveComponent()` deve ser chamado dentro <span class="composition-api"> de cada `setup()` ou</span> da função render para resolver a partir do contexto de componente correto.

  Se o componente não for encontrado, um aviso de tempo de execução será emitido e a string do nome será retornada.

- **Exemplo**

  <div class="composition-api">

  ```js
  const { h, resolveComponent } = Vue

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
  const { h, resolveComponent } = Vue

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **Veja também:** [Guia - Funções de Renderização - Componentes](/guide/extras/render-function.html#components)

## resolveDirective() {#resolvedirective}

Para resolver manualmente uma diretiva registrada por nome.

- **Type**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Detalhes**

  **Nota: você não precisa disso se pode importar o componente diretamente.**

  `resolveDirective()` deve ser chamado dentro <span class="composition-api"> de `setup()` ou</span> da função de renderização para resolver a partir do contexto de componente correto.

  Se a diretiva não for encontrada, um aviso de tempo de execução será emitido e a função retornará `undefined`.

- **Veja também:** [Guia - Funções de renderização - Diretivas customizadas](/guide/extras/render-function.html#custom-directives)

## withDirectives() {#withdirectives}

Para adicionar diretiva customizada ao vnodes.

- **Type**

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

  Envolve um vnode existente com diretivas personalizadas. O segundo argumento é uma matriz de diretivas personalizadas. Cada diretiva personalizada também é representada como uma matriz na forma de `[Directive, value, argument, modifiers]`. Os elementos finais da matriz podem ser omitidos se não forem necessários.

- **Exemplo**

  ```js
  import { h, withDirectives } from 'vue'

  // uma diretiva customizada
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

- **Veja também:** [Guia - Funções de Renderização - Diretivas Customizadas](/guide/extras/render-function.html#custom-directives)

## withModifiers() {#withmodifiers}

Para adicionar [modificadores `v-on`](/guide/essentials/event-handling.html#event-modifiers) integrados a uma função de manipulação de eventos.

- **Type**

  ```ts
  function withModifiers(fn: Function, modifiers: string[]): Function
  ```

- **Exemplo**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // equivalente a v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **Veja também:** [Guia - Funções de Renderização - Modificadores de evento](/guide/extras/render-function.html#event-modifiers)
