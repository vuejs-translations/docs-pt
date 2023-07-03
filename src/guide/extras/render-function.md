---
outline: deep
---

# Funções de Interpretação & JSX {#render-functions-jsx}

A Vue recomenda usar modelos de marcação para construir aplicações na vasta maioria dos casos. No entanto, existem situações onde precisamos de todo o poder programático da JavaScript. É onde podemos usar a **função de interpretação**.

> Se fores novo para o conceito de DOM virtual e funções de interpretação, certifica-te de ler o capítulo [Mecanismo de Interpretação](/guide/extras/rendering-mechanism) antes deste.

## Uso Básico {#basic-usage}

### Criando Nós de Vue {#creating-vnodes}

A Vue fornece uma função `h()` para criação de nós de Vue:

```js
import { h } from 'vue'

const vnode = h(
  'div', // tipo
  { id: 'foo', class: 'bar' }, // propriedades
  [
    /* filhos */
  ]
)
```

`h()` é abreviação para **hyperscript** - que significa "JavaScript que produz HTML (linguagem de marcação de hipertexto)". Este nome é herdado das convenções partilhadas por muitas implementações do DOM virtual. Uma nome mais descritivo poderia ser `createVnode()`, mas um nome mais curto ajuda quando temos que chamar esta função muitas vezes numa função de interpretação.

A função `h()` está desenhada para ser muito flexível:

```js
// todos os argumentos exceto o tipo são opcionais
h('div')
h('div', { id: 'foo' })

// ambos atributos e propriedades podem ser usados nas propriedades
// a Vue escolhe automaticamente a maneira correta de atribuir
h('div', { class: 'bar', innerHTML: 'hello' })

// os modificadores de propriedade tais como `.prop` e `.attr`
// podem ser adicionados com os prefixos `.` e `^` respetivamente
h('div', { '.name': 'some-name', '^width': '100' })

// a classe e estilo têm o mesmo suporte de valor de objeto e arranjo
// que têm nos modelos de marcação
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// os ouvintes de evento devem ser passados como onXxx
h('div', { onClick: () => {} })

// os filhos podem ser uma sequência de caracteres
h('div', { id: 'foo' }, 'hello')

// as propriedades podem ser omitidas quando não existirem
h('div', 'hello')
h('div', [h('span', 'hello')])

// os arranjos de filhos podem conter nós de vue e
// sequência de caracteres misturados
h('div', ['hello', h('span', 'hello')])
```

O nó de vue resultante tem a seguinte forma:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning NOTA
A interface de `VNode` completa contém muitas outras propriedades internas, mas é fortemente recomendado evitar depender de quaisquer outras propriedades além das listadas aqui. Isto evita rutura não intencional no caso das propriedades internas forem mudadas.
:::

### Declarando as Funções de Interpretação {#declaring-render-functions}

<div class="composition-api">

Quando usamos os modelos de marcação com a API de Composição, o valor de retorno do gatilho `setup()` é usado para expor os dados ao modelo de marcação. Quando usamos as funções de interpretação, no entanto, podemos retornar diretamente a função de interpretação:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // retorna a função de interpretação
    return () => h('div', props.msg + count.value)
  }
}
```

A função de interpretação é declarada dentro de `setup()` assim naturalmente tem acesso às propriedades e qualquer estado reativo declarado no mesmo âmbito.

Além de retornar um único nó de vue, podemos também retornar sequências de caracteres ou arranjos:

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // usar um arranjo para retornar vários nós de raiz
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
Certifica-te de retornar uma função ao invés de retornar diretamente os valores! A função `setup` é chamada apenas uma vez por componente, enquanto a função de interpretação será chamada várias vezes.
:::

</div>
<div class="options-api">

Nós podemos declarar as funções de interpretação usando a opção `render`:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

A função `render()` tem acesso à instância do componente através de `this`.

Além de retornar um único nó de vue, podemos também retornar sequências de caracteres ou arranjos:

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // usar um arranjo para retornar vários nós de raiz
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

Se um componente de função de interpretação não precisar de nenhum estado da instância, também podem ser declarados diretamente como uma função por brevidade:

```js
function Hello() {
  return 'hello world!'
}
```

Exatamente, isto é um componente de Vue válido! Consulte os [Componentes Funcionais](#functional-components) por mais detalhes a respeito desta sintaxe.

### Nós de Vue Devem Ser Únicos {#vnodes-must-be-unique}

Todos os nós de Vue na árvore de componente devem ser únicos. Isto significa que a seguinte função de interpretação é inválida:

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Yikes - nós de Vue duplicados!
    p,
    p
  ])
}
```

Se realmente quisermos duplicar o mesmo elemento ou componente várias vezes, podemos fazer isto com uma função de fábrica. Por exemplo, a seguinte função de interpretação é uma maneira perfeitamente válida de desenhar 20 parágrafos idênticos:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

