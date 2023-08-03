# API de Composição: `setup()` {#composition-api-setup}

## Uso Básico {#basic-usage}

O gancho `setup()` serve como o ponto de entrada para o uso da API de Composição nos componentes nos seguintes casos:

1. Uso da API de Composição sem uma etapa de construção;
2. Integração do código baseado na API de Composição num componente de API de Opções.

:::info Nota
Se estivermos a usar a API de Composição com Componentes de Ficheiro Único, [`<script setup>`](/api/sfc-script-setup) é fortemente recomendado para uma sintaxe mais sucinta e ergonómica.
:::

Nós podemos declarar estado reativo usando as [APIs de Reatividade](./reactivity-core) e expo-las ao modelo de marcação retornando um objeto a partir da `setup()`. As propriedades do objeto retornado também serão disponibilizadas na instância do componente (se outras opções forem usadas):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // expor ao modelo de marcação e
    // a outros ganchos da API de opções
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

As [referências](/api/reactivity-core#ref) retornadas a partir de `setup` são [desembrulhadas superficialmente de maneira automática](/guide/essentials/reactivity-fundamentals#deep-reactivity) quando acessadas no modelo para que não precisemos de chamar `.value` quando as acessamos. Elas também são desembrulhadas da mesma forma quando acessadas pelo `this`.

`setup()` em si não possui qualquer acesso à instância do componente - `this` terá um valor de `undefined` dentro de `setup()`. Nós podemos acessar os valores expostos pela API de Composição através da API de Opções, mas não o contrário.

`setup()` deve retornar um objeto de maneira síncrona. O único caso em que `async setup()` pode ser usado é quando o componente é descendente dum componente [Suspense](../guide/built-ins/suspense).

## Acessando Propriedades {#accessing-props}

O primeiro argumento na função `setup` é o argumento `props`. Tal como esperaríamos num componente padrão, `props` dentro da função `setup` são reativas e serão atualizadas quando novas propriedades forem passadas.

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

Note que se desestruturarmos o objeto `props`, as variáveis desestruturadas perderão a reatividade. É portanto recomendado sempre acessá-las na forma de `props.xxx`.

Se realmente precisarmos de desestruturar as propriedades, ou precisarmos passar uma propriedade à uma função externa enquanto preserva-se a reatividade, podemos fazer isto com as APIs utilitárias [toRefs()](./reactivity-utilities#torefs) e [toRef()](/api/reactivity-utilities#toref):

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // tornar `props` num objeto de referências, então desestruturar
    const { title } = toRefs(props)
    // `title` é uma referência que monitoriza `props.title`
    console.log(title.value)

    // OU, tornar uma única propriedade em `props` numa referência
    const title = toRef(props, 'title')
  }
}
```

## Contexto de Configuração {#setup-context}

O segundo argumento passado à função `setup` é um objeto **Contexto de Configuração**. O objeto de contexto expõe outros valores que podem ser úteis dentro de `setup`:

```js
export default {
  setup(props, context) {
    // Atributos (Objeto não reativo, equivalente a $attrs)
    console.log(context.attrs)

    // Ranhuras (Objeto não reativo, equivalente a $slots)
    console.log(context.slots)

    // Emite eventos (Função, equivalente a $emit)
    console.log(context.emit)

    // Expõe propriedades públicas (Função)
    console.log(context.expose)
  }
}
```

O objeto de contexto não é reativo e pode ser seguramente desestruturado:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` e `slots` são objetos com estado que sempre são atualizados quando o próprio componente é atualizado. Isso significa que você deve evitar desestruturá-los e sempre referenciar propriedades como `attrs.x` ou `slots.x`. Também perceba que ao contrário de `props`, as propriedades `attrs` e `slots` **não** são reativas. Se você pretende aplicar efeitos colaterais com base em mudanças em `attrs` ou `slots`, você deve fazer dentro do gatilho de ciclo de vida `onBeforeUpdate`.

### Expondo Propriedades Públicas {#exposing-public-properties}

`expose` é uma função que pode ser usada para limitar explicitamente as propriedades expostas quando a instância do componente é acessada por um componente pai através de [referências do modelo](/guide/essentials/template-refs#ref-on-component):

```js{5,10}
export default {
  setup(props, { expose }) {
    // tornar a instância "fechada" -
    // por exemplo, não expõe qualquer coisa ao pai
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // expõe o estado local seletivamente
    expose({ count: publicCount })
  }
}
```

## Uso com Funções de Interpretação {#usage-with-render-functions}

`setup` também pode retornar uma [função de interpretação](/guide/extras/render-function) que pode fazer uso diretamente do estado reativo declarado no mesmo âmbito:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Retornar uma função de interpretação guarda-nos de retornar qualquer outra coisa. Internamente isto não deveria ser um problema, mas pode ser problemático se quisermos expor métodos deste componente para o componente pai através de referências de modelo de marcação.

Nós podemos resolver esse problema chamando [`expose()`](#exposing-public-properties):

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

O método `increment` estaria então disponível no componente pai através duma referência de modelo de marcação.
