# API de Composição: setup() {#composition-api-setup}

:::info Nota
Esta página documenta a utilização da opção de componente `setup`. Se você estiver utilizando a API de Composição com Componentes de Arquivo Único, [`<script setup>`](/api/sfc-script-setup.html) é recomendado para uma sintaxe mais ergonômica e sucinta.
:::

O gancho `setup()` serve como o ponto de entrada para a utilização da API de Composição em componentes nos seguintes casos:

1. Utilizando a API de Composição sem uma etapa de _build_;
2. Integrando código baseado na API de Composição em um componente feito com a API de Opções.

## Utilização Básica {#basic-usage}

Podemos declarar estado reativo usando as [APIs de Reatividade](./reactivity-core.html) e expô-los ao modelo retornando um objeto de `setup()`. As propriedades do objeto retornado serão disponibilizadas na instância do componente (se outras opções forem usadas):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // expõe ao modelo e a outros ganchos da API de opções
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

[refs](/api/reactivity-core.html#ref) retornadas do `setup` são [desembrulhadas automaticamente](/guide/essentials/reactivity-fundamentals.html#deep-reactivity) quando acessadas no modelo para que você não precise chamar `.value` para lê-las. Elas também são desembrulhadas da mesma forma quando acessadas pelo `this`.

`setup()` em si não possui qualquer instância de componente - `this` terá um valor `undefined` dentro de `setup()`. Você pode acessar valores expostos pela API de Composição através da API de Opções, mas não o contrário.

`setup()` deve retornar um objeto de forma _síncrona_. O único caso em que `async setup()` pode ser usado é quando o componente é descendente de um componente [Suspense](../guide/built-ins/suspense.html).

## Acessando Props {#accessing-props}

O primeiro argumento da função `setup` é o argumento `props`. Assim como você esperaria em um componente tradicional, `props` dentro da função `setup` são reativas e serão atualizadas quando novas props foram passadas.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Note que se você desestruturar o objeto props, as variáveis desestruturadas perderão a reatividade. Portanto é recomendado sempre acessá-las no formato `props.xxx`.

Se você realmente precisar desestruturar as props, ou precisar passar uma prop para uma função externa enquanto mantém a reatividade, você pode fazer isso com as APIs utilitárias [toRefs()](./reactivity-utilities.html#torefs) e [toRef()](/api/reactivity-utilities.html#toref):

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // transforme `props` em um objeto de refs, então desestruture
    const { title } = toRefs(props)
    // `title` é uma ref que monitora `props.title `
    console.log(title.value)

    // OU, transforme cada propriedade das `props` em uma ref
    const title = toRef(props, 'title')
  }
}
```

## Contexto Setup {#setup-context}

O segundo argumento passado para a função `setup` é um objeto **Contexto Setup**. O objeto contexto expõe outros valores que podem ser úteis dentro de `setup`:

```js
export default {
  setup(props, context) {
    // Atributos (Objeto não reativo, equivalente a $attrs)
    console.log(context.attrs)

    // Slots (Objeto não reativo, equivalente a $slots)
    console.log(context.slots)

    // Emitir eventos (Função, equivalente a $emit)
    console.log(context.emit)

    // Expõe propriedades públicas (Função)
    console.log(context.expose)
  }
}
```

O objeto contexto não é reativo e pode ser desestruturado de forma segura:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` e `slots` são objetos com estado que sempre são atualizados quando o próprio componente é atualizado. Isso significa que você deve evitar desestruturá-los e sempre referenciar propriedades como `attrs.x` ou `slots.x`. Também perceba que ao contrário de `props`, as propriedades `attrs` e `slots` **não** são reativas. Se você pretende aplicar efeitos colaterais com base em mudanças em `attrs` ou `slots`, você deve fazer dentro do gatilho de ciclo de vida `onBeforeUpdate`.

### Expondo Propriedades Públicas {#exposing-public-properties}

`expose` é uma função que pode ser usada para limitar explicitamente as propriedades expostas quando a instância do componente é acessada por um componente pai através de [referências do modelo](/guide/essentials/template-refs.html#ref-on-component):

```js{5,10}
export default {
  setup(props, { expose }) {
    // torna a instância "fechada" -
    // i.e. não expõe qualquer coisa ao pai
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // expõe o estado local seletivamente
    expose({ count: publicCount })
  }
}
```

## Utilização com Funções Render {#usage-with-render-functions}

`setup` também pode retornar uma [função render](/guide/extras/render-function.html) que pode fazer uso diretamente do estado reativo declarado no mesmo escopo:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Retornar uma função render nos previne de retornar qualquer outra coisa. Internamente isto não deveria ser um problema, mas pode ser problemático se você quiser expor métodos desse componente para o componente pai através de referências de modelo.

Podemos resolver esse problema ao chamar [`expose()`](#exposing-public-properties):

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

O método `increment` então estaria disponível no componente pai através de uma referência de modelo.