A [JSX](https://facebook.github.io/jsx/) é uma extensão parecida com a XML para a JavaScript que permite-nos escrever código como este:

```jsx
const vnode = <div>hello</div>
```

No lugar das expressões de JSX, use chavetas para valores dinâmicos embutidos:

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

Ambas `create-vue` e a interface da linha de comando da Vue têm opções para estruturar projetos com suporte de JSX pré-configurado. Se estiveres a configurar a JSX manualmente, consulte a documentação da [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) por detalhes.

Embora introduzida primeiro pela React, a JSX na realidade não semânticas de execução definida e pode ser compilada para várias saídas diferentes. Se trabalhaste com a JSX antes, nota que a **transformação de JSX da Vue é diferente da transformação de JSX da React**, então não podes usar a transformação de JSX da React nas aplicações de Vue. Algumas diferenças notáveis da JSX da React incluem:

- Nós podemos usar atributos de HTML tais como `class` e `for` como propriedades - sem precisar de usar `className` ou `htmlFor`.
- A passagem de filhos para os componentes (por exemplos, ranhuras) [funciona de maneira diferente](#passing-slots).

A definição de tipo da Vue também fornece inferência de tipo para o uso de TSX. Quando usares TSX, certifica-te de especificar `"jsx": "preserve"` no `tsconfig.json` para que a TypeScript deixe a sintaxe de JSX intacta para a transformação de JSX da Vue processar.

### Inferência de Tipo da JSX {#jsx-type-inference}

Semelhante a transformação, a JSX da Vue também precisa de definições de tipo diferentes. Atualmente, os tipos da Vue registam os tipos de JSX da Vue globalmente. Isto significa que a TSX funcionará fora da caixa quando o tipo da Vue estiver disponível.

Os tipos de JSX globais podem causar conflitos quando usados juntos com outras bibliotecas que também precisam da inferência de tipo de JSX, em especial React. Desde a versão 3.3, a Vue suporta a especificação de espaço reservado de JSX através da opção [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) da TypeScript. Nós planeamos remover o registo de espaço reservado de JSX global padrão na versão 3.4 da Vue.

Para os utilizadores de TSX, é sugerido definir [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) para `vue` no `tsconfig.json` depois de atualizar para 3.3, optar por participar por ficheiro com `/* @jsxImportSource vue */`. Isto permitir-te-á optar para o novo comportamento agora e atualiza de maneira transparente quando 3.4 ser lançada.

Se existir código que depende da presença do espaço reservado `JSX` global, podes reter o comportamento global exato antes da 3.4 fazendo referência de maneira explicita ao `vue/jsx`, que regista o espaço reservado de `JSX` global.

## Receitas de Função de Interpretação {#render-function-recipes}

Abaixo fornecemos algumas receitas comuns para implementar funcionalidades do modelo de marcação conforme as suas funções de interpretação ou JSX equivalentes.

### `v-if` {#v-if}

Modelo de marcação:

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

Função de interpretação ou JSX equivalente:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for` {#v-for}

Modelo de marcação:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Função de interpretação ou JSX equivalente:

<div class="composition-api">

```js
h(
  'ul',
  // assumindo que `items` é uma referência com valor de arranjo
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

As propriedades com nomes que começam com `on` seguido por uma letra maiúscula são tratadas como ouvintes de evento. Por exemplo, `onClick` é o equivalente de `@click` nos modelos de marcação:

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'click me'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  click me
</button>
```

#### Modificadores de Evento {#event-modifiers}

Para os modificadores de evento `.passive`, `.capture`, `.once`, podem ser concatenados depois do nome de evento usando caixa de camelo.

Por exemplo:

```js
h('input', {
  onClickCapture() {
    /* ouvinte em mode de captura */
  },
  onKeyupOnce() {
    /* aciona apenas uma vez */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Para outros modificadores de chave e evento, o auxiliar [`withModifiers`](/api/render-function#withmodifiers) pode ser usado:

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Componentes {#components}

Para criar um nó de Vue para um componente, o primeiro argumento passado para `h()` deve ser a definição do componente. Isto significa que quando usamos funções de interpretação, é desnecessário registar componentes - podemos apenas usar os componentes importados diretamente:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Conforme podemos ver, `h` pode trabalhar com os componentes importados a partir de qualquer formato de ficheiro enquanto for um componente de Vue válido.

Os componentes dinâmicos são diretos com as funções de interpretação:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Se um componente for registado pelo nome e não puder ser importado diretamente (por exemplo, registado globalmente por uma biblioteca), isto pode ser resolvido programaticamente usando a auxiliar [`resolveComponent()`](/api/render-function#resolvecomponent).

### Interpretando Ranhuras {#rendering-slots}

<div class="composition-api">

Nas funções de interpretação, as ranhuras podem ser acessadas a partir do contexto de `setup()`. Cada ranhura no objeto `slots` é uma **função que retorna um arranjo de nós de Vue**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // ranhura padrão:
      // <div><slot /></div>
      h('div', slots.default()),

      // ranhura nomeada:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

Equivalente de JSX:

```jsx
// padrão
<div>{slots.default()}</div>

// nomeada
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

Nas funções de interpretação, as ranhuras podem ser acessadas a partir da [`this.$slots`](/api/component-instance#slots):

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

Equivalente de JSX:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Passando Ranhuras {#passing-slots}

A passagem de filhos para os componentes funciona de maneira um pouco diferente da passagem de filhos para os elementos. No lugar dum arranjo, precisamos passar ou uma função de ranhura, ou um objeto de funções de ranhura. As funções de ranhura podem retornar qualquer coisa que uma função de interpretação normal pode retornar - o que sempre será normalizado para os arranjos de nós de Vue quando acessado no componente filho:

```js
// ranhura padrão única
h(MyComponent, () => 'hello')

// ranhuras nomeadas
// repara que o `null` é obrigatório para evitar
// que o objeto de ranhuras seja tratado como propriedade
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

Equivalente de JSX:

```jsx
// padrão
<MyComponent>{() => 'hello'}</MyComponent>

// nomeado
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

Passar as ranhuras como funções as permite serem invocadas preguiçosamente pelo componente filho. Isto leva as dependências da ranhura a serem rastreadas pelo filho no lugar do pai, o que resulta em atualizações mais precisas e eficientes.

### Componentes Embutidos {#built-in-components}

Os [componentes embutidos](/api/built-in-components) tais como `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` e `<Suspense>` devem ser importados para uso nas funções de interpretação:

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

A diretiva `v-model` é expandida para as propriedades `modelValue` e `onUpdate:modelValue` durante a compilação do modelo de marcação — teremos de fornecer estas propriedades nós mesmos:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Diretivas Personalizadas {#custom-directives}

As diretivas personalizadas podem ser aplicadas à um nó de Vue usando [`withDirectives`](/api/render-function#withdirectives):

```js
import { h, withDirectives } from 'vue'

// uma diretiva personalizada
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

Se a diretiva for registada pelo nome e puder ser importada diretamente, isto pode ser resolvido usando a auxiliar [`resolveDirective`](/api/render-function#resolvedirective).

### Referências do Modelo de Marcação {#template-refs}

<div class="composition-api">

Com a API de Composição, as referências do modelo de marcação são criadas passando a própria `ref()` como uma propriedade ao nó de Vue:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```

</div>
<div class="options-api">

Com a API de Opções, as referências do modelo de marcação são criadas passando o nome da referência como uma sequência de caracteres nas propriedades do nó de Vue: 

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Componentes Funcionais {#functional-components}

Os componentes funcionais são uma forma alternativa do componente que não tem nenhum estado por si mesmo. Eles agem como funções puras: propriedades entram, e nós de Vue saem. Eles são desenhados sem criar uma instância de componente (por exemplo, sem `this`), e sem os gatilhos do ciclo de vida do componente habitual.

Para criar um componente funcional usamos uma função simples, no lugar dum objeto de opções. A função é efetivamente a função `render` para o componente.

<div class="composition-api">

A assinatura dum componente funcional é a mesmo do gatilho `setup`:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

Já que não existe referência de `this` para um componente funcional, a Vue passará as `props` como primeiro argumento:

```js
function MyComponent(props, context) {
  // ...
}
```

O segundo argumento, `context`, contém três propriedades: `attrs`, `emit` e `slots`. Existem equivalentes para as propriedades [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit), e [`$slots`](/api/component-instance#slots) da instância respetivamente.

</div>

A maioria das opções de configuração habitual para os componentes não estão disponíveis para os componentes funcionais. No entanto, é possível definir [`props`](/api/options-state#props) e [`emits`](/api/options-state#emits) adicionando-as como propriedades:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

Se a opção `props` não for especificada, então o objeto `props` passado para a função função conterá todos os atributos, os mesmos que a `attrs`. Os nomes da propriedade não serão normalizados para caixa de camelo ao menos que a opção `props` seja especificada.

Para os componentes funcionais com `props` explicita, a [herança de atributo](/guide/components/attrs) funciona da mesmíssima maneira que os componentes normais. No entanto, para os componentes funcionais que não especificam explicitamente as suas `props`, apenas a `class`, `style` e ouvintes de evento `onXxx` serão herdados das `attrs` por padrão. Em ambos casos, `inheritAttrs` pode ser definido para `false` para desativar a herança de atributo:

```js
MyComponent.inheritAttrs = false
```

Os componentes funcionais podem ser registados e consumidos tal como os componentes normais. Se passarmos uma função como primeiro argumento para `h()`, será tratada como um componente funcional.
