# Gestão de Estado {#state-management}

## O Que é a Gestão de Estado? {#what-is-state-management}

Tecnicamente, toda instância de componente de Vue já faz a "gestão" do seu próprio estado reativo. Considere o componente contador como um exemplo:

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

<!-- visão ou apresentação -->
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

<!-- visão ou apresentação -->
<template>{{ count }}</template>
```

</div>

É uma unidade auto-contida com as seguintes partes:

- O **estado**, a fonte de verdade que orienta a nossa aplicação.
- A **visão (ou apresentação)**, um mapeamento declarativo do **estado**;
- As **ações**, as maneiras possíveis que o estado poderia mudar em reação as entradas do utilizador da **visão (ou apresentação)**.

Isto é uma representação simples do conceito do "fluxo de dados de uma via":

<p style="text-align: center">
  <img alt="diagrama do fluxo de estado" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

No entanto, a simplicidade começa a decompor-se quando temos **vários componentes que partilham um estado comum**:

1. Várias visões que podem depender do mesmo pedaço de estado.
2. Ações de visões diferentes que podem precisar mudar o mesmo pedaço de estado.

Para o primeiro caso, uma possível solução é "transportando" o estado partilhado para cima para um componente ancestral comum, e depois passar para baixo como propriedades. No entanto, isto torna-se rapidamente entediante em árvores de componente com hierarquias profundas, levando para um outro problema conhecido como [Perfuração de Propriedade](/guide/components/provide-inject#prop-drilling).

Para o segundo caso, frequentemente encontramos-nos recorrendo a soluções tais como chegar ao instâncias pai ou filha direta através de referências, ou tentando alterar e sincronizar várias cópias do estado através de eventos emitidos. Ambos os padrões são frágeis e conduzem rapidamente a um código insustentável.

Uma solução mais simples e mais direita é extrair o estado partilhado para fora dos componentes, e operá-lo em um monotónico (singleton, em Inglês) global. Com isto, o nossa árvore de componente torna-se uma grande "visão", e qualquer componente pode acessar o estado ou acionar as ações, não importa onde eles estão na árvore!

## Gestão de Estado Simples com API de Reatividade {#simple-state-management-with-reactivity-api}

<div class="options-api">

Na API de Opções, o dado reativo é declarado com o uso da opção `data()`. Internamente, o objeto retornado pelo `data()` é tornado reativo através da função [`reactive()`](/api/reactivity-core#reactive), que também está disponível como uma API pública.

</div>

Se tiveres um pedaço de estado que deveria ser partilhado por várias instâncias, podes usar [`reactive()`](/api/reactivity-core#reactive) criar um objeto reativo, e então importá-lo a partir de vários componentes:

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

Agora sempre que o objeto `store` é alterado, ambos `<ComponentA>` e `<ComponentB>` atualizarão suas apresentações automaticamente - agora nós temos uma fonte única de verdade.

No entanto, isto também significa que qualquer componente importando `store` pode alterá-lo de qualquer modo que quiserem:

```vue-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

Enquanto isto funciona em casos simples, estado global que pode ser alterado arbitrariamente por qualquer componente não será muito sustentável a longo prazo. Para garantir que a lógica de mutação de estado esteja centralizada como o próprio estado, é recomendado definir métodos na memória (store, em Inglês) com nomes que expressam a intenção das ações:

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

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd1csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9kasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyX/IftlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip DICA
Nota que o manipulador de clique usa `store.increment()` com os parênteses - isto é necessário para chamar o método com o contexto `this` apropriado já que não é um método do componente.
:::

Embora que estejamos a usar um único objeto reativo como uma memória, também podes partilhar o estado reativo criado com uso de outras [APIs de Reatividade](/api/reactivity-core) tal como `ref()` ou `computed()`, ou mesmo retornar o estado global a partir de um [Constituível](/guide/reusability/composables):

```js
import { ref } from 'vue'

// estado global, criado no escopo do módulo
const globalCount = ref(1)

export function useCount() {
  // estado local, criado por cada componente
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

O fato do sistema de reatividade da Vue estar separado do modelo do componente torna-o extremamente flexível.

## Considerações de SSR {#ssr-considerations}

Se estiveres construindo uma aplicação que influencia a [Interpretação no Lado do Servidor (SSR, sigla em Inglês)](./ssr), o padrão acima pode levar a problemas devido a memória ser uma monotónica (singleton, em Inglês) partilhada através de várias requisições. Isto é discutido em [mais detalhes](./ssr#cross-request-state-pollution) no guia da SSR.

## Pinia {#pinia}

Enquanto a nossa solução de gestão de estado simples será suficiente em cenários simples, existem muitas outras coisas a considerar aplicações de produção de grande escala:

- Convenções mais fortes para colaboração da equipa
- Integração com as Ferramentas de Programação de Vue, incluindo a linha do tempo, inspeção dentro do componente, e a depuração capaz de viajar no tempo
- Substituição de Módulo Instantânea
- Suporte a Interpretação no Lado do Servidor

[Pinia](https://pinia.vuejs.org) é uma biblioteca de gestão de estado que implementa tudo que está acima. Ela é mantida pela equipa principal da Vue, e funciona com ambas Vue 2 e Vue 3.

Os utilizadores existentes podem estar familiarizados com [Vuex](https://vuex.vuejs.org/), a anterior biblioteca de gestão de estado oficial para Vue. Com a Pinia servindo o mesmo propósito no ecossistema, a Vuex está agora em modo de manutenção. Ela continua a funcionar, mas já não recebe novas funcionalidades. É recomendado usar a Pinia para as aplicações novas.

A Pinia começou como uma exploração de como seria a próxima iteração da Vuex, incorporando muitas ideias das discussões da equipa principal sobre a Vuex 5. Eventualmente, nós percebemos que a Pinia já implementa a maior parte daquilo que nós queríamos na Vuex 5, e então decidimos torná-la a nova recomendação.

Comparada a Vuex, a Pinia fornece uma API mais simples com menos cerimónias, oferece APIs no estilo da API de Composição, e mais importante, tem suporte sólido a inferência de tipo quando usada com a TypeScript.
