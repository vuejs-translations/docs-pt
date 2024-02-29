# Gestão de Estado {#state-management}

## O Que é a Gestão de Estado? {#what-is-state-management}

Tecnicamente, cada instância de componente da Vue já "gere" o seu próprio estado reativo. Tomemos como exemplo um simples componente de contador:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// estado
const count = ref(0)

// ações
function increment() {
  count.value++
}
</script>

<!-- visão -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // estado
  data() {
    return {
      count: 0
    }
  },
  // ações
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- visão -->
<template>{{ count }}</template>
```

</div>

É uma unidade autónoma com as seguintes partes:

- O **estado**, a fonte de verdade que orienta a nossa aplicação.
- A **visão**, um mapeamento declarativo do **estado**;
- As **ações**, as possíveis maneiras de como o estado poderia mudar em reação às entradas do utilizador a partir da **visão**.

Isto é uma representação simples do conceito de "fluxo de dados unidirecional":

<p style="text-align: center">
  <img alt="diagrama do fluxo de estado" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

No entanto, a simplicidade começa a ser quebrada quando temos **vários componentes que partilham um estado comum**:

1. Várias visões que podem depender do mesmo pedaço de estado.
2. As ações de diferentes visões podem precisar de alterar o mesmo pedaço de estado.

Para o primeiro caso, uma possível solução alternativa é "elevar" o estado partilhado até um componente ancestral comum e depois passá-lo como propriedades. No entanto, isto torna-se rapidamente tedioso em árvores de componentes com hierarquias profundas, levando a outro problema conhecido como [Perfuração de Propriedade](/guide/components/provide-inject#prop-drilling).

Para o segundo caso, muitas vezes recorremos a soluções como procurar instâncias diretas de pais ou filhos por meio de referências de modelos de marcação, ou tentar alterar e sincronizar várias cópias do estado por meio de eventos emitidos. Ambos os padrões são frágeis e conduzem rapidamente a código impossível de manter.

Uma solução mais simples e direta é extrair o estado partilhado dos componentes e geri-lo num objeto autónomo global. Com isto, a nossa árvore de componentes transforma-se numa grade "visão" e qualquer componente pode aceder ao estado ou desencadear ações, independentemente da sua posição na árvore!

## Gestão de Estado Simples com API de Reatividade {#simple-state-management-with-reactivity-api}

<div class="options-api">

Na API de Opções, os dados reativos são declarados usando a opção `data()`. Internamente, o objeto retornado por `data()` é tornado reativo através da função [`reactive()`](/api/reactivity-core#reactive), que também está disponível como uma API pública.

</div>

Se tivermos um pedaço de estado que deve ser partilhado por várias instâncias, podemos usar [`reactive()`](/api/reactivity-core#reactive) para criar um objeto reativo, e depois importá-lo em vários componentes:

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue
<!-- ComponentA.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

</div>

Agora, sempre que o objeto `store` for alterado, tanto `<ComponentA>` como `<ComponentB>` atualizarão suas visões automaticamente — temos agora uma única fonte de verdade.

No entanto, isto também significa que qualquer componente que importe `store` pode alterá-lo como quiser:

```vue-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

Embora isto funcione em casos simples, o estado global que pode ser arbitrariamente alterado por qualquer componente não será muito sustentável a longo prazo. Para garantir que a lógica de alteração do estado está centralizada, tal como o próprio estado, recomenda-se a definição de métodos na memória com nomes que expressam a intenção das ações:

```js{6-8}
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd1csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9kasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyX/IftlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip DICA
Nota que o manipulador de clique usa `store.increment()` com parênteses — isto é necessário para chamar o método com o contexto de `this` apropriado, já que não é um método de componente.
:::

Embora aqui estejamos usando um único objeto reativo como memória, também podemos partilhar o estado reativo criado usando outras [APIs de Reatividade](/api/reactivity-core), como `ref()` ou `computed()`, ou mesmo retornar o estado global duma [Função de Composição](/guide/reusability/composables):

```js
import { ref } from 'vue'

// estado global, criado no âmbito do módulo
const globalCount = ref(1)

export function useCount() {
  // estado local, criado por componente
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

O fato de o sistema de reatividade da Vue estar dissociado do modelo de componente torna-o extremamente flexível.

## Considerações da Interpretação do Lado do Servidor {#ssr-considerations}

Se estivermos construindo uma aplicação que recorre à [Interpretação do Lado do Servidor (SSR)](./ssr), o padrão acima pode dar origem a problemas pelo fato da memória ser um simples elemento partilhado entre várias requisições. Esta questão é abordada [mais detalhadamente](./ssr#cross-request-state-pollution) no guia da Interpretação do Lado do Servidor.

## Pinia {#pinia}

Embora a nossa solução de gestão de estado manual satisfaça cenários simples, existe muitos outros aspetos a considerar em aplicações de produção em grande escala:

- Convenções mais fortes para colaboração em equipa
- Integração com as Ferramentas de Programação da Vue, incluindo linha de tempo, inspeção no componente e depuração de viagens no tempo
- Substituição de Módulo Instantânea
- Suporte à Interpretação do Lado do Servidor

[Pinia](https://pinia-docs-pt.netlify.app/) é uma biblioteca de gestão de estado que implementa todos itens acima. É mantida pela equipa principal da Vue, e funciona tanto com a Vue 2 como com a Vue 3.

Os utilizadores existentes podem estar familiarizados com a [Vuex](https://vuex.vuejs.org/), a anterior biblioteca oficial de gestão de estados da Vue. Com a Pinia a desempenhar o mesmo papel no ecossistema, a Vuex está agora em modo de manutenção. Ela ainda funciona, mas não receberá mais novos recursos. Recomenda-se o uso da Pinia para as novas aplicações.

A Pinia começou como uma exploração do que poderia ser a próxima iteração da Vuex, incorporando muitas ideias das discussões da equipa principal para a Vuex 5. Eventualmente, percebemos que a Pinia já implementa a maioria do que queríamos na Vuex 5, e decidimos fazer dela a nova recomendação.

Em comparação com a Vuex, a Pinia fornece uma API mais simples com menos cerimónias, oferece APIs de estilo da API de Composição e, mais importante, tem um suporte sólido de inferência de tipos quando usada com a TypeScript. 
